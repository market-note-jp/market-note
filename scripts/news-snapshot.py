"""Restore the most recent completed ingestion artifact from this repo's main only.
The GitHub CLI handles authenticated API requests/redirects; no token is serialized.
"""
import hashlib
import importlib.util
import io
import json
import os
from pathlib import Path
import subprocess
import sys
import zipfile

ROOT = Path(__file__).resolve().parent.parent
ARTIFACT = 'market-news-snapshot'
MAX_SNAPSHOT = 2_000_000


def api(path, binary=False, allow_missing=False):
    result = subprocess.run(['gh', 'api', path], capture_output=True, timeout=45)
    if result.returncode:
        if allow_missing and b'HTTP 404' in result.stderr:
            return None
        raise RuntimeError('GitHub snapshot API read failed')
    return result.stdout if binary else json.loads(result.stdout)


def eligible(run):
    return run.get('head_branch') == 'main' and run.get('status') == 'completed' and run.get('conclusion') not in ('skipped', 'cancelled') and run.get('event') in ('schedule', 'workflow_dispatch', 'workflow_run')


def validate_snapshot(data, registry):
    if data.get('schemaVersion') != 1 or not isinstance(data.get('articles'), list) or not isinstance(data.get('sources'), list):
        raise ValueError('Invalid news snapshot schema')
    sources = {s['id']:s for s in registry if s.get('feedUrl')}
    spec = importlib.util.spec_from_file_location('ingest', ROOT / 'scripts/ingest-news.py')
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    ids = set()
    counts = {}
    for a in data['articles']:
        source = sources.get(a.get('sourceId'))
        if not source or a.get('type') != 'official' or not isinstance(a.get('title'), str) or not a['title'] or len(a['title']) > 300:
            raise ValueError('Invalid feed article')
        if a.get('url') != module.canonical_url(a.get('url', ''), source['allowedHosts']):
            raise ValueError('Noncanonical feed article URL')
        if not isinstance(a.get('id'), str) or a['id'] in ids:
            raise ValueError('Invalid or duplicate article ID')
        ids.add(a['id'])
        counts[source['id']] = counts.get(source['id'], 0) + 1
        if counts[source['id']] > 200:
            raise ValueError('Unbounded source history')
        for field in ('publishedAt', 'updatedAt', 'fetchedAt'):
            if a.get(field) is not None and module.iso(a[field]) is None:
                raise ValueError('Invalid source timestamp')
    if data.get('events'):
        raise ValueError('Automatic feed snapshot may not invent company events')
    for state in data['sources']:
        if state.get('id') not in sources or state.get('status') not in ('ok', 'error'):
            raise ValueError('Invalid source state')
    return data


def restore(repo=None, run_id=None):
    repo = repo or os.environ['GITHUB_REPOSITORY']
    run_id = run_id or os.environ.get('GITHUB_RUN_ID', '')
    if repo != 'market-note-jp/market-note':
        raise ValueError('Snapshot repository is not allowlisted')
    registry = json.loads((ROOT / 'data/news/sources.json').read_text())
    path = ROOT / 'data/news/feed.json'
    runs = api(f'repos/{repo}/actions/workflows/ingest-news.yml/runs?branch=main&per_page=20', allow_missing=True)
    for run in (runs or {}).get('workflow_runs', []):
        if str(run['id']) == run_id or not eligible(run):
            continue
        artifacts = api(f'repos/{repo}/actions/runs/{run["id"]}/artifacts?per_page=100')
        candidates = [a for a in artifacts.get('artifacts', []) if a.get('name') == ARTIFACT and not a.get('expired')]
        if not candidates:
            continue
        artifact = candidates[0]
        if artifact.get('size_in_bytes', 0) > MAX_SNAPSHOT:
            raise ValueError('Oversized snapshot artifact')
        raw = api(f'repos/{repo}/actions/artifacts/{artifact["id"]}/zip', binary=True)
        if len(raw) > MAX_SNAPSHOT:
            raise ValueError('Oversized snapshot archive')
        digest = artifact.get('digest')
        if digest and digest != 'sha256:' + hashlib.sha256(raw).hexdigest():
            raise ValueError('Snapshot artifact digest mismatch')
        with zipfile.ZipFile(io.BytesIO(raw)) as archive:
            if archive.namelist() != ['feed.json'] or archive.getinfo('feed.json').file_size > MAX_SNAPSHOT:
                raise ValueError('Unexpected snapshot archive contents')
            data = validate_snapshot(json.loads(archive.read('feed.json')), registry)
        seed = json.loads(path.read_text())
        # Do not replace a later checked-in initial/recovery snapshot with an older artifact.
        if (data.get('generatedAt') or '') < (seed.get('generatedAt') or ''):
            print('Keeping newer checked-in snapshot.')
            return
        path.write_text(json.dumps(data, ensure_ascii=False, indent=2) + '\n')
        print(f'Restored public news snapshot from ingestion run {run["id"]}.')
        return
    seed = validate_snapshot(json.loads(path.read_text()), registry)
    if any(eligible(run) for run in (runs or {}).get('workflow_runs', [])):
        seed['cacheWarning'] = '継続取得の保存データが見つからないため、初期取得分から再開しています。保持上限内でも過去の掲載が欠ける場合があります。'
    path.write_text(json.dumps(seed, ensure_ascii=False, indent=2) + '\n')
    print('No retained completed ingestion artifact. Using explicitly marked checked-in snapshot.')


if __name__ == '__main__':
    restore()
