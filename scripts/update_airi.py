"""Collect available price inputs; publish reproducible AIRI data, never invent gaps."""
import argparse
import bisect
import concurrent.futures
import datetime as dt
import itertools
import json
import math
from pathlib import Path
import statistics
import urllib.request
from zoneinfo import ZoneInfo
from airi_model import calculate, valid_value, VERSION

ROOT = Path(__file__).resolve().parents[1]
INPUT = ROOT / 'data/airi/input.json'
TICKERS = ('NVDA','AVGO','AMD','MSFT','AMZN','GOOGL','META','ORCL')
PRICE_KEYS = ('ma200_gap_pct','downside_correlation','below_ma200_pct')
SOURCE = 'https://finance.yahoo.com/quote/NVDA/history/ (8銘柄の分割調整済み終値、出典詳細は方法論)'

def load_prices(ticker):
    url = f'https://query1.finance.yahoo.com/v8/finance/chart/{ticker}?range=5y&interval=1d'
    req = urllib.request.Request(url, headers={'User-Agent':'MarketNote-AIRI/0.1 research'})
    with urllib.request.urlopen(req, timeout=25) as response:
        chart = json.load(response)['chart']['result'][0]
    if chart['meta']['symbol'] != ticker or chart['meta']['currency'] != 'USD':
        raise ValueError('Unexpected symbol or currency')
    # Yahoo close is split-adjusted; do not use adjclose (dividend-adjusted).
    values = {}
    for stamp, value in zip(chart['timestamp'], chart['indicators']['quote'][0]['close']):
        if value is not None and math.isfinite(value) and value > 0:
            day = dt.datetime.fromtimestamp(stamp,ZoneInfo('America/New_York')).date().isoformat()
            values[day] = float(value)
    return ticker, values

def price_features(series, cutoff):
    # Only complete prior US trading sessions, common to every member.
    days = sorted(set.intersection(*(set(series[t]) for t in TICKERS)))
    days = [day for day in days if day < cutoff.isoformat()]
    if len(days)<200:
        raise ValueError('200 daily prices required')
    prices = [[series[t][day] for t in TICKERS] for day in days]
    shares = [100 / len(TICKERS) / p for p in prices[0]]
    portfolio = [100.0]
    returns = []
    down = []
    def quarter(day):
        d=dt.date.fromisoformat(day)
        return d.year, (d.month-1)//3
    for i in range(1,len(days)):
        # Rebalance on first quarter session using prior close, before its return.
        if quarter(days[i]) != quarter(days[i-1]):
            shares = [portfolio[-1]/len(TICKERS)/p for p in prices[i-1]]
        value = sum(q*p for q,p in zip(shares,prices[i]))
        returns.append([b/a-1 for a,b in zip(prices[i-1],prices[i])])
        down.append(value < portfolio[-1])
        portfolio.append(value)
    features=[]
    for i in range(199,len(days)):
        d=days[i]
        feature={
          'ma200_gap_pct': (portfolio[i]/statistics.mean(portfolio[i-199:i+1])-1)*100,
          'below_ma200_pct':sum(prices[i][j]<statistics.mean(row[j] for row in prices[i-199:i+1]) for j in range(8))/8*100,
        }
        selected = [r for r,negative in zip(returns[max(0,i-126):i],down[max(0,i-126):i]) if negative]
        if len(selected)>=30:
            try:
                correlations=[statistics.correlation([r[a] for r in selected],[r[b] for r in selected]) for a,b in itertools.combinations(range(8),2)]
                feature['downside_correlation']=max(-1,min(1,statistics.mean(correlations)))
            except statistics.StatisticsError:
                pass
        features.append((d,feature))
    return features

def record(value, day):
    return {'value':value,'observed_at':day,'published_at':day,'source':SOURCE,
            'reference_kind':'分割調整済み価格の事後再構成。公表当時の未改訂データではない'}

