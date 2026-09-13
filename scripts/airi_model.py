"""AIRI 0.1: auditable relative-risk scores, NOT crash probabilities.
Python 3.10+, standard library only. See README.md.
"""
import argparse
import datetime as dt
import hashlib
import html
import json
import math
from pathlib import Path

VERSION = '0.1.0'
# key: label, axis, max observation age (calendar days), lower, upper
METRICS = {
 'forward_pe': ('予想PER', '過熱度', 45, 0, None),
 'ma200_gap_pct': ('200日線乖離率', '過熱度', 10, -100, None),
 'flow_4w_pct': ('4週純流入／期首純資産', '過熱度', 14, None, None),
 'capex_ocf_pct': ('設備投資／営業CF', '脆弱性', 200, 0, None),
 'net_debt_ebitda': ('純有利子負債／EBITDA', '脆弱性', 200, None, None),
 'downside_correlation': ('下落日の銘柄間相関', '脆弱性', 10, -1, 1),
 'real_yield_pct': ('米10年実質金利', '脆弱性', 10, None, None),
 'eps_downgrade_breadth_pct': ('EPS下方修正超過率', '悪化兆候', 45, -100, 100),
 'hy_change_3m_bp': ('HYスプレッド3か月変化', '悪化兆候', 10, None, None),
 'below_ma200_pct': ('200日線下の銘柄比率', '悪化兆候', 10, 0, 100),
}
AXES = ('過熱度', '脆弱性', '悪化兆候')

def date(s):
    return dt.date.fromisoformat(s)

def valid_value(record, cutoff, key):
    """Conservative date-only gate: publications must precede cutoff date."""
    try:
        v = record['value']
        if isinstance(v, bool) or not isinstance(v, (float, int)) or not math.isfinite(v):
            return None, '数値なし／非有限値'
        obs, pub = date(record['observed_at']), date(record['published_at'])
        if obs > pub or pub >= cutoff:
            return None, '公表日・観測日の不整合／未公表'
        if (cutoff - obs).days > METRICS[key][2]:
            return None, '観測値が古い'
        if not record.get('source', '').strip():
            return None, '出典なし'
        lo, hi = METRICS[key][3:]
        if (lo is not None and v < lo) or (hi is not None and v > hi):
            return None, '定義範囲外'
        if key == 'forward_pe' and v == 0:
            return None, 'PERは正数が必要'
        return float(v), None
    except (KeyError, ValueError, TypeError):
        return None, '入力形式不正'

def calculate(data):
    current = data['current']
    cutoff = date(current['as_of'])
    if not data.get('universe_id'):
        raise ValueError('universe_id is required')
    # Require monthly snapshots strictly before the scoring month.
    monthly = {}
    current_month = cutoff.year * 12 + cutoff.month
    for snapshot in data.get('history', []):
        day = date(snapshot['as_of'])
        month = day.year * 12 + day.month
        if not current_month - 60 <= month < current_month:
            continue
        if month in monthly:
            raise ValueError('履歴は1か月1件にしてください')
        monthly[month] = snapshot
    rows = []
    for key, spec in METRICS.items():
        rec = current.get('metrics', {}).get(key, {})
        value, error = valid_value(rec, cutoff, key)
        reference = []
        for snapshot in monthly.values():
            old, _ = valid_value(snapshot.get('metrics', {}).get(key, {}), date(snapshot['as_of']), key)
            if old is not None:
                reference.append(old)
        if error is None and len(reference) < 36:
            error = '有効な月次履歴が36件未満'
        score = None
        if error is None:
            score = 100 * (sum(x < value for x in reference) + .5 * sum(x == value for x in reference)) / len(reference)
        rows.append(dict(key=key, label=spec[0], axis=spec[1], value=value,
                         score=score, history_n=len(reference), error=error,
                         source=rec.get('source'), observed_at=rec.get('observed_at'),
                         published_at=rec.get('published_at')))
    axes = {}
    for axis in AXES:
        group = [r for r in rows if r['axis'] == axis]
        available = [r['score'] for r in group if r['score'] is not None]
        coverage = len(available) / len(group)
        axes[axis] = dict(coverage=coverage, score=sum(available)/len(available) if coverage >= .75 else None)
    coverage = sum(r['score'] is not None for r in rows) / len(rows)
    scores = [axes[a]['score'] for a in AXES]
    total = sum(scores)/3 if all(s is not None for s in scores) and coverage >= .8 else None
    digest = hashlib.sha256(json.dumps(data, sort_keys=True, ensure_ascii=False).encode()).hexdigest()
    return dict(model_version=VERSION, universe_id=data['universe_id'], as_of=current['as_of'],
                data_kind=data.get('data_kind', 'unverified'), input_sha256=digest,
                airi=total, crash_probability=None, coverage=coverage, axes=axes, metrics=rows,
                interpretation='過去60か月に対する相対スコア。暴落確率・売買シグナルではない。')

