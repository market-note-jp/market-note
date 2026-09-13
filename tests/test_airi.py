import copy
import datetime as dt
import sys
import unittest
from pathlib import Path

sys.path.insert(0,str(Path(__file__).resolve().parents[1]/'scripts'))
from airi_model import calculate, METRICS

class AiriIntegrity(unittest.TestCase):
    def setUp(self):
        def snapshot(day):
            prev=(day-dt.timedelta(days=1)).isoformat()
            return {'as_of':day.isoformat(),'metrics':{k:{'value':.5,'observed_at':prev,'published_at':prev,'source':'test fixture'} for k in METRICS}}
        self.data={'universe_id':'test-only','data_kind':'synthetic','current':snapshot(dt.date(2026,9,13)),
          'history':[snapshot(dt.date(2023+i//12,i%12+1,1)) for i in range(36)]}
    def test_ties_are_neutral_not_zero(self):
        r=calculate(self.data)
        self.assertEqual(r['airi'],50)
        self.assertIsNone(r['crash_probability'])
    def test_missing_is_not_safe(self):
        self.data['current']['metrics']={}
        self.assertIsNone(calculate(self.data)['airi'])
    def test_future_data_is_excluded(self):
        self.data['current']['metrics']['forward_pe']['published_at']='2026-09-14'
        self.assertIsNone(calculate(self.data)['airi'])
    def test_stale_observation_is_excluded(self):
        self.data['current']['metrics']['ma200_gap_pct']['observed_at']='2026-08-01'
        self.assertIsNone(calculate(self.data)['metrics'][1]['score'])
    def test_short_reference_is_not_scored(self):
        self.data['history']=self.data['history'][:35]
        self.assertIsNone(calculate(self.data)['airi'])
    def test_duplicate_reference_month_rejected(self):
        self.data['history'].append(copy.deepcopy(self.data['history'][0]))
        with self.assertRaises(ValueError):calculate(self.data)

if __name__=='__main__':unittest.main()
