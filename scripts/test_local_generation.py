from contextlib import redirect_stdout
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
import importlib.util
import io
import json
import os
from pathlib import Path
import shutil
import ssl
import subprocess
from types import SimpleNamespace
import tempfile
import threading
import unittest
from unittest.mock import patch
from urllib.parse import parse_qs, unquote, urlsplit
from xml.sax.saxutils import escape
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
            "downloads": {},
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

    def test_territory_fallback_requires_guam_district_geometry(self):
        from shapely.geometry import box
        guam = box(144.6, 13.2, 145.0, 13.7)
        shapes = {'7298': box(-68, 17, -65, 19), '7898': box(-65, 17, -64, 19), '6698': guam}
        with patch.object(terminations, 'load_geometries', return_value=(shapes, {})):
            self.assertTrue(terminations.load_territory_geometries()['GU'].equals(guam))
        for geoid in shapes:
            with self.subTest(missing=geoid), patch.object(
                terminations, 'load_geometries',
                return_value=({key: geom for key, geom in shapes.items() if key != geoid}, {}),
            ):
                with self.assertRaisesRegex(RuntimeError, geoid):
                    terminations.load_territory_geometries()

    def test_guam_state_and_county_fallback_preserves_losses_and_missing_values(self):
        from shapely.geometry import box, shape
        guam = box(144.6, 13.2, 145.0, 13.7)
        territories = {'PR': box(-68, 17, -65, 19), 'VI': box(-65, 17, -64, 19), 'GU': guam}
        for level in ('states', 'counties'):
            for missing in (False, True):
                with self.subTest(level=level, missing=missing), tempfile.TemporaryDirectory() as directory:
                    key = 'state' if level == 'states' else 'FIPS'
                    guam_key = 'GU' if level == 'states' else '66010'
                    mainland = 'CA' if level == 'states' else '06001'
                    # A second synthetic county ensures known values cannot hide an unknown.
                    identifiers = (guam_key, mainland) if level == 'states' else (guam_key, '66020', mainland)
                    def frame(value):
                        return terminations.pd.DataFrame([
                            {key: identifier, 'week': '2026-10-23', **dict.fromkeys(terminations.VALUE_COLS, value)}
                            for identifier in identifiers
                        ])
                    nih, nsf = frame(1.0), frame(2.0)
                    if missing:
                        nih.loc[nih[key] == guam_key, 'current_loss'] = float('nan')
                    attrs = {} if level == 'states' else {mainland: {'county': 'Alameda County', 'state': 'California'}}
                    config = {'csv_key': key, 'geo_key': key, 'zoom': 0, 'nih_csv': 'nih', 'nsf_csv': 'nsf', 'geo': 'mainland', 'attr_cols': list(attrs.get(mainland, {}))}
                    with (
                        patch.object(terminations, 'OUTPUT_DIR', directory),
                        patch.object(terminations, 'load_latest_week', side_effect=[nih, nsf]),
                        patch.object(terminations, 'load_geometries', return_value=({mainland: box(-123, 37, -122, 38)}, attrs)),
                        patch.object(terminations, 'load_territory_geometries', return_value=territories),
                        patch.object(terminations, 'generate_tiles'),
                    ):
                        terminations.process_level(level, config, reporting_week='2026-10-23')
                    features = {f['properties'][key]: f for f in json.loads(Path(directory, f'terminations_{level}.geojson').read_text())['features']}
                    target = features['GU' if level == 'states' else '66000']
                    self.assertTrue(shape(target['geometry']).equals(guam))
                    props = target['properties']
                    self.assertEqual(props['state'], 'GU')
                    count = 1 if level == 'states' else 2
                    self.assertEqual(props['nih_overall_loss'], count)
                    self.assertEqual(props['nsf_overall_loss'], 2 * count)
                    self.assertEqual(props['terminated_loss'], 3 * count)
                    self.assertEqual(props['nih_current_loss'], None if missing else count)
                    self.assertEqual(props['nsf_current_loss'], 2 * count)
                    self.assertEqual(props['terminated_current_loss'], None if missing else 3 * count)
                    self.assertEqual(features[mainland]['properties']['terminated_loss'], 3)
                    if level == 'counties':
                        self.assertNotIn('66010', features)

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

        def fake_aws(*command, capture=False):
            calls.append(("aws", command))
            return ""

        with tempfile.TemporaryDirectory() as directory:
            manifest, args = publish_fixture(directory)
            manifest["code"] = {"scimap": {"revision": "a" * 40, "dirty": False}}
            before = (args.release / "manifest.json").read_bytes()
            with (
                patch.object(publisher.validator, "validate_release", return_value=manifest),
                patch.object(publisher, "destination_is_empty", return_value=True),
                patch.object(publisher, "verify_remote", side_effect=lambda *a, **k: calls.append(("remote",))),
                patch.object(publisher, "verify_objects", side_effect=lambda *a, **k: calls.append(("objects",))),
                patch.object(publisher, "aws", side_effect=fake_aws),
                patch.object(
                    publisher,
                    "verify_public",
                    side_effect=lambda root, url, paths: calls.append(("public", tuple(paths))) or [],
                ),
            ):
                record = publisher.publish_release(args)
            self.assertEqual((args.release / "manifest.json").read_bytes(), before)

        puts = [call for call in calls if call[0] == "aws" and call[1][1] == "put-object"]
        self.assertEqual(record["destination"], "s3://bucket/terminations/releases/candidate-1")
        self.assertEqual(record["transport"], "aws-cli")
        self.assertEqual(record["status"], "published")
        self.assertEqual(record["candidate_code"], manifest["code"])
        self.assertEqual(len(record["publisher_code"]["revision"]), 40)
        self.assertNotEqual(record["publisher_code"]["revision"], "a" * 40)
        self.assertEqual([call[0] for call in calls], ["aws", "aws", "remote", "public", "aws", "objects", "public"])
        for _kind, command in puts:
            self.assertEqual(command[command.index("--if-none-match") + 1], "*")
            self.assertIn("--content-md5", command)
            self.assertNotIn("--checksum-algorithm", command)
        self.assertTrue(all(not command[command.index("--key") + 1].endswith("manifest.json") for _kind, command in puts[:-1]))
        self.assertTrue(puts[-1][1][puts[-1][1].index("--key") + 1].endswith("/manifest.json"))
        self.assertNotIn("manifest.json", calls[3][1])
        self.assertIn("tiles/states/0/0/0.pbf", calls[3][1])
        self.assertEqual(calls[-1], ("public", ("manifest.json",)))

    def test_publisher_records_refused_non_empty_destination(self):
        with tempfile.TemporaryDirectory() as directory:
            manifest, args = publish_fixture(directory)
            with (
                patch.object(publisher.validator, "validate_release", return_value=manifest),
                patch.object(publisher, "destination_is_empty", return_value=False),
                patch.object(publisher, "aws") as aws,
                self.assertRaisesRegex(SystemExit, "non-empty"),
            ):
                publisher.publish_release(args)
            record = json.loads(args.record.read_text())
        aws.assert_not_called()
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
                patch.object(publisher, "verify_remote"),
                patch.object(publisher, "verify_objects"),
                patch.object(publisher, "aws"),
                patch.object(publisher, "verify_public", side_effect=fake_public),
                self.assertRaises(RuntimeError),
            ):
                publisher.publish_release(args)
            record = json.loads(args.record.read_text())
        self.assertEqual(record["status"], "manifest_uploaded")

    def test_interrupted_upload_is_recorded_without_manifest(self):
        calls = []
        recorded = []

        def fake_aws(*command, capture=False):
            calls.append(command[1])
            recorded.append(json.loads(args.record.read_text())["status"])
            raise KeyboardInterrupt

        with tempfile.TemporaryDirectory() as directory:
            manifest, args = publish_fixture(directory)
            with (
                patch.object(publisher.validator, "validate_release", return_value=manifest),
                patch.object(publisher, "destination_is_empty", return_value=True),
                patch.object(publisher, "aws", side_effect=fake_aws),
                self.assertRaises(KeyboardInterrupt),
            ):
                publisher.publish_release(args)
            record = json.loads(args.record.read_text())

        self.assertEqual(calls, ["put-object"])
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

        def fake_verify(*_args, **_kwargs):
            calls.append("verify")
            raise RuntimeError("Remote checksum mismatch: terminations/releases/candidate-1/tables/states.json")

        with tempfile.TemporaryDirectory() as directory:
            manifest, args = publish_fixture(directory)
            with (
                patch.object(publisher.validator, "validate_release", return_value=manifest),
                patch.object(publisher, "destination_is_empty", return_value=True),
                patch.object(publisher, "aws", side_effect=lambda *command, capture=False: calls.append(command[1]) or ""),
                patch.object(publisher, "verify_remote", side_effect=fake_verify),
                self.assertRaisesRegex(RuntimeError, "checksum mismatch"),
            ):
                publisher.publish_release(args)
            record = json.loads(args.record.read_text())

        self.assertNotIn("manifest.json", "".join(str(call) for call in calls))
        self.assertEqual(record["status"], "uploaded")
        self.assertIn("checksum mismatch", record["error"])

    def test_verify_objects_hashes_downloaded_bytes(self):
        def fake_aws(*command, capture=False):
            self.assertEqual(command[1], "get-object")
            self.assertNotIn("--checksum-algorithm", command)
            Path(command[-1]).write_bytes(b"stored-bytes")
            return "{}"

        with tempfile.TemporaryDirectory() as directory:
            path = Path(directory, "states.json")
            path.write_bytes(b"local-bytes")
            with (
                patch.object(publisher, "aws", side_effect=fake_aws),
                self.assertRaisesRegex(RuntimeError, "checksum mismatch"),
            ):
                publisher.verify_objects("bucket", "prefix/", [("states.json", path)])

    def test_aws_cli_reports_missing_credentials(self):
        with patch.dict("os.environ", {}, clear=True):
            with self.assertRaisesRegex(SystemExit, "R2_ACCESS_KEY_ID"):
                publisher.aws_environment()

    def test_cli_output_preferences_cannot_upload_into_occupied_prefix(self):
        """Exercise the real subprocess boundary, not a mocked aws() function."""
        cases = {
            "off": ("occupied", SystemExit, "non-empty", "refused"),
            "text": ("occupied", SystemExit, "non-empty", "refused"),
            "blank": ("blank", RuntimeError, "no JSON", "started"),
            "malformed": ("malformed", RuntimeError, "malformed JSON", "started"),
            "incomplete": ("empty-object", RuntimeError, "KeyCount", "started"),
        }
        for output_mode, (body, error_type, message, status) in cases.items():
            with self.subTest(output_mode=output_mode):
                self.run_publisher_against_aws_stub(output_mode, body, error_type, message, status)

    def test_valid_empty_listing_is_not_refused(self):
        with tempfile.TemporaryDirectory() as directory:
            log = self.install_aws_stub(directory, "empty")
            with self.aws_stub_environment(directory, "off"):
                empty = publisher.destination_is_empty("bucket", "terminations/releases/candidate-1/")
            calls = [json.loads(line) for line in log.read_text().splitlines()]
        self.assertTrue(empty)
        self.assertEqual(len(calls), 1)
        self.assertIn("--output", calls[0]["args"])
        self.assertEqual(calls[0]["args"][calls[0]["args"].index("--output") + 1], "json")
        self.assertEqual(calls[0]["args"][calls[0]["args"].index("--region") + 1], "auto")
        self.assertIn("--no-paginate", calls[0]["args"])
        self.assertEqual(calls[0]["default_output"], "json")
        self.assertEqual(calls[0]["pager"], "")
        self.assertEqual(calls[0]["auto_prompt"], "off")
        self.assertEqual(calls[0]["region"], "auto")

    def install_aws_stub(self, directory, body):
        stub_dir = Path(directory, "bin")
        stub_dir.mkdir()
        log = Path(directory, "aws-stub.jsonl")
        log.write_text("")
        Path(directory, "stub-body").write_text(body)
        stub = stub_dir / "aws"
        stub.write_text(
            "#!/usr/bin/env python3\n"
            "import json, os, sys\n"
            "args = sys.argv[1:]\n"
            "log = os.environ['AWS_STUB_LOG']\n"
            "with open(log, 'a') as handle:\n"
            "    handle.write(json.dumps({\n"
            "        'args': args,\n"
            "        'default_output': os.environ.get('AWS_DEFAULT_OUTPUT'),\n"
            "        'pager': os.environ.get('AWS_PAGER'),\n"
            "        'auto_prompt': os.environ.get('AWS_CLI_AUTO_PROMPT'),\n"
            "        'region': os.environ.get('AWS_REGION'),\n"
            "    }) + '\\n')\n"
            "if 'put-object' in args:\n"
            "    raise SystemExit(0)\n"
            "output = args[args.index('--output') + 1] if '--output' in args else os.environ.get('AWS_DEFAULT_OUTPUT', 'json')\n"
            "body = open(os.environ['AWS_STUB_BODY']).read().strip()\n"
            "if output == 'json':\n"
            "    if body == 'blank':\n"
            "        raise SystemExit(0)\n"
            "    if body == 'malformed':\n"
            "        sys.stdout.write('not-json\\n')\n"
            "        raise SystemExit(0)\n"
            "    if body == 'empty-object':\n"
            "        sys.stdout.write('{}\\n')\n"
            "        raise SystemExit(0)\n"
            "    if 'list-objects-v2' in args and '--no-paginate' not in args and body in ('empty', 'occupied'):\n"
            "        payload = {'Prefix': 'terminations/releases/candidate-1/', 'RequestCharged': None}\n"
            "        if body == 'occupied':\n"
            "            payload['Contents'] = [{'Key': 'terminations/releases/candidate-1/existing'}]\n"
            "        sys.stdout.write(json.dumps(payload))\n"
            "        raise SystemExit(0)\n"
            "    if body == 'empty':\n"
            "        sys.stdout.write(json.dumps({'IsTruncated': False, 'KeyCount': 0, 'Name': 'bucket', 'Prefix': 'terminations/releases/candidate-1/', 'MaxKeys': 1}))\n"
            "        raise SystemExit(0)\n"
            "    if body == 'occupied':\n"
            "        sys.stdout.write(json.dumps({'IsTruncated': False, 'KeyCount': 1, 'Name': 'bucket', 'Prefix': 'terminations/releases/candidate-1/', 'MaxKeys': 1, 'Contents': [{'Key': 'terminations/releases/candidate-1/existing'}]}))\n"
            "        raise SystemExit(0)\n"
            "if output in ('off', 'none'):\n"
            "    raise SystemExit(0)\n"
            "sys.stdout.write('2026-01-01 00:00:00 existing\\n')\n"
            "raise SystemExit(0)\n"
        )
        stub.chmod(0o755)
        return log

    def aws_stub_environment(self, directory, output_mode):
        stub_dir = str(Path(directory, "bin"))
        return patch.dict(os.environ, {
            "R2_ACCESS_KEY_ID": "test-access-key",
            "R2_SECRET_ACCESS_KEY": "test-secret-key",
            "R2_ENDPOINT": "https://example.invalid",
            "AWS_DEFAULT_OUTPUT": output_mode,
            "AWS_REGION": "us-east-2",
            "AWS_STUB_LOG": str(Path(directory, "aws-stub.jsonl")),
            "AWS_STUB_BODY": str(Path(directory, "stub-body")),
            "PATH": stub_dir + os.pathsep + os.environ.get("PATH", ""),
        })

    def run_publisher_against_aws_stub(self, output_mode, body, error_type, message, status):
        with tempfile.TemporaryDirectory() as directory:
            manifest, args = publish_fixture(directory)
            log = self.install_aws_stub(directory, body)
            with (
                patch.object(publisher.validator, "validate_release", return_value=manifest),
                self.aws_stub_environment(directory, output_mode),
                self.assertRaisesRegex(error_type, message),
            ):
                self.assertEqual(os.environ["AWS_DEFAULT_OUTPUT"], output_mode)
                publisher.publish_release(args)
            record = json.loads(args.record.read_text())
            calls = [json.loads(line) for line in log.read_text().splitlines()]
        self.assertEqual(record["status"], status)
        self.assertFalse(any("put-object" in call["args"] for call in calls))
        self.assertTrue(calls)
        for call in calls:
            args = call["args"]
            self.assertEqual(args[args.index("--output") + 1], "json")
            self.assertEqual(args[args.index("--region") + 1], "auto")
            self.assertIn("--no-cli-pager", args)
            self.assertIn("--no-cli-auto-prompt", args)
            if "list-objects-v2" in args:
                self.assertIn("--no-paginate", args)
            self.assertEqual(call["default_output"], "json")
            self.assertEqual(call["pager"], "")
            self.assertEqual(call["auto_prompt"], "off")
            self.assertEqual(call["region"], "auto")
            self.assertNotIn("test-secret-key", " ".join(args))

    def test_dry_run_does_not_need_credentials(self):
        with tempfile.TemporaryDirectory() as directory:
            manifest, args = publish_fixture(directory)
            args.dry_run = True
            with (
                patch.object(publisher.validator, "validate_release", return_value=manifest),
                patch.object(publisher, "aws", side_effect=AssertionError("aws must not run")),
                patch.dict("os.environ", {}, clear=True),
            ):
                record = publisher.publish_release(args)
        self.assertEqual(record["transport"], "aws-cli")
        self.assertNotIn("finished_at", record)
        self.assertFalse(args.record.exists())

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

    def test_real_aws_cli_service_pagination_verifies_inventory(self):
        """Single-page and 1,005-key inventories must finish through the real CLI.

        The stub above cannot reproduce AWS CLI pagination. This fixture serves
        ListObjectsV2 pages, and the installed aws binary must be the client.
        """
        if shutil.which("aws") is None:
            self.fail("aws CLI is required to prove service pagination")
        prefix = "terminations/releases/pages/"
        single = {f"{prefix}a.bin": b"alpha", f"{prefix}nested/b.bin": b"beta"}
        multi = {f"{prefix}{index:04d}": b"item" for index in range(1005)}
        with tempfile.TemporaryDirectory(prefix="scimap-r2-pages-") as directory:
            root = Path(directory)
            cert, key = root / "cert.pem", root / "key.pem"
            subprocess.run(
                [
                    "openssl", "req", "-x509", "-newkey", "rsa:2048", "-nodes",
                    "-keyout", str(key), "-out", str(cert), "-days", "1",
                    "-subj", "/CN=localhost",
                    "-addext", "subjectAltName=DNS:localhost,IP:127.0.0.1",
                ],
                check=True, capture_output=True,
            )
            server = ThreadingHTTPServer(("127.0.0.1", 0), _ServicePageHandler)
            context = ssl.SSLContext(ssl.PROTOCOL_TLS_SERVER)
            context.load_cert_chain(cert, key)
            server.socket = context.wrap_socket(server.socket, server_side=True)
            server.objects = {}
            server.events = []
            thread = threading.Thread(target=server.serve_forever, daemon=True)
            thread.start()
            endpoint = f"https://127.0.0.1:{server.server_port}"
            env = {
                "R2_ACCESS_KEY_ID": "LOCAL_TEST_ONLY",
                "R2_SECRET_ACCESS_KEY": "LOCAL_TEST_ONLY",
                "R2_ENDPOINT": endpoint,
                "AWS_CONFIG_FILE": os.devnull,
                "AWS_SHARED_CREDENTIALS_FILE": os.devnull,
                "AWS_CA_BUNDLE": str(cert),
                "AWS_DEFAULT_OUTPUT": "off",
                "AWS_PAGER": "less",
                "AWS_CLI_AUTO_PROMPT": "on",
                "AWS_MAX_ATTEMPTS": "1",
                "AWS_S3_ADDRESSING_STYLE": "path",
            }
            try:
                with patch.dict(os.environ, env):
                    release = root / "release"
                    (release / "nested").mkdir(parents=True)
                    (release / "a.bin").write_bytes(single[f"{prefix}a.bin"])
                    (release / "nested" / "b.bin").write_bytes(single[f"{prefix}nested/b.bin"])
                    server.objects = dict(single)
                    server.events = []
                    with redirect_stdout(io.StringIO()) as single_log:
                        found = publisher.list_keys("bucket", prefix)
                        self.assertEqual(server.events, [
                            {"operation": "list", "count": 2, "offset": 0, "max_keys": 1000},
                        ])
                        server.events = []
                        publisher.verify_remote("bucket", prefix, release)
                    single_lists = [
                        line for line in single_log.getvalue().splitlines()
                        if "list-objects-v2" in line
                    ]
                    self.assertEqual(found, sorted(single))
                    self.assertEqual(len(single_lists), 2)
                    self.assertTrue(all("--no-paginate" in line for line in single_lists))
                    self.assertTrue(all("--continuation-token" not in line for line in single_lists))
                    self.assertEqual(server.events, [
                        {"operation": "list", "count": 2, "offset": 0, "max_keys": 1000},
                        {"operation": "get", "key": f"{prefix}a.bin"},
                        {"operation": "get", "key": f"{prefix}nested/b.bin"},
                    ])

                    server.objects = dict(multi)
                    server.events = []
                    with redirect_stdout(io.StringIO()) as multi_log:
                        found = publisher.list_keys("bucket", prefix)
                    multi_lists = [
                        line for line in multi_log.getvalue().splitlines()
                        if "list-objects-v2" in line
                    ]
                    self.assertEqual(found, sorted(multi))
                    self.assertEqual(len(found), 1005)
                    self.assertEqual(len(multi_lists), 2)
                    self.assertTrue(all("--no-paginate" in line for line in multi_lists))
                    self.assertNotIn("--continuation-token", multi_lists[0])
                    self.assertIn("--continuation-token", multi_lists[1])
                    self.assertEqual(server.events, [
                        {"operation": "list", "count": 1000, "offset": 0, "max_keys": 1000},
                        {"operation": "list", "count": 5, "offset": 1000, "max_keys": 1000},
                    ])
            finally:
                server.shutdown()
                server.server_close()