def report(result):
    esc = lambda x: html.escape(str(x))
    fmt = lambda x: '算出不可' if x is None else f'{x:.1f}'
    cards = ''.join(f'<article><p>{esc(a)}</p><strong>{fmt(v["score"])}</strong><p>有効項目 {v["coverage"]:.0%}</p></article>' for a,v in result['axes'].items())
    rows = ''.join('<tr>' + ''.join(f'<td>{esc(v)}</td>' for v in [r['label'], r['value'], fmt(r['score']), r['history_n'], r['error'] or '有効', r['source'] or '—']) + '</tr>' for r in result['metrics'])
    label = '架空データによる動作デモ・現在の市場評価ではありません' if result['data_kind']=='synthetic' else '入力データに基づく試作指標・出典の正確性は未監査'
    return f'''<!doctype html><html lang="ja"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>AIRI 計算結果</title>
<style>body{{background:#101923;color:#e6eff8;font:16px/1.7 system-ui;max-width:1080px;margin:40px auto;padding:24px}}h1{{font-size:42px}}.notice{{background:#44391c;padding:16px;border-left:4px solid #f3bd52}}.cards{{display:flex;gap:16px;flex-wrap:wrap}}article{{background:#1c2b3c;padding:20px;flex:1;min-width:180px;border-radius:12px}}strong{{font-size:44px;color:#61d9c7}}table{{border-collapse:collapse;width:100%;font-size:14px}}td,th{{border-bottom:1px solid #36495d;padding:12px;text-align:left}}.table{{overflow:auto}}small{{color:#afc2d6}}</style>
<p>AIRI / AI Risk Index / v{VERSION}</p><h1>AI株のリスクを、3つの軸で読む</h1><p class="notice">{label}</p>
<p>{esc(result['as_of'])} · {esc(result['universe_id'])} · データ充足率 {result['coverage']:.0%}</p>
<p>総合 AIRI <strong>{fmt(result['airi'])}</strong> / 100</p><p>高いほど、過去の同じ対象より各リスク要因が強い状態。確率を意味しません。</p>
<div class="cards">{cards}</div><h2>根拠とデータ品質</h2><div class="table"><table><tr><th>項目</th><th>入力値</th><th>スコア</th><th>履歴数</th><th>状態</th><th>出典</th></tr>{rows}</table></div>
<h2>読み方</h2><p>過熱度は期待の膨張、脆弱性はショックへの弱さ、悪化兆候は業績・信用・価格の変化を表します。総合値だけで判断せず、3軸を併せて確認してください。</p>
<p>CRASH-12（35％下落確率）は未校正のため表示していません。固定重みの設計仮説であり、予測性能は未検証です。</p><small>入力SHA256: {result['input_sha256']}</small></html>'''

def main():
    p = argparse.ArgumentParser(description=__doc__)
    p.add_argument('input', type=Path)
    p.add_argument('--output', type=Path, default=Path('result.json'))
    p.add_argument('--html', type=Path)
    p.add_argument('--log', type=Path, help='Append immutable calculation record (JSONL)')
    args = p.parse_args()
    data = json.loads(args.input.read_text(encoding='utf-8'))
    result = calculate(data)
    encoded = json.dumps(result, ensure_ascii=False, indent=2, allow_nan=False)
    args.output.write_text(encoded+'\n', encoding='utf-8')
    if args.html:
        args.html.write_text(report(result), encoding='utf-8')
    if args.log:
        with args.log.open('a', encoding='utf-8') as f:
            f.write(json.dumps(result, ensure_ascii=False, allow_nan=False)+'\n')
    print(f'AIRI={result["airi"]}; coverage={result["coverage"]:.0%}; probability=not calibrated')

if __name__ == '__main__':
    main()
