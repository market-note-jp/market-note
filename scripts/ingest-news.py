"""Bounded, no-key RSS/Atom ingestion. Never fetch article bodies or external entities."""
from __future__ import annotations
import datetime as dt
import email.utils
import hashlib
import json
import os
from pathlib import Path
import re
import sys
import time
import urllib.error
import urllib.parse
import urllib.request
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parent.parent
MAX_BYTES = 1_000_000
MAX_ITEMS = 200
TIMEOUT = 20
USER_AGENT = 'MarketNoteFeedReader/1.0 (+https://market-note-jp.github.io/market-note/news/)'
TRACKERS = {'fbclid', 'gclid', 'mc_cid', 'mc_eid'}


def iso(value):
    if not value:
        return None
    try:
        date = dt.datetime.fromisoformat(value.replace('Z', '+00:00'))
    except ValueError:
        try:
            date = email.utils.parsedate_to_datetime(value)
        except (TypeError, ValueError):
            return None
    if date.tzinfo is None:
        # A date with no offset is not silently reinterpreted in local time.
        if re.fullmatch(r'\d{4}-\d{2}-\d{2}', value):
            return value
        return None
    return date.astimezone(dt.timezone.utc).isoformat().replace('+00:00', 'Z')


def plain(value, limit=600):
    import html
    value = html.unescape(re.sub(r'<[^>]*>', ' ', value or ''))
    return re.sub(r'\s+', ' ', value).strip()[:limit]


def canonical_url(value, hosts):
    url = urllib.parse.urlsplit(value.strip())
    if url.scheme not in ('http', 'https') or url.username or url.password or url.port not in (None, 443, 80):
        raise ValueError('unsafe article URL')
    host = (url.hostname or '').lower()
    if host not in hosts:
        raise ValueError('article host is not allowlisted')
    query = urllib.parse.urlencode(sorted((k, v) for k, v in urllib.parse.parse_qsl(url.query, keep_blank_values=True)
                                         if not k.lower().startswith('utm_') and k.lower() not in TRACKERS))
    return urllib.parse.urlunsplit(('https', host, url.path or '/', query, ''))


def parse_feed(raw, source):
    if len(raw) > MAX_BYTES:
        raise ValueError('feed exceeds byte limit')
    if b'\x00' in raw or raw.startswith((b'\xff\xfe', b'\xfe\xff')):
        raise ValueError('only UTF-8 XML feeds are accepted')
    if re.search(br'<!\s*(DOCTYPE|ENTITY)\b', raw, re.I):
        raise ValueError('external entities / DTD are not accepted')
    root = ET.fromstring(raw)
    local = lambda tag: tag.rsplit('}', 1)[-1]
    nodes = [x for x in root.iter() if local(x.tag) in ('item', 'entry')]
    if not nodes:
        raise ValueError('no RSS items or Atom entries; retain last successful snapshot')
    if len(nodes) > 2000:
        raise ValueError('feed item limit exceeded')
    items = []
    for node in nodes[:MAX_ITEMS]:
        fields = {}
        for child in node:
            key = local(child.tag)
            if key == 'link' and child.attrib.get('href'):
                if child.attrib.get('rel', 'alternate') == 'alternate':
                    fields['link'] = child.attrib['href']
            elif key not in fields:
                fields[key] = ''.join(child.itertext()).strip()
        title = plain(fields.get('title'), 300)
        if not title or not fields.get('link'):
            raise ValueError('feed item lacks required title/link')
        url = canonical_url(fields['link'], source['allowedHosts'])
        published = iso(fields.get('published') or fields.get('pubDate') or fields.get('date'))
        updated = iso(fields.get('updated'))
        # No updated -> published substitution: unknown publication stays unknown.
        identity = url + ('|' + (published or '') if source.get('identityMode') == 'url-date' else '')
        ident = hashlib.sha256(identity.encode()).hexdigest()[:24]
        items.append({
            'id': f"{source['id']}:{ident}", 'sourceId': source['id'], 'sourceName': source['name'],
            'type': 'official', 'title': title, 'url': url, 'publishedAt': published, 'updatedAt': updated,
            'excerpt': plain(fields.get('description') or fields.get('summary') or fields.get('content')) if source['id'].startswith(('frb-', 'bls-')) else '',
            'topics': source['topics'], 'companyCodes': [], 'dateProvenance': 'source-feed',
            'datePrecision': 'date' if published and len(published) == 10 else 'datetime',
            **({'linkNote': source['linkNote']} if source.get('linkNote') else {}),
        })
    return items


class NoRedirect(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, req, fp, code, msg, headers, newurl):
        raise ValueError('redirect not followed; source registry review required')


