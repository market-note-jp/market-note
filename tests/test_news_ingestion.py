import copy
import importlib.util
import json
from pathlib import Path
import unittest
ROOT = Path(__file__).resolve().parent.parent

def module(name, path):
    spec = importlib.util.spec_from_file_location(name, ROOT / path)
    value = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(value)
    return value

news = module('ingest', 'scripts/ingest-news.py')
cache = module('snapshot', 'scripts/news-snapshot.py')
registry = json.loads((ROOT / 'data/news/sources.json').read_text())
sources = {s['id']: s for s in registry}
fixture = lambda name: (ROOT / f'tests/fixtures/news/{name}.xml').read_bytes()
NOW = '2026-10-14T10:00:00Z'

class FeedTests(unittest.TestCase):
    def test_rss_atom_and_rdf_keep_dates_and_plain_text(self):
        a = news.parse_feed(fixture('rss'), sources['frb-monetary'])[0]
        self.assertEqual(a['title'], 'Rates & outlook')
        self.assertEqual(a['excerpt'], 'Official summary.')
        self.assertEqual(a['publishedAt'], '2026-10-13T18:00:00Z')
        b = news.parse_feed(fixture('atom'), sources['bls-cpi'])[0]
        self.assertEqual(b['publishedAt'], '2026-09-11T11:50:40.968000Z')
        self.assertEqual(b['updatedAt'], b['publishedAt'])
        c = news.parse_feed(fixture('rdf'), sources['jp-stat'])[0]
        self.assertEqual(c['publishedAt'], '2026-10-13')
        self.assertEqual(c['datePrecision'], 'date')
        self.assertEqual(c['excerpt'], '')

    def test_canonical_tracking_fragment_and_http_do_not_duplicate(self):
        hosts = ['www.bls.gov']
        self.assertEqual(news.canonical_url('http://www.bls.gov/a?utm_campaign=x&x=1&gclid=a#frag', hosts), 'https://www.bls.gov/a?x=1')
        for url in ['javascript:alert(1)', 'https://evil.invalid/a', 'https://user:secret@www.bls.gov/a', 'https://www.bls.gov:444/a']:
            with self.assertRaises(ValueError): news.canonical_url(url, hosts)

    def test_unknown_date_is_never_fetch_date_or_updated_date(self):
        raw = fixture('atom').replace(b'<published>2026-09-11T07:50:40.968-04:00</published>', b'')
        a = news.parse_feed(raw, sources['bls-cpi'])[0]
        self.assertIsNone(a['publishedAt'])
        self.assertIsNotNone(a['updatedAt'])

    def test_empty_malformed_oversize_and_entity_feeds_fail_closed(self):
        for raw in [b'<html>blocked</html>', b'<rss>', b'x'*(news.MAX_BYTES+1), b'<!DOCTYPE rss [<!ENTITY x "bad">]><rss/>', '<!DOCTYPE rss [<!ENTITY x "bad">]><rss/>'.encode('utf-16')]:
            with self.assertRaises(Exception): news.parse_feed(raw, sources['frb-monetary'])

    def test_corrections_preserve_original_publication_and_first_fetch(self):
        source = sources['frb-monetary']; incoming = news.parse_feed(fixture('rss'), source)
        one = news.reconcile([], incoming, source, NOW)
        updated = copy.deepcopy(incoming); updated[0]['publishedAt'] = '2026-10-14T01:00:00Z'; updated[0]['title'] = 'Corrected title'
        two = news.reconcile(one, updated, source, '2026-10-14T12:00:00Z')
        updated[0]['publishedAt'] = '2026-10-14T02:00:00Z'
        three = news.reconcile(two, updated, source, '2026-10-14T13:00:00Z')
        self.assertEqual(len(three), 1)
        self.assertEqual(three[0]['publishedAt'], incoming[0]['publishedAt'])
        self.assertEqual(three[0]['sourcePublishedAt'], updated[0]['publishedAt'])
        self.assertEqual(three[0]['revisionCount'], 2)
        self.assertEqual(three[0]['firstFetchedAt'], NOW)
        unchanged = news.reconcile(three, updated, source, '2026-10-14T14:00:00Z')
        self.assertEqual(unchanged[0]['revisionCount'], 2)
        self.assertEqual(unchanged[0]['sourcePublishedAt'], updated[0]['publishedAt'])

    def test_duplicate_conflicts_fail_closed_without_revision_churn(self):
        source=sources['frb-monetary'];items=news.parse_feed(fixture('rss'),source)
        first=news.reconcile([],items,source,NOW)
        same=news.reconcile(first,items+items,source,NOW)
        self.assertEqual(len(same),1)
        self.assertNotIn('revisionCount',same[0])
        changed=copy.deepcopy(items);changed[0]['title']='New title'
        with self.assertRaises(ValueError):news.reconcile(first,changed+items,source,NOW)
        self.assertEqual(first[0]['title'],items[0]['title'])

    def test_original_date_precision_survives_source_correction(self):
        source=sources['frb-monetary'];items=news.parse_feed(fixture('rss'),source)
        first=news.reconcile([],items,source,NOW)
        changed=copy.deepcopy(items);changed[0]['publishedAt']='2026-10-15';changed[0]['datePrecision']='date'
        result=news.reconcile(first,changed,source,NOW)
        self.assertEqual(result[0]['publishedAt'],'2026-10-13T18:00:00Z')
        self.assertEqual(result[0]['datePrecision'],'datetime')

    def test_rotating_stat_url_distinguishes_releases(self):
        a = news.parse_feed(fixture('rdf'), sources['jp-stat'])[0]
        b = news.parse_feed(fixture('rdf').replace(b'2026-10-13', b'2026-11-13'), sources['jp-stat'])[0]
        self.assertNotEqual(a['id'], b['id']); self.assertEqual(a['url'], b['url'])

    def test_failure_retains_items_and_last_success(self):
        source=sources['frb-monetary']
        success=news.ingest([source],{},NOW,fetcher=lambda s,o:(fixture('rss'),'tag',None),sleeper=lambda s:None)
        def fail(s,o): raise ValueError('HTTP 403')
        failed=news.ingest([source],success,'2026-10-14T16:00:00Z',fetcher=fail,sleeper=lambda s:None)
        self.assertEqual(failed['articles'],success['articles'])
        self.assertEqual(failed['sources'][0]['lastSuccessAt'],NOW)
        self.assertEqual(failed['sources'][0]['status'],'error')
        self.assertEqual(failed['sources'][0]['itemCount'],1)
        self.assertEqual(failed['sources'][0]['lastAttemptAt'],'2026-10-14T16:00:00Z')

    def test_304_requires_prior_success(self):
        source=sources['frb-monetary']; unchanged=lambda s,o:(None,'tag',None)
        empty=news.ingest([source],{},NOW,fetcher=unchanged,sleeper=lambda s:None)
        self.assertEqual(empty['sources'][0]['status'],'error')
        old=news.ingest([source],{},NOW,fetcher=lambda s,o:(fixture('rss'),'tag',None),sleeper=lambda s:None)
        new=news.ingest([source],old,'2026-10-15T00:00:00Z',fetcher=unchanged,sleeper=lambda s:None)
        self.assertEqual(new['articles'],old['articles'])
        self.assertEqual(new['sources'][0]['lastSuccessAt'],'2026-10-15T00:00:00Z')

    def test_partial_failure_does_not_suppress_other_source(self):
        def fetch(s,o):
            if s['id']=='frb-monetary':raise ValueError('HTTP 403')
            return fixture('atom'),None,None
        data=news.ingest([sources['frb-monetary'],sources['bls-cpi']],{},NOW,fetcher=fetch,sleeper=lambda s:None)
        self.assertEqual([s['status'] for s in data['sources']],['error','ok'])
        self.assertEqual(len(data['articles']),1)

    def test_history_is_bounded(self):
        source=sources['frb-monetary'];base=news.parse_feed(fixture('rss'),source)[0]
        self.assertEqual(len(news.reconcile([],[dict(base,id=str(i)) for i in range(500)],source,NOW)),200)

    def test_cache_eligibility(self):
        self.assertTrue(cache.eligible({'head_branch':'main','status':'completed','event':'schedule'}))
        for change in [{'head_branch':'feature'},{'status':'in_progress'},{'event':'pull_request'},{'conclusion':'skipped'},{'conclusion':'cancelled'}]:
            self.assertFalse(cache.eligible({'head_branch':'main','status':'completed','event':'schedule',**change}))

    def test_cache_rejects_external_url_and_fake_events(self):
        data=news.ingest([sources['frb-monetary']],{},NOW,fetcher=lambda s,o:(fixture('rss'),None,None),sleeper=lambda s:None)
        cache.validate_snapshot(data,registry)
        broken=copy.deepcopy(data);broken['articles'][0]['url']='https://evil.invalid/x'
        with self.assertRaises(ValueError):cache.validate_snapshot(broken,registry)
        broken=copy.deepcopy(data);broken['events']=[{'title':'Imaginary event'}]
        with self.assertRaises(ValueError):cache.validate_snapshot(broken,registry)

    def test_registry_has_rights_and_limits(self):
        for source in registry:
            self.assertTrue(source['rightsUrl'].startswith('https://'))
            self.assertRegex(source['rightsCheckedAt'],r'^\d{4}-\d{2}-\d{2}$')
            self.assertTrue(source['allowedFields'])
            if source.get('feedUrl'):
                self.assertGreaterEqual(source['pollHours'],6)
                self.assertLessEqual(source['maxItems'],200)

if __name__=='__main__':unittest.main()
