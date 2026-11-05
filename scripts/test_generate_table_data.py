import json
from pathlib import Path
import tempfile
import unittest
from unittest.mock import patch

from generate_table_data import LEVELS, aggregate_csv, load_pop, main, merge_and_total


class PopulationTests(unittest.TestCase):
    def test_population_keys_preserve_leading_zeroes(self):
        for column, raw, expected in [('FIPS', '1001', '01001'), ('GEOID', '101', '0101')]:
            with self.subTest(column=column), tempfile.TemporaryDirectory() as directory:
                path = Path(directory) / 'pop.csv'
                path.write_text(f'{column},pop_2024\n{raw},61464\n')
                self.assertEqual(load_pop(path, column), {expected: 61464})

    def test_funding_keys_use_the_same_normalization(self):
        with tempfile.TemporaryDirectory() as directory:
            path = Path(directory) / 'funding.csv'
            path.write_text('FIPS,name,raw_funding\n1001,Autauga County,10\n01001,Autauga County,20\n')
            regions = aggregate_csv(path, 'FIPS', 'name', None, ['raw_funding'], 'nih_')
            self.assertEqual(list(regions), ['01001'])
            self.assertEqual(regions['01001']['nih_raw_funding'], 30)

    def test_unavailable_population_is_not_zero(self):
        with tempfile.TemporaryDirectory() as directory:
            path = Path(directory) / 'pop.csv'
            path.write_text('FIPS,pop_2024\n66010,\n78030,NA\n')
            self.assertEqual(load_pop(path, 'FIPS'), {'66010': None, '78030': None})
        result = merge_and_total({'66010': {'id': '66010', 'name': 'Guam'}}, {}, {})
        self.assertIsNone(result[0]['pop_2024'])

    def test_only_the_documented_territory_population_gaps_remain(self):
        expected = {
            'states': {'AS', 'GU', 'MP', 'PR', 'VI'},
            'districts': {'6098', '6698', '6998', '7298', '7898'},
            'counties': {
                '60010', '60050', '66010', '69110', '78030',
                '72005', '72013', '72021', '72025', '72031', '72035',
                '72041', '72055', '72063', '72069', '72085', '72097',
                '72113', '72117', '72127', '72133', '72139',
            },
        }
        data_dir = Path(__file__).resolve().parents[1] / 'src' / 'data'
        for level, missing in expected.items():
            rows = json.loads((data_dir / f'table_{level}.json').read_text())
            self.assertEqual({row['id'] for row in rows if row['pop_2024'] is None}, missing)

    def test_real_references_match_every_committed_population(self):
        data_dir = Path(__file__).resolve().parents[1] / 'src' / 'data'
        for level, config in LEVELS.items():
            populations = load_pop(config['pop_csv'], config['id_col'])
            for row in json.loads((data_dir / f'table_{level}.json').read_text()):
                with self.subTest(level=level, region=row['id']):
                    self.assertEqual(row['pop_2024'], populations.get(row['id']))

    def test_population_only_rebuild_preserves_funding_and_is_repeatable(self):
        data_dir = Path(__file__).resolve().parents[1] / 'src' / 'data'
        with tempfile.TemporaryDirectory() as directory:
            original = {}
            for level in LEVELS:
                name = f'table_{level}.json'
                original[name] = json.loads((data_dir / name).read_text())
                rows = json.loads((data_dir / name).read_text())
                for row in rows:
                    row['pop_2024'] = 0
                (Path(directory) / name).write_text(json.dumps(rows))
            with patch('generate_table_data.OUTPUT_DIR', directory):
                main(['--population-only'])
                first = {name: (Path(directory) / name).read_bytes() for name in original}
                for name, expected in original.items():
                    self.assertEqual(json.loads(first[name]), expected)
                main(['--population-only'])
                self.assertEqual(first, {name: (Path(directory) / name).read_bytes() for name in original})

    def test_committed_tables_retain_known_populations_and_explicit_gaps(self):
        data_dir = Path(__file__).resolve().parents[1] / 'src' / 'data'
        counties = {row['id']: row for row in json.loads((data_dir / 'table_counties.json').read_text())}
        self.assertEqual(counties['01001']['pop_2024'], 61464)
        self.assertGreater(counties['38007']['pop_2024'], 0)
        for level in ['counties', 'states', 'districts']:
            for row in json.loads((data_dir / f'table_{level}.json').read_text()):
                with self.subTest(level=level, region=row['id']):
                    population = row['pop_2024']
                    self.assertTrue(population is None or population > 0)
                    if population is None:
                        self.assertTrue(row['id'][:2] in {'60', '66', '69', '72', '78'} or row['id'] in {'AS', 'GU', 'MP', 'PR', 'VI'})


if __name__ == '__main__':
    unittest.main()