def fetch_feed(source, status):
    url = source['feedUrl']
    checked = canonical_url(url, source['allowedHosts'])
    if checked != url:
        raise ValueError('registry feed URL must be canonical HTTPS')
    headers = {'User-Agent': USER_AGENT, 'Accept': 'application/rss+xml, application/atom+xml, application/xml, text/xml'}
    if status.get('etag'):
        headers['If-None-Match'] = status['etag']
    if status.get('lastModified'):
        headers['If-Modified-Since'] = status['lastModified']
    try:
        with urllib.request.build_opener(NoRedirect).open(urllib.request.Request(url, headers=headers), timeout=TIMEOUT) as response:
            if int(response.headers.get('Content-Length', '0')) > MAX_BYTES:
                raise ValueError('feed exceeds byte limit')
            raw = response.read(MAX_BYTES + 1)
            if len(raw) > MAX_BYTES:
                raise ValueError('feed exceeds byte limit')
            return raw, response.headers.get('ETag'), response.headers.get('Last-Modified')
    except urllib.error.HTTPError as error:
        if error.code == 304:
            return None, status.get('etag'), status.get('lastModified')
        raise ValueError(f'HTTP {error.code}') from error


def reconcile(old_items, incoming, source, now):
    prior = {item['id']: item for item in old_items if item['sourceId'] == source['id']}
    unique = {}
    for item in incoming:
        if item['id'] in unique and unique[item['id']] != item:
            raise ValueError('conflicting duplicate canonical item; retain prior snapshot')
        unique[item['id']] = item
    for item in unique.values():
        previous = prior.get(item['id'])
        record = {**item, 'fetchedAt': now, 'firstFetchedAt': previous.get('firstFetchedAt', previous['fetchedAt']) if previous else now}
        if previous:
            # Source revisions can amend a date; preserve the original reported date.
            record['publishedAt'] = previous.get('publishedAt') or item['publishedAt']
            if previous.get('publishedAt'):
                record['datePrecision'] = previous.get('datePrecision', 'datetime')
            old_source_date = previous.get('sourcePublishedAt', previous.get('publishedAt'))
            if 'sourcePublishedAt' in previous or item['publishedAt'] != previous.get('publishedAt'):
                record['sourcePublishedAt'] = item['publishedAt']
            changes = [key for key in ('title', 'excerpt', 'updatedAt') if previous.get(key) != item.get(key)]
            if item['publishedAt'] != old_source_date:
                changes.append('publishedAt')
            if changes:
                record['lastChangedAt'] = now
                record['revisionCount'] = previous.get('revisionCount', 0) + 1
                record['changeNotice'] = '配信元の見出し・概要・更新日時の変更を検出。原文を確認してください。'
            else:
                for key in ('lastChangedAt', 'revisionCount', 'changeNotice'):
                    if key in previous:
                        record[key] = previous[key]
        prior[item['id']] = record
    # Bound history by source. Missing entries are not presumed withdrawn/deleted.
    return sorted(prior.values(), key=lambda x: (x.get('publishedAt') or '', x['id']), reverse=True)[:MAX_ITEMS]


def ingest(registry, previous, now, fetcher=fetch_feed, sleeper=time.sleep):
    articles = list(previous.get('articles', []))
    prior_states = {state['id']: state for state in previous.get('sources', [])}
    states = []
    for index, source in enumerate(registry):
        if not source['enabled'] or not source.get('feedUrl'):
            continue
        old = prior_states.get(source['id'], {})
        state = {**old, 'id': source['id'], 'lastAttemptAt': now}
        try:
            raw, etag, modified = fetcher(source, old)
            if raw is not None:
                incoming = parse_feed(raw, source)
                retained = reconcile(articles, incoming, source, now)
                articles = [a for a in articles if a['sourceId'] != source['id']] + retained
            elif not old.get('lastSuccessAt') or not any(a['sourceId'] == source['id'] for a in articles):
                raise ValueError('304 without a valid prior snapshot')
            state.update(status='ok', lastSuccessAt=now, error=None, etag=etag, lastModified=modified)
        except Exception as error:
            # Only public, bounded diagnostic categories; never serialize request headers.
            message = str(error)
            if not isinstance(error, (ValueError, ET.ParseError)):
                message = type(error).__name__
            state.update(status='error', error=message[:160])
        state['itemCount'] = sum(a['sourceId'] == source['id'] for a in articles)
        states.append(state)
        if index < len(registry) - 1:
            sleeper(2)
    articles.sort(key=lambda a: (a.get('publishedAt') or '', a['id']), reverse=True)
    return {'schemaVersion': 1, 'generatedAt': now, 'articles': articles, 'events': [], 'sources': states, **({'cacheWarning': previous['cacheWarning']} if previous.get('cacheWarning') else {})}


def main():
    registry = json.loads((ROOT / 'data/news/sources.json').read_text())
    path = ROOT / 'data/news/feed.json'
    previous = json.loads(path.read_text()) if path.exists() else {}
    now = dt.datetime.now(dt.timezone.utc).isoformat(timespec='seconds').replace('+00:00', 'Z')
    result = ingest(registry, previous, now)
    path.parent.mkdir(parents=True, exist_ok=True)
    temporary = path.with_suffix('.tmp')
    temporary.write_text(json.dumps(result, ensure_ascii=False, indent=2) + '\n')
    os.replace(temporary, path)
    print(json.dumps({'generatedAt': now, 'articles': len(result['articles']), 'sources': result['sources']}, ensure_ascii=False))
    # Publish stale/error status too; the live verification reports failed sources.
    return result


if __name__ == '__main__':
    main()
