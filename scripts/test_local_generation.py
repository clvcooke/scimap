import importlib.util
import json
from pathlib import Path
from types import SimpleNamespace
import tempfile
import unittest
from unittest.mock import patch
import zipfile


def load_script(name):
    path = Path(__file__).with_name(name)
    spec = importlib.util.spec_from_file_location(path.stem, path)
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


terminations = load_script("terminations.py")
tables = load_script("generate_termination_table_data.py")
builder = load_script("build_termination_release.py")
validator = load_script("validate_termination_release.py")
publisher = load_script("publish_termination_release.py")


def publish_fixture(directory):
    root = Path(directory, "release")
    (root / "tiles" / "states" / "0" / "0").mkdir(parents=True)
    (root / "tiles" / "states" / "0" / "0" / "0.pbf").write_bytes(b"tile")
    (root / "tables").mkdir()
    (root / "tables" / "states.json").write_text("{}")
    (root / "manifest.json").write_text("{}")
    manifest = {
        "release_id": "candidate-1",
        "artifacts": {
            "tiles": {"states": {}},
            "tables": {"states": {"path": "tables/states.json"}},
            "institutions": {"path": "tables/states.json"},
            "state_totals": {"path": "tables/states.json"},
            "inputs": {"scientific_run": None},
        },
    }
    args = SimpleNamespace(
        release=root,
        remote="r2:bucket",
        prefix="terminations/releases",
        public_base="https://data.example.org",
        record=Path(directory, "record.json"),
        transfers=4,
        dry_run=False,
    )
    return manifest, args


def encode_varint(value):
    out = bytearray()
    while True:
        byte, value = value & 0x7F, value >> 7
        out.append(byte | (0x80 if value else 0))
        if not value:
            return bytes(out)


def encode_field(number, payload):
    return encode_varint(number << 3 | 2) + encode_varint(len(payload)) + payload


def encode_tile(layer, features):
    """Tiny MVT encoder for tests: string and double properties, no geometry."""
    import struct
    keys, values, body = [], [], b""
    for properties in features:
        tags = []
        for key, value in properties.items():
            if key not in keys:
                keys.append(key)
            encoded = encode_field(1, value.encode()) if isinstance(value, str) else (
                encode_varint(3 << 3 | 1) + struct.pack("<d", value)
            )
            if encoded not in values:
                values.append(encoded)
            tags += [keys.index(key), values.index(encoded)]
        body += encode_field(2, encode_field(2, b"".join(encode_varint(tag) for tag in tags)))
    body = encode_field(1, layer.encode()) + body
    body += b"".join(encode_field(3, key.encode()) for key in keys)
    body += b"".join(encode_field(4, value) for value in values)
    return encode_field(3, body)


def tile_release(directory, table_rows, tile_features, level="counties"):
    root = Path(directory)
    (root / "tiles" / level / "0" / "0").mkdir(parents=True)
    (root / "tiles" / level / "0" / "0" / "0.pbf").write_bytes(encode_tile(f"terminations_{level}", tile_features))
    (root / "tables").mkdir()
    (root / "tables" / f"{level}.json").write_text(json.dumps(table_rows))
    return root, {
        "metrics": {"current": {"tile_property": "terminated_current_econ_loss"}},
        "artifacts": {
            "tiles": {level: {"layer": f"terminations_{level}", "id_property": "FIPS"}},
            "tables": {level: {"path": f"tables/{level}.json"}},
        },
    }


def table_row(identifier, value, name="County"):
    return {"id": identifier, "name": name, "total_econ_loss": value * 2,
            "total_funding_loss": value, "total_job_loss": value / 1000}


def tile_feature(identifier, value):
    return {"FIPS": identifier, "terminated_current_econ_loss": value * 2,
            "terminated_current_loss": value, "terminated_current_job_loss": value / 1000}