class _ServicePageHandler(BaseHTTPRequestHandler):
    protocol_version = "HTTP/1.1"

    def log_message(self, format, *args):
        return

    def do_GET(self):
        if len(self.server.events) > 6:
            self._send(500, b"<Error><Code>TooManyRequests</Code></Error>")
            return
        url = urlsplit(self.path)
        query = parse_qs(url.query)
        if "list-type" in query:
            prefix = query.get("prefix", [""])[0]
            keys = sorted(key for key in self.server.objects if key.startswith(prefix))
            offset = int(query.get("continuation-token", ["0"])[0])
            count = int(query.get("max-keys", ["1000"])[0])
            page = keys[offset:offset + count]
            truncated = offset + count < len(keys)
            self.server.events.append({
                "operation": "list", "count": len(page), "offset": offset, "max_keys": count,
            })
            contents = "".join(
                f"<Contents><Key>{escape(key)}</Key><Size>{len(self.server.objects[key])}</Size></Contents>"
                for key in page
            )
            token = f"<NextContinuationToken>{offset + count}</NextContinuationToken>" if truncated else ""
            body = (
                '<ListBucketResult xmlns="http://s3.amazonaws.com/doc/2006-03-01/">'
                f"<Name>bucket</Name><Prefix>{escape(prefix)}</Prefix>"
                f"<KeyCount>{len(page)}</KeyCount><MaxKeys>{count}</MaxKeys>"
                f"<IsTruncated>{str(truncated).lower()}</IsTruncated>{contents}{token}"
                "</ListBucketResult>"
            ).encode()
            self._send(200, body)
            return
        key = unquote(url.path).removeprefix("/bucket/")
        self.server.events.append({"operation": "get", "key": key})
        if key not in self.server.objects:
            self._send(404, b"<Error><Code>NoSuchKey</Code></Error>")
            return
        self._send(200, self.server.objects[key], "application/octet-stream")

    def _send(self, code, body, content_type="application/xml"):
        self.send_response(code)
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Content-Type", content_type)
        self.end_headers()
        self.wfile.write(body)


