import copy
import datetime as dt
import json
import sys
import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch

sys.path.insert(0,str(Path(__file__).resolve().parents[1]/'scripts'))
from airi_model import calculate, METRICS, valid_value
import update_airi as updater

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

class PricePublicationIntegrity(unittest.TestCase):
    def series(self):
        start=dt.date(2025,1,1)
        days=[start+dt.timedelta(days=i) for i in range(650)]
        return {ticker:{d.isoformat():100+i*.1 for i,d in enumerate(days) if d.weekday()<5}
                for ticker in updater.TICKERS}

    def test_friday_close_is_not_available_at_saturday_japan_midnight(self):
        features=updater.price_features(self.series(),dt.date(2026,10,10))
        self.assertEqual(features[-1][0],'2026-10-08')

    def test_friday_close_is_available_at_sunday_japan_midnight(self):
        features=updater.price_features(self.series(),dt.date(2026,10,11))
        self.assertEqual(features[-1][0],'2026-10-09')

    def test_only_common_sessions_are_used(self):
        series=self.series()
        del series['ORCL']['2026-10-09']
        self.assertEqual(updater.price_features(series,dt.date(2026,10,11))[-1][0],'2026-10-08')

    def test_publication_date_is_in_japan_in_summer_and_winter(self):
        for observed,published in [('2026-01-09','2026-01-10'),('2026-10-09','2026-10-10')]:
            rec=updater.record(1,observed)
            self.assertEqual(rec['published_at'],published)
            self.assertIsNone(valid_value(rec,dt.date.fromisoformat(published),'ma200_gap_pct')[0])
            self.assertEqual(valid_value(rec,dt.date.fromisoformat(published)+dt.timedelta(days=1),'ma200_gap_pct')[0],1)

    def test_monthly_reference_uses_publication_before_month_start(self):
        data={'history':[],'current':{'metrics':{}}}
        features=[(day,{k:float(i) for k in updater.PRICE_KEYS}) for i,day in enumerate(
            ['2026-04-29','2026-04-30','2026-05-28','2026-05-29','2026-10-09'])]
        with patch.object(updater,'load_prices',side_effect=lambda t:(t,{})), patch.object(updater,'price_features',return_value=features):
            updater.collect(data,dt.date(2026,10,11))
        may=next(r for r in data['history'] if r['as_of']=='2026-05-01')
        self.assertEqual(may['metrics']['ma200_gap_pct']['observed_at'],'2026-04-29')
        self.assertEqual(may['metrics']['ma200_gap_pct']['published_at'],'2026-04-30')
        june=next(r for r in data['history'] if r['as_of']=='2026-06-01')
        self.assertEqual(june['metrics']['ma200_gap_pct']['observed_at'],'2026-05-29')
        self.assertEqual(data['price_collection']['observed_at'],'2026-10-09')
        self.assertEqual(data['price_collection']['published_at'],'2026-10-10')

    def test_retained_legacy_reference_cannot_keep_lookahead_date(self):
        rec={'value':1,'observed_at':'2026-04-30','published_at':'2026-04-30','source':'test'}
        data={'current':{'metrics':{'ma200_gap_pct':copy.deepcopy(rec)}},
              'history':[{'as_of':'2026-05-01','metrics':{'ma200_gap_pct':copy.deepcopy(rec)}}]}
        updater.normalize_price_publication_dates(data)
        historical=data['history'][0]['metrics']['ma200_gap_pct']
        self.assertEqual(historical['published_at'],'2026-05-01')
        self.assertIsNone(valid_value(historical,dt.date(2026,5,1),'ma200_gap_pct')[0])
        before=copy.deepcopy(data)
        updater.normalize_price_publication_dates(data)
        self.assertEqual(data,before)

    def test_later_known_publication_is_not_backdated(self):
        rec={'value':1,'observed_at':'2026-10-08','published_at':'2026-10-10','source':'test'}
        data={'current':{'metrics':{'ma200_gap_pct':rec}},'history':[]}
        updater.normalize_price_publication_dates(data)
        self.assertEqual(rec['published_at'],'2026-10-10')

    def test_collection_failure_does_not_replace_observations(self):
        data={'current':{'metrics':{'ma200_gap_pct':updater.record(1,'2026-09-24')}},'history':[]}
        before=copy.deepcopy(data)
        with patch.object(updater,'load_prices',side_effect=OSError('source unavailable')):
            with self.assertRaises(OSError):updater.collect(data,dt.date(2026,10,11))
        self.assertEqual(data,before)

    def test_immutable_release_and_identical_rerun(self):
        data={'universe_id':'test-only','data_kind':'observed','current':{'as_of':'2026-10-11','metrics':{}},'history':[]}
        with tempfile.TemporaryDirectory() as directory, patch.object(updater,'ROOT',Path(directory)):
            (Path(directory)/'data/airi/releases').mkdir(parents=True)
            (Path(directory)/'app').mkdir()
            updater.publish(data,'2026-10-11')
            release=Path(directory)/'data/airi/releases/2026-10-11.json'
            original=release.read_bytes()
            updater.publish(data,'2026-10-11')
            self.assertEqual(release.read_bytes(),original)
            data['current']['metrics']['real_yield_pct']={'value':2.87,'observed_at':'2026-10-08','published_at':'2026-10-10','source':'test'}
            with self.assertRaises(ValueError):updater.publish(data,'2026-10-11')
            self.assertEqual(release.read_bytes(),original)
            self.assertIsNone(json.loads(original)['airi'])

if __name__=='__main__':unittest.main()