def archive_monthly_observations(data, cutoff):
    """Build later monthly references from actual earlier releases, never future data."""
    releases=[json.loads(p.read_text()) for p in sorted((ROOT/'data/airi/releases').glob('*.json'))]
    releases=[r for r in releases if r['model_version']==VERSION and r['universe_id']==data['universe_id']]
    history={r['as_of'][:7]:r for r in data['history']}
    month=cutoff.year*12+cutoff.month-1
    for m in range(month-60,month+1):
        point=dt.date(m//12,m%12+1,1)
        if point>cutoff:
            continue
        earlier=[r for r in releases if r['as_of']<=point.isoformat()]
        for release in earlier:
            for metric in release['metrics']:
                key=metric['key']
                if key in PRICE_KEYS:
                    continue
                value,_=valid_value(metric,point,key)
                if value is None:
                    continue
                row=history.setdefault(point.isoformat()[:7],{'as_of':point.isoformat(),'metrics':{}})
                previous=row['metrics'].get(key)
                if previous and previous['observed_at']>=metric['observed_at']:
                    continue
                row['metrics'][key]={k:metric[k] for k in ('value','observed_at','published_at','source')}
    data['history']=sorted(history.values(),key=lambda r:r['as_of'])

def collect(data, cutoff):
    series={}
    with concurrent.futures.ThreadPoolExecutor(max_workers=8) as pool:
        for ticker,values in pool.map(load_prices,TICKERS):
            series[ticker]=values
    features=price_features(series,cutoff)
    latest_day,latest=features[-1]
    if (cutoff-dt.date.fromisoformat(latest_day)).days>10:
        raise ValueError('Latest common trading day is stale')
    history={r['as_of'][:7]:r for r in data['history']}
    # Normalize to the same immutable first-day-of-month reference convention.
    for row in history.values():
        if not row['as_of'].endswith('-01'):
            raise ValueError('Reference snapshots must use the first of each month')
    feature_days=[d for d,_ in features]
    month=cutoff.year*12+cutoff.month-1
    for m in range(month-60,month):
        point=dt.date(m//12,m%12+1,1)
        ix=bisect.bisect_left(feature_days,point.isoformat())-1
        if ix<0:
            continue
        day,vals=features[ix]
        key=point.isoformat()[:7]
        row=history.setdefault(key,{'as_of':point.isoformat(),'metrics':{}})
        for k,v in vals.items():
            row['metrics'][k]=record(v,day)
    for key in PRICE_KEYS:
        data['current']['metrics'][key]=record(latest[key],latest_day) if key in latest else {
            'value':None,'observed_at':None,'published_at':None,'source':'',
            'reason':'下落日数または価格変動が不足'}
    data['history']=sorted(history.values(),key=lambda x:x['as_of'])
    data['price_collection']={'status':'success','observed_at':latest_day}

def publish(data, checked_on):
    if data['data_kind']!='observed':
        raise ValueError('Synthetic data cannot be published')
    result=calculate(data)
    result['checked_on']=checked_on
    result['price_collection']=data.get('price_collection',{})
    result['observed_count']=sum(r['value'] is not None for r in result['metrics'])
    result['next_update_note']='毎週土曜の午前に確認・更新（日本時間）'
    result['reference_note']='株価の月次参照値は現時点の分割調整済み価格で再構成。予測精度の検証には使用していません。'
    release_path=ROOT / f'data/airi/releases/{checked_on}.json'
    if release_path.exists():
        old=json.loads(release_path.read_text())
        if old['input_sha256']!=result['input_sha256']:
            raise ValueError('This date already has a release; preserve it and use a later date')
    result['change_note']='初回記録。前週差は次回以降、同じ有効項目がそろった場合に表示します。'
    prior=[]
    for path in sorted((ROOT/'data/airi/releases').glob('*.json')):
        if path.stem < checked_on:
            prior.append(json.loads(path.read_text()))
    result['previous_change']=None
    if prior:
        prev=prior[-1]
        a={r['key'] for r in prev['metrics'] if r['score'] is not None}
        b={r['key'] for r in result['metrics'] if r['score'] is not None}
        lag=(dt.date.fromisoformat(checked_on)-dt.date.fromisoformat(prev['checked_on'])).days
        if a==b and result['airi'] is not None and prev['airi'] is not None and 5<=lag<=9:
            result['previous_change']=result['airi']-prev['airi']
            result['change_note']='前回の週次記録と同じ項目で比較しています。'
        else:
            result['change_note']='必要な項目または比較可能な前週の記録が不足しているため、前週差は未算出です。'
    def brief(r):
        return {k:r[k] for k in ('as_of','airi','axes','coverage','observed_count')}
    result['history']=[brief(r) for r in prior[-51:]]+[brief(result)]
    output=json.dumps(result,ensure_ascii=False,indent=2,allow_nan=False)+'\n'
    (ROOT/'app/airi-data.json').write_text(output,encoding='utf-8')
    if not release_path.exists():
        release_path.write_text(output,encoding='utf-8')
    return result

def main():
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--as-of',default=dt.datetime.now(ZoneInfo('Asia/Tokyo')).date().isoformat())
    parser.add_argument('--collect-prices',action='store_true')
    args=parser.parse_args()
    cutoff=dt.date.fromisoformat(args.as_of)
    data=json.loads(INPUT.read_text(encoding='utf-8'))
    data['current']['as_of']=args.as_of
    archive_monthly_observations(data,cutoff)
    if args.collect_prices:
        try:
            collect(data,cutoff)
        except Exception as exc:
            # Preserve prior dated observations, but never represent failure as success.
            data['price_collection']={'status':'failed','error':type(exc).__name__+': '+str(exc)}
            print('Price collection failed; retaining dated prior observations:',exc)
    result=publish(data,args.as_of)
    INPUT.write_text(json.dumps(data,ensure_ascii=False,indent=2,allow_nan=False)+'\n',encoding='utf-8')
    print(json.dumps({'airi':result['airi'],'observed_count':result['observed_count'],
      'scored_count':sum(r['score'] is not None for r in result['metrics']),
      'price_collection':result['price_collection']},ensure_ascii=False))

if __name__=='__main__':
    main()