class ValidatedRunTest(unittest.TestCase):
    def make_run(self, directory, **changes):
        run = Path(directory)
        (run / "terminations_state.csv").write_text("state,week\nCA,2026-10-23\n")
        report = {
            "status": "passed",
            "as_of": "2026-10-26",
            "validation": {"mode": "enforce", "status": "passed", "warnings": [], "checks": []},
            "outputs": {"terminations_state.csv": {
                "bytes": (run / "terminations_state.csv").stat().st_size,
                "sha256": builder.sha256_file(run / "terminations_state.csv"),
            }},
        }
        for key, value in changes.items():
            report[key] = value
        (run / "run-report.json").write_text(json.dumps(report))
        return run

    def test_week_is_derived_from_as_of(self):
        with tempfile.TemporaryDirectory() as directory:
            report, week = builder.load_validated_run(self.make_run(directory), None)
            self.assertEqual(week, "2026-10-23")

    def test_reporting_weeks_start_on_friday(self):
        from datetime import date
        self.assertEqual(builder.reporting_week(date(2026, 10, 23)), date(2026, 10, 23))
        self.assertEqual(builder.reporting_week(date(2026, 10, 29)), date(2026, 10, 23))

    def test_rejects_week_mismatch(self):
        with tempfile.TemporaryDirectory() as directory:
            with self.assertRaisesRegex(SystemExit, "does not match"):
                builder.load_validated_run(self.make_run(directory), "2026-10-16")

    def test_rejects_report_mode_validation(self):
        with tempfile.TemporaryDirectory() as directory:
            run = self.make_run(directory, validation={"mode": "report", "status": "failed", "warnings": [], "checks": []})
            with self.assertRaisesRegex(SystemExit, "not enforced and passed"):
                builder.load_validated_run(run, None)

    def test_rejects_output_changed_after_validation(self):
        with tempfile.TemporaryDirectory() as directory:
            run = self.make_run(directory)
            (run / "terminations_state.csv").write_text("state,week\nCA,2026-10-16\n")
            with self.assertRaisesRegex(SystemExit, "changed after validation"):
                builder.load_validated_run(run, None)

    def test_rejects_unvalidated_extra_file(self):
        with tempfile.TemporaryDirectory() as directory:
            run = self.make_run(directory)
            (run / "terminations_county.csv").write_text("FIPS,week\n")
            with self.assertRaisesRegex(SystemExit, "not covered"):
                builder.load_validated_run(run, None)

    def test_rejects_missing_report(self):
        with tempfile.TemporaryDirectory() as directory:
            with self.assertRaisesRegex(SystemExit, "Missing run report"):
                builder.load_validated_run(Path(directory), None)

    def test_rejects_report_claiming_pass_with_errors(self):
        with tempfile.TemporaryDirectory() as directory:
            run = self.make_run(directory, validation={"mode": "enforce", "status": "passed", "errors": ["duplicate_grants"]})
            with self.assertRaisesRegex(SystemExit, "not enforced and passed"):
                builder.load_validated_run(run, None)

    def test_publisher_rechecks_scientific_report(self):
        with tempfile.TemporaryDirectory() as directory:
            root = self.make_run(directory)
            report = json.loads((root / "run-report.json").read_text())
            report["code"] = {"revision": "abc", "dirty": False}
            (root / "run-report.json").write_text(json.dumps(report))
            manifest = {
                "as_of": report["as_of"], "code": {"SciMap_Maps": report["code"]},
                "validation": {"status": "passed", "warnings": []},
                "artifacts": {"inputs": {"scientific_run": {
                    "path": "run-report.json", "sha256": builder.sha256_file(root / "run-report.json")}},
                    "downloads": {"terminations_state.csv": dict(report["outputs"]["terminations_state.csv"])}}
            }
            validator.validate_scientific_provenance(root, manifest)
            manifest["artifacts"]["downloads"]["terminations_state.csv"]["sha256"] = "changed"
            with self.assertRaisesRegex(RuntimeError, "does not match validated output"):
                validator.validate_scientific_provenance(root, manifest)

    def test_prototype_release_is_never_published(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            (root / "manifest.json").write_text(json.dumps({"status": "candidate", "approval_candidate": False}))
            with self.assertRaisesRegex(RuntimeError, "validated scientific run"):
                validator.validate_release(root)



class ReviewRegressionTests(unittest.TestCase):
    def test_generator_and_manifest_share_the_frontend_policy(self):
        policy = json.loads((Path(__file__).parent.parent / "src/lib/termination-point-policy.json").read_text())
        self.assertEqual(terminations.POINT_DOLLAR_ZERO_TOLERANCE, policy["minimum_current_loss_dollars"])
        self.assertEqual(builder.POINT_POLICY, policy)

    def point_rows(self, directory, loss, count, combined_count=None):
        row = {"week": "2026-10-23", "org_name": "Example", "org_city": "CITY", "org_state": "MD",
               "lat": 1, "lon": 2, "current_loss.combined": loss,
               "current_loss.nih": loss, "current_loss.nsf": 0,
               "current_grant_loss.nih": count, "current_grant_loss.nsf": 0,
               "current_grant_loss.combined": count if combined_count is None else combined_count}
        terminations.pd.DataFrame([row]).to_csv(Path(directory) / "terminations_org_combined.csv", index=False)
        with patch.object(terminations, "COMBINED_DIR", directory), patch.object(terminations, "JSON_OUTPUT_DIR", directory):
            terminations.generate_terminated_grants("2026-10-23")
        return json.loads((Path(directory) / "terminated_grants.json").read_text())["GRANT_LOSSES"]

    def test_floating_point_residue_never_creates_a_marker(self):
        for loss in (2.3283064365386963e-10, 0.0049, 0, -1e-10):
            with self.subTest(loss=loss), tempfile.TemporaryDirectory() as directory:
                self.assertEqual(self.point_rows(directory, loss, 0), [])

    def test_real_cent_loss_preserves_the_scientific_grant_count(self):
        with tempfile.TemporaryDirectory() as directory:
            points = self.point_rows(directory, 0.01, 2)
            self.assertEqual(points[0]["terminated_num"], 2)
            self.assertEqual(points[0]["terminated_loss"], 0.01)

    def test_material_loss_without_grants_is_rejected(self):
        with tempfile.TemporaryDirectory() as directory, self.assertRaisesRegex(RuntimeError, "inconsistent grant counts"):
            self.point_rows(directory, 10, 0)

    def test_agency_counts_must_reconcile_before_points_are_written(self):
        with tempfile.TemporaryDirectory() as directory:
            with self.assertRaisesRegex(RuntimeError, "inconsistent grant counts"):
                self.point_rows(directory, 10, 2, combined_count=1)
            self.assertFalse((Path(directory) / "terminated_grants.json").exists())

    def test_fractional_grants_are_rejected(self):
        with tempfile.TemporaryDirectory() as directory, self.assertRaisesRegex(RuntimeError, "Invalid current grant count"):
            self.point_rows(directory, 10, 1.5)

    def test_release_warnings_cannot_be_omitted_or_silenced(self):
        warnings = ["Guam missing from map geometry"]
        validator.validate_release_warnings({"release_validation": {"status": "passed", "warnings": warnings}}, warnings)
        for manifest in ({}, {"release_validation": {"status": "passed", "warnings": []}}):
            with self.subTest(manifest=manifest), self.assertRaisesRegex(RuntimeError, "warnings differ"):
                validator.validate_release_warnings(manifest, warnings)

    def test_release_warnings_are_stable_across_manifest_key_order(self):
        manifest = {"release_validation": {"status": "passed", "warnings": ["county warning", "state warning"]}}
        validator.validate_release_warnings(manifest, ["state warning", "county warning"])

    def test_publisher_hashes_downloads_and_stops_on_corruption_before_manifest(self):
        with tempfile.TemporaryDirectory() as directory:
            manifest, args = publish_fixture(directory)
            (args.release / "downloads").mkdir()
            (args.release / "downloads" / "county.csv").write_text("county,loss\nExample,10\n")
            manifest["artifacts"]["downloads"]["county.csv"] = {"path": "downloads/county.csv"}
            self.assertIn("downloads/county.csv", publisher.sample_files(args.release, manifest))
            calls = []
            def corrupted(url):
                return "wrong" if "downloads/county.csv" in url else publisher.validator.sha256(args.release / "tables/states.json")
            with (patch.object(publisher.validator, "validate_release", return_value=manifest),
                  patch.object(publisher, "destination_is_empty", return_value=True),
                  patch.object(publisher, "verify_remote"),
                  patch.object(publisher, "aws", side_effect=lambda *a, **kw: calls.append(a) or ""),
                  patch.object(publisher, "fetch_sha256", side_effect=corrupted),
                  self.assertRaisesRegex(RuntimeError, "downloads/county.csv")):
                publisher.publish_release(args)
            put_keys = [
                command[command.index("--key") + 1]
                for command in calls
                if command[1] == "put-object"
            ]
            self.assertFalse(any(key.endswith("manifest.json") for key in put_keys))


selector = load_script("select_termination_release.py")


class SelectionTests(unittest.TestCase):
    def fixture(self, tmp):
        root = Path(tmp)
        record = {"status": "published", "release_id": "verified-a", "public_url": selector.PUBLIC_BASE + "/terminations/releases/verified-a", "manifest_sha256": "a" * 64}
        path = root / "upload.json"
        path.write_text(json.dumps(record))
        args = selector.parse_args(['--upload-record', str(path), '--pointer', 'latest-validated'])
        selection = {"schema_version": 1, "release_id": "verified-a", "as_of": "2026-10-26", "manifest_url": record['public_url'] + '/manifest.json', "manifest_sha256": 'a' * 64}
        return args, record, selection

    def test_unpublished_and_corrupt_releases_cannot_be_selected(self):
        with self.assertRaisesRegex(ValueError, 'completed'):
            selector.prepare({'status': 'uploading'})
        with tempfile.TemporaryDirectory() as tmp:
            _, record, _ = self.fixture(tmp)
            with patch.object(selector, 'fetch', return_value=b'{}'), self.assertRaisesRegex(ValueError, 'checksum'):
                selector.prepare(record)

    def test_dry_run_and_backwards_latest_do_not_write(self):
        with tempfile.TemporaryDirectory() as tmp:
            args, _, selection = self.fixture(tmp)
            with patch.object(selector, 'prepare', return_value=selection), patch.object(selector, 'remote', return_value='') as remote:
                self.assertEqual(selector.select(args)['status'], 'prepared')
                self.assertNotIn('copyto', [c.args[0] for c in remote.call_args_list])
            with patch.object(selector, 'prepare', return_value=selection), patch.object(selector, 'remote', side_effect=['latest-validated.json', '{"as_of":"2026-10-27"}']), self.assertRaisesRegex(ValueError, 'backwards'):
                selector.select(args)

    def test_website_requires_recorded_authorization_and_historical_skips_latest(self):
        with tempfile.TemporaryDirectory() as tmp:
            args, _, selection = self.fixture(tmp)
            with patch.object(selector, 'prepare', return_value=selection), patch.object(selector, 'remote') as remote:
                args.pointer = 'website-release'
                with self.assertRaisesRegex(ValueError, 'authorization'):
                    selector.select(args)
                remote.assert_not_called()
                args.pointer, args.historical = 'latest-validated', True
                with self.assertRaisesRegex(ValueError, 'Historical'):
                    selector.select(args)

    def test_uncertain_write_is_recorded_and_never_retried(self):
        with tempfile.TemporaryDirectory() as tmp:
            args, _, selection = self.fixture(tmp)
            args.apply, args.record = True, str(Path(tmp) / 'audit.json')
            calls = []
            def remote(*command):
                calls.append(command)
                if command[0] == 'copyto' and command[2].endswith('latest-validated.json'):
                    raise RuntimeError('timeout')
                return ''
            with patch.object(selector, 'prepare', return_value=selection), patch.object(selector, 'remote', side_effect=remote), self.assertRaisesRegex(RuntimeError, 'timeout'):
                selector.select(args)
            self.assertEqual(json.loads(Path(args.record).read_text())['status'], 'unconfirmed')
            pointer_writes = [c for c in calls if c[0] == 'copyto' and c[2].endswith('latest-validated.json')]
            self.assertEqual(len(pointer_writes), 1)

    def test_success_archives_previous_then_writes_once_and_verifies(self):
        with tempfile.TemporaryDirectory() as tmp:
            args, _, selection = self.fixture(tmp)
            args.apply, args.record = True, str(Path(tmp) / 'audit.json')
            calls = []
            stored = {}
            def remote(*command):
                calls.append(command)
                if command[0] == 'lsf': return 'latest-validated.json'
                if command[0] == 'cat': return json.dumps(stored.get('selection', {'as_of': '2026-10-20', 'release_id': 'previous'}))
                if command[0] == 'copyto' and command[2].endswith('latest-validated.json'):
                    stored['selection'] = json.loads(Path(command[1]).read_text())
                return ''
            with patch.object(selector, 'prepare', return_value=selection), patch.object(selector, 'remote', side_effect=remote), patch.object(selector, 'fetch', side_effect=lambda url: json.dumps(stored['selection']).encode()):
                result = selector.select(args)
            self.assertEqual(result['status'], 'selected')
            self.assertEqual(result['previous']['release_id'], 'previous')
            writes = [c for c in calls if c[0] == 'copyto']
            self.assertIn('/selections/', writes[0][2])
            self.assertTrue(writes[1][2].endswith('latest-validated.json'))


if __name__ == "__main__":
    unittest.main()
