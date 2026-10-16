import importlib.util
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


class LocalGenerationSafetyTest(unittest.TestCase):
    def test_upload_is_opt_in(self):
        self.assertFalse(terminations.parse_args([]).upload)
        self.assertTrue(terminations.parse_args(["--upload"]).upload)

    def test_local_mode_does_not_call_uploader(self):
        with patch.object(terminations, "upload_tiles") as upload:
            terminations.publish_tiles("tiles", "remote", upload=False)
            upload.assert_not_called()

    def test_publish_mode_calls_uploader(self):
        with patch.object(terminations, "upload_tiles") as upload:
            terminations.publish_tiles("tiles", "remote", upload=True)
            upload.assert_called_once_with("tiles", "remote")

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
            with (
                patch.object(terminations, "GEO_CACHE_DIR", directory),
                patch.object(terminations, "R2_FILES", [archive.name]),
            ):
                terminations.download_geo_refs()
            self.assertEqual(
                Path(directory, "reference", "reference", "value.txt").read_text(),
                "ok",
            )

    def test_release_id_rejects_paths(self):
        args = SimpleNamespace(release_id="../bad", week="2026-09-25")
        with self.assertRaises(SystemExit):
            builder.build_release(args)


if __name__ == "__main__":
    unittest.main()
