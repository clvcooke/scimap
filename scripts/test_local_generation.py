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
                patch.object(publisher, "rclone", side_effect=lambda *a, **_: calls.append(a[0])),
                patch.object(
                    publisher,
                    "verify_public",
                    side_effect=lambda root, url, paths: calls.append(("public", tuple(paths))) or [],
                ),
            ):
                record = publisher.publish_release(args)

        self.assertEqual(record["destination"], "r2:bucket/terminations/releases/candidate-1")
        self.assertEqual(record["status"], "published")
        self.assertEqual(calls[:2], ["copy", "check"])
        self.assertNotIn("manifest.json", calls[2][1])
        self.assertIn("tiles/states/0/0/0.pbf", calls[2][1])
        self.assertEqual(calls[3:], ["copyto", ("public", ("manifest.json",))])

    def test_publisher_refuses_non_empty_destination(self):
        with tempfile.TemporaryDirectory() as directory:
            manifest, args = publish_fixture(directory)
            with (
                patch.object(publisher.validator, "validate_release", return_value=manifest),
                patch.object(publisher, "destination_is_empty", return_value=False),
                patch.object(publisher, "rclone") as rclone,
                self.assertRaisesRegex(SystemExit, "non-empty"),
            ):
                publisher.publish_release(args)
        rclone.assert_not_called()

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


if __name__ == "__main__":
    unittest.main()