class LocalGenerationSafetyTest(unittest.TestCase):
    def test_explicit_commands_have_no_upload_option(self):
        self.assertFalse(hasattr(terminations.parse_args([]), "upload"))

    def test_bare_table_command_retains_legacy_output_destination(self):
        self.assertEqual(tables.cli_output_dir(None, 1), tables.LEGACY_OUTPUT_DIR)
        self.assertEqual(tables.cli_output_dir(None, 2), tables.DEFAULT_OUTPUT_DIR)

    def test_programmatic_main_is_local_and_bare_command_can_publish(self):
        levels = {name: {} for name in ("states", "counties", "districts", "cities")}
        with tempfile.TemporaryDirectory() as directory:
            args = SimpleNamespace(
                nih_dir="nih",
                nsf_dir="nsf",
                combined_dir="combined",
                output_dir=directory,
                release_id="release",
                geo_dir="geo",
                levels=("states", "counties", "districts"),
                week=None,
            )
            with (
                patch.object(terminations, "parse_args", return_value=args),
                patch.object(terminations, "REACT_DATA_DIR", directory),
                patch.object(terminations, "build_levels", return_value=levels),
                patch.object(terminations, "process_level", return_value=None) as process,
                patch.object(terminations, "generate_terminated_grants"),
            ):
                terminations.main()
                local_calls = process.call_args_list
                process.reset_mock()
                terminations.main(publish=True)
                publish_calls = process.call_args_list

        self.assertEqual([call.args[0] for call in local_calls], list(args.levels))
        self.assertTrue(all(not call.kwargs["publish"] for call in local_calls))
        self.assertEqual([call.args[0] for call in publish_calls], list(levels))
        self.assertTrue(all(call.kwargs["publish"] for call in publish_calls))

    def test_default_outputs_are_outside_frontend_data(self):
        frontend_data = Path(terminations.PROJECT_ROOT, "src", "data").resolve()
        self.assertNotEqual(Path(terminations.DEFAULT_OUTPUT_DIR).resolve(), frontend_data)
        self.assertNotEqual(Path(tables.DEFAULT_OUTPUT_DIR).resolve(), frontend_data)

    def test_city_generation_is_excluded_by_default(self):
        self.assertEqual(
            terminations.parse_args([]).levels,
            ("states", "counties", "districts"),
        )

    def test_missing_table_values_do_not_become_zero(self):
        self.assertIsNone(tables.safe_float("NA"))
        self.assertEqual(tables.agency_value({}, "01", "current_loss"), 0.0)
        self.assertIsNone(tables.combined_value(None, 1.0, 2))

    def test_missing_tile_values_do_not_become_zero(self):
        nih = terminations.pd.DataFrame(
            [{"id": "01", "current_loss": None}]
        )
        nsf = terminations.pd.DataFrame(
            [
                {"id": "01", "current_loss": 1.0},
                {"id": "02", "current_loss": 2.0},
            ]
        )
        rows = terminations.combine_nih_nsf(nih, nsf, "id").set_index("id")
        self.assertTrue(terminations.pd.isna(rows.loc["01", "terminated_current_loss"]))
        self.assertEqual(rows.loc["02", "nih_current_loss"], 0.0)
        self.assertEqual(rows.loc["02", "terminated_current_loss"], 2.0)

    def test_cached_geo_zip_is_extracted(self):
        with tempfile.TemporaryDirectory() as directory:
            archive = Path(directory, "reference.zip")
            with zipfile.ZipFile(archive, "w") as zipped:
                zipped.writestr("reference/value.txt", "ok")
            Path(directory, "reference", "reference").mkdir(parents=True)
            with (
                patch.object(terminations, "GEO_CACHE_DIR", directory),
                patch.object(terminations, "R2_FILES", [archive.name]),
            ):
                terminations.download_geo_refs()
            self.assertEqual(
                Path(directory, "reference", "reference", "value.txt").read_text(),
                "ok",
            )

    def test_state_summary_writes_missing_values_as_null(self):
        frame = terminations.pd.DataFrame(
            [{"state": "AA", "terminated_econ_loss": float("nan"), "terminated_job_loss": 1}]
        )
        with tempfile.TemporaryDirectory() as directory:
            with patch.object(terminations, "JSON_OUTPUT_DIR", directory):
                terminations.generate_state_totals(frame)
            path = Path(directory, "state_total_losses.json")
            self.assertIsNone(json.loads(path.read_text())["STATE_LOSSES"]["AA"]["term_loss"])
            self.assertNotIn("NaN", path.read_text())

    def test_institution_summary_rejects_missing_required_values(self):
        row = {
            "week": "2026-09-25",
            "org_name": "Example",
            "org_city": "CITY",
            "org_state": "MD",
            "lat": 1,
            "lon": 2,
            "current_loss.combined": 1,
            "current_loss.nih": None,
            "current_loss.nsf": 1,
            "current_grant_loss.nih": 0,
            "current_grant_loss.nsf": 1,
            "current_grant_loss.combined": 1,
        }
        with tempfile.TemporaryDirectory() as directory:
            terminations.pd.DataFrame([row]).to_csv(
                Path(directory, "terminations_org_combined.csv"), index=False
            )
            with (
                patch.object(terminations, "COMBINED_DIR", directory),
                patch.object(terminations, "OUTPUT_DIR", directory),
                self.assertRaisesRegex(RuntimeError, "current_loss.nih"),
            ):
                terminations.generate_terminated_grants("2026-09-25")

    def test_release_validator_rejects_checksum_mismatch(self):
        with tempfile.TemporaryDirectory() as directory:
            path = Path(directory, "value.json")
            path.write_text("{}")
            with self.assertRaisesRegex(RuntimeError, "Checksum mismatch"):
                validator.validate_file(
                    Path(directory),
                    {"path": "value.json", "bytes": 2, "sha256": "0" * 64},
                )

    def test_release_id_rejects_paths(self):
        for release_id in (".", "..", "-bad", "../bad"):
            args = SimpleNamespace(release_id=release_id, week="2026-09-25")
            with self.subTest(release_id=release_id), self.assertRaises(SystemExit):
                builder.build_release(args)

    def test_publisher_uploads_manifest_last_after_public_verification(self):
        calls = []
        with tempfile.TemporaryDirectory() as directory:
            manifest, args = publish_fixture(directory)
            with (
                patch.object(publisher.validator, "validate_release", return_value=manifest),
                patch.object(publisher, "destination_is_empty", return_value=True),
                patch.object(publisher, "rclone", side_effect=lambda *a, **_: calls.append(a)),
                patch.object(
                    publisher,
                    "verify_public",
                    side_effect=lambda root, url, paths: calls.append(("public", tuple(paths))) or [],
                ),
            ):
                record = publisher.publish_release(args)

        self.assertEqual(record["destination"], "r2:bucket/terminations/releases/candidate-1")
        self.assertEqual(record["status"], "published")
        self.assertEqual([call[0] for call in calls], ["copy", "check", "public", "copyto", "public"])
        for bulk in calls[:2]:
            self.assertIn("--exclude", bulk)
            self.assertEqual(bulk[bulk.index("--exclude") + 1], "/manifest.json")
        self.assertNotIn("manifest.json", calls[2][1])
        self.assertIn("tiles/states/0/0/0.pbf", calls[2][1])
        self.assertEqual(calls[3][2], "r2:bucket/terminations/releases/candidate-1/manifest.json")
        self.assertEqual(calls[4], ("public", ("manifest.json",)))

    def test_publisher_records_refused_non_empty_destination(self):
        with tempfile.TemporaryDirectory() as directory:
            manifest, args = publish_fixture(directory)
            with (
                patch.object(publisher.validator, "validate_release", return_value=manifest),
                patch.object(publisher, "destination_is_empty", return_value=False),
                patch.object(publisher, "rclone") as rclone,
                self.assertRaisesRegex(SystemExit, "non-empty"),
            ):
                publisher.publish_release(args)
            record = json.loads(args.record.read_text())
        rclone.assert_not_called()
        self.assertEqual(record["status"], "refused")
        self.assertIn("non-empty", record["error"])

    def test_failed_manifest_check_records_uploaded_manifest(self):
        def fake_public(root, url, paths):
            if paths == ["manifest.json"]:
                raise RuntimeError("Public copy does not match local release: manifest.json")
            return []

        with tempfile.TemporaryDirectory() as directory:
            manifest, args = publish_fixture(directory)
            with (
                patch.object(publisher.validator, "validate_release", return_value=manifest),
                patch.object(publisher, "destination_is_empty", return_value=True),
                patch.object(publisher, "rclone"),
                patch.object(publisher, "verify_public", side_effect=fake_public),
                self.assertRaises(RuntimeError),
            ):
                publisher.publish_release(args)
            record = json.loads(args.record.read_text())
        self.assertEqual(record["status"], "manifest_uploaded")

    def test_interrupted_upload_is_recorded_without_manifest(self):
        calls = []
        recorded = []

        def fake_rclone(*command, **_):
            calls.append(command[0])
            recorded.append(json.loads(args.record.read_text())["status"])
            if command[0] == "copy":
                raise KeyboardInterrupt

        with tempfile.TemporaryDirectory() as directory:
            manifest, args = publish_fixture(directory)
            with (
                patch.object(publisher.validator, "validate_release", return_value=manifest),
                patch.object(publisher, "destination_is_empty", return_value=True),
                patch.object(publisher, "rclone", side_effect=fake_rclone),
                self.assertRaises(KeyboardInterrupt),
            ):
                publisher.publish_release(args)
            record = json.loads(args.record.read_text())

        self.assertEqual(calls, ["copy"])
        self.assertEqual(recorded, ["uploading"])
        self.assertEqual(record["status"], "interrupted")
        self.assertEqual(record["interrupted_during"], "uploading")

    def test_release_validator_rejects_undeclared_files(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            (root / "tiles" / "states").mkdir(parents=True)
            (root / "tiles" / "states" / "0.pbf").write_bytes(b"tile")
            for name in ("manifest.json", "institutions.json", "notes.txt"):
                (root / name).write_text("{}")
            artifacts = {
                "tiles": {"states": {}},
                "tables": {},
                "downloads": {},
                "inputs": {"scientific_run": None},
                "institutions": {"path": "institutions.json"},
                "state_totals": {"path": "institutions.json"},
            }
            with self.assertRaisesRegex(RuntimeError, "notes.txt"):
                validator.reject_undeclared_files(root, artifacts)
            (root / "notes.txt").unlink()
            validator.reject_undeclared_files(root, artifacts)

    def test_failed_verification_leaves_manifest_unpublished(self):
        calls = []

        def fake_rclone(*command, **_):
            calls.append(command[0])
            if command[0] == "check":
                raise RuntimeError("rclone check failed")

        with tempfile.TemporaryDirectory() as directory:
            manifest, args = publish_fixture(directory)
            with (
                patch.object(publisher.validator, "validate_release", return_value=manifest),
                patch.object(publisher, "destination_is_empty", return_value=True),
                patch.object(publisher, "rclone", side_effect=fake_rclone),
                self.assertRaisesRegex(RuntimeError, "check failed"),
            ):
                publisher.publish_release(args)
            record = json.loads(args.record.read_text())

        self.assertNotIn("copyto", calls)
        self.assertEqual(record["status"], "uploaded")
        self.assertIn("check failed", record["error"])


    def test_tile_reader_round_trips_properties(self):
        layers = validator.read_tile(encode_tile("terminations_counties", [tile_feature("6001", 10.5)]))
        self.assertEqual(layers["terminations_counties"][0]["FIPS"], "6001")
        self.assertEqual(layers["terminations_counties"][0]["terminated_current_loss"], 10.5)

    def test_tiles_match_tables_including_territory_aggregates(self):
        with tempfile.TemporaryDirectory() as directory:
            root, manifest = tile_release(
                directory,
                [table_row("06001", 10), table_row("72127", 3), table_row("72013", 4)],
                [tile_feature("6001", 10), tile_feature("72000", 7)],
            )
            self.assertEqual(validator.validate_tile_content(root, manifest), [])

    def test_table_row_missing_from_tiles_fails(self):
        with tempfile.TemporaryDirectory() as directory:
            root, manifest = tile_release(directory, [table_row("06001", 10), table_row("06003", 2)], [tile_feature("6001", 10)])
            with self.assertRaisesRegex(RuntimeError, "06003"):
                validator.validate_tile_content(root, manifest)

    def test_tile_value_must_match_table(self):
        with tempfile.TemporaryDirectory() as directory:
            root, manifest = tile_release(directory, [table_row("06001", 10)], [tile_feature("6001", 11)])
            with self.assertRaisesRegex(RuntimeError, "06001"):
                validator.validate_tile_content(root, manifest)

    def test_territory_aggregate_must_reconcile(self):
        with tempfile.TemporaryDirectory() as directory:
            root, manifest = tile_release(directory, [table_row("72127", 3), table_row("72013", 4)], [tile_feature("72000", 9)])
            with self.assertRaisesRegex(RuntimeError, "Territory aggregate 72000"):
                validator.validate_tile_content(root, manifest)

    def test_territory_missing_from_tiles_is_a_warning(self):
        with tempfile.TemporaryDirectory() as directory:
            root, manifest = tile_release(directory, [table_row("06001", 10), table_row("66010", 1, "Guam")], [tile_feature("6001", 10)])
            warnings = validator.validate_tile_content(root, manifest)
        self.assertEqual(len(warnings), 1)
        self.assertIn("66010 (Guam)", warnings[0])

    def test_negative_tile_value_fails(self):
        with tempfile.TemporaryDirectory() as directory:
            root, manifest = tile_release(directory, [table_row("06001", -1)], [tile_feature("6001", -1)])
            with self.assertRaisesRegex(RuntimeError, "invalid"):
                validator.validate_tile_content(root, manifest)

    def test_every_tile_copy_must_match(self):
        with tempfile.TemporaryDirectory() as directory:
            root, manifest = tile_release(directory, [table_row("06001", 10)], [tile_feature("6001", 10)])
            (root / "tiles" / "counties" / "1" / "0").mkdir(parents=True)
            (root / "tiles" / "counties" / "1" / "0" / "0.pbf").write_bytes(
                encode_tile("terminations_counties", [tile_feature("6001", 11)])
            )
            with self.assertRaisesRegex(RuntimeError, "different values"):
                validator.validate_tile_content(root, manifest)

    def test_tile_feature_with_loss_but_no_table_row_fails(self):
        with tempfile.TemporaryDirectory() as directory:
            features = [tile_feature("6001", 10), tile_feature("6003", 5), tile_feature("6005", 0)]
            root, manifest = tile_release(directory, [table_row("06001", 10)], features)
            with self.assertRaisesRegex(RuntimeError, "no table row: 06003"):
                validator.validate_tile_content(root, manifest)

    def test_tile_totals_must_equal_nih_plus_nsf(self):
        with tempfile.TemporaryDirectory() as directory:
            feature = {**tile_feature("6001", 10), "nih_current_loss": 4.0, "nsf_current_loss": 5.0,
                       "terminated_loss": 20.0}
            root, manifest = tile_release(directory, [table_row("06001", 10)], [feature])
            with self.assertRaisesRegex(RuntimeError, "NIH \\+ NSF"):
                validator.validate_tile_content(root, manifest)

    def test_current_loss_cannot_exceed_overall(self):
        with tempfile.TemporaryDirectory() as directory:
            feature = {**tile_feature("6001", 10), "terminated_loss": 5.0}
            root, manifest = tile_release(directory, [table_row("06001", 10)], [feature])
            with self.assertRaisesRegex(RuntimeError, "exceeds"):
                validator.validate_tile_content(root, manifest)

if __name__ == "__main__":
    unittest.main()
