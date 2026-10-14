'use client';

import Link from 'next/link';
import { useMemo, useRef, useSyncExternalStore, type FormEvent } from 'react';
import { ArrowRight, ArrowUpRight, Search, List, Layers, Info, ArrowLeft } from 'lucide-react';
import type { NewsData, SourceStatus } from '../../lib/news-data';
import { EMPTY_FILTERS, dateFilterError, filterNews, formatNewsDate, readSearchFilters, sourceHealth, verifiedEvents, writeSearchFilters, type SearchFilters } from '../../lib/news-search.mjs';
import { CompanyPills, CoverageNote, NewsArticleCard } from './news-components';

const PAGE_SIZE = 20;
const URL_EVENT = 'market-note-news-search';
function subscribeUrl(callback: () => void) {
  window.addEventListener('popstate', callback);
  window.addEventListener(URL_EVENT, callback);
  return () => { window.removeEventListener('popstate', callback); window.removeEventListener(URL_EVENT, callback); };
}
const urlSnapshot = () => window.location.search;
const serverUrlSnapshot = () => '';
let browserNow: number | null = null;
function subscribeClock(callback: () => void) {
  const tick = () => { browserNow = Date.now(); callback(); };
  tick();
  const timer = window.setInterval(tick, 60000);
  window.addEventListener('focus', tick);
  return () => { window.clearInterval(timer); window.removeEventListener('focus', tick); };
}
const clockSnapshot = () => browserNow;
const serverClockSnapshot = () => null;

function SourceCard({ source, data, now }: { source: SourceStatus; data: NewsData; now: number | null }) {
  const health = sourceHealth(source, now);
  const stored = filterNews(data.articles, data.companies, { source: source.id });
  const latest = stored.find(article => article.publishedAt);
  return <article className="news-source-card">
    <div className="news-source-heading"><h3>{source.name}</h3><span className={`news-health news-health-${health.state}`}>{health.label}</span></div>
    <p className="news-source-kind">{source.kind === 'analysis' ? '本サイトの独自分析' : '政府・公的機関の一次情報'} · 保存済み {stored.length}件</p>
    <dl>
      <div><dt>{source.kind === 'analysis' ? '最新の公開日' : '最新の配信元記載日'}</dt><dd>{latest ? formatNewsDate(latest.publishedAt, latest.datePrecision) : '日付を確認できる収録情報なし'}</dd></div>
      {source.kind !== 'analysis' && <><div><dt>最終取得成功</dt><dd>{source.lastSuccessAt ? formatNewsDate(source.lastSuccessAt) : '成功記録なし'}</dd></div><div><dt>最終取得試行</dt><dd>{source.lastAttemptAt ? formatNewsDate(source.lastAttemptAt) : '試行記録なし'}</dd></div></>}
    </dl>
    {source.error && <p className="news-source-error">取得エラーが記録されています。取得できた保存分を表示しています。</p>}
    {health.state === 'stale' && <p className="news-source-error">予定間隔の2倍＋1時間を超えて更新されていません。最新情報は発行元で確認してください。</p>}
    <details><summary>出典・利用条件を見る</summary><p>{source.rightsBasis}</p><p>収録項目：{source.allowedFields.join('・')}<br />条件確認日：{source.rightsCheckedAt}{source.pollHours > 0 && <><br />取得の予定間隔：{source.pollHours}時間（実行・反映が遅れる場合があります）</>}</p>{source.linkNote && <p>{source.linkNote}</p>}<div className="news-source-links"><a href={source.rightsUrl} target="_blank" rel="noopener noreferrer">利用条件 <ArrowUpRight size={13} aria-hidden="true" /></a>{source.feedInfoUrl && <a href={source.feedInfoUrl} target="_blank" rel="noopener noreferrer">配信元 <ArrowUpRight size={13} aria-hidden="true" /></a>}</div></details>
  </article>;
}

export default function NewsExplorer({ data }: { data: NewsData }) {
  const queryInput = useRef<HTMLInputElement>(null);
  const search = useSyncExternalStore(subscribeUrl, urlSnapshot, serverUrlSnapshot);
  const now = useSyncExternalStore(subscribeClock, clockSnapshot, serverClockSnapshot);
  const filters = useMemo(() => readSearchFilters(search), [search]);
  const results = useMemo(() => filterNews(data.articles, data.companies, filters), [data, filters]);
  const error = dateFilterError(filters);
  const events = useMemo(() => {
    const matches = new Set(results.map(article => article.id));
    return verifiedEvents(data.events, data.articles).filter(event => event.articles.some(article => matches.has(article.id)));
  }, [data, results]);
  const topics = useMemo(() => [...new Set(data.articles.flatMap(article => article.topics))].sort((a, b) => a.localeCompare(b, 'ja')), [data]);
  const officialCount = data.articles.filter(article => article.type === 'official').length;
  const analysisCount = data.articles.filter(article => article.type === 'analysis').length;
  const healthIssues = data.sources.filter(source => ['error', 'stale', 'unknown'].includes(sourceHealth(source, now).state));
  const total = filters.view === 'events' ? events.length : results.length;
  const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const page = Math.min(filters.page, pageCount);
  const pageArticles = results.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const pageEvents = events.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const active = filters.q || filters.topic || filters.source || filters.type || filters.from || filters.to;

  function update(changes: Partial<SearchFilters>, moveToResults = false) {
    const next = { ...filters, page: 1, ...changes };
    if (Object.prototype.hasOwnProperty.call(changes, 'q') && queryInput.current) queryInput.current.value = next.q;
    const params = writeSearchFilters(next);
    const url = `${window.location.pathname}${params ? `?${params}` : ''}`;
    if (`${window.location.pathname}${window.location.search}` !== url) window.history.pushState(null, '', url);
    window.dispatchEvent(new Event(URL_EVENT));
    if (moveToResults) document.getElementById('news-results')?.scrollIntoView({ block: 'start', behavior: 'auto' });
  }
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    update({ q: String(new FormData(event.currentTarget).get('q') || '').trim() });
  }

  return <>
    <div className="news-coverage-band"><div className="news-wrap"><span><Info size={14} aria-hidden="true" />公式発表・独自分析の検索</span><a href="#news-sources">収録範囲と取得状況 <ArrowRight size={14} aria-hidden="true" /></a></div></div>
    <section className="news-hero news-wrap" aria-labelledby="news-title">
      <div className="news-hero-line"><div><p className="kicker">NEWS DISCOVERY</p><h1 id="news-title">ニュースから、<br className="news-mobile-break" />企業の本質へ。</h1><p>公式発表とMarket Noteの分析を、企業・テーマで探す。<br />原文を読み、企業の財務と照らし合わせる。</p></div><div className="news-hero-index" aria-hidden="true">EXPLORE THE CONTEXT<strong>01 <small>/ DISCOVER</small></strong></div></div>
      <form className="news-search-form" role="search" onSubmit={submit}><Search size={22} aria-hidden="true" /><label className="news-sr-only" htmlFor="news-query">企業名・証券コード・キーワードを検索</label><input ref={queryInput} key={filters.q} id="news-query" name="q" type="search" defaultValue={filters.q} placeholder="企業名・証券コード・キーワード" maxLength={300} autoComplete="off" /><button type="submit">検索 <ArrowRight size={16} aria-hidden="true" /></button></form>
      <div className="news-search-examples"><span>検索例</span>{['ファナック', '285A', '半導体', '金融政策'].map(query => <button type="button" key={query} onClick={() => update({ q: query })}>{query}</button>)}<span className="news-search-scope">収録済みの見出し・概要・メタデータから検索</span></div>
    </section>
    <div className="news-wrap">
      <div className="news-topic-row" role="group" aria-label="テーマで絞り込む"><span>TOPICS</span><button type="button" aria-pressed={!filters.topic} onClick={() => update({ topic: '' })}>すべて</button>{topics.map(topic => <button type="button" key={topic} aria-pressed={filters.topic === topic} onClick={() => update({ topic: filters.topic === topic ? '' : topic })}>{topic}</button>)}</div>
      {data.cacheWarning && <p className="news-warning" role="status">{data.cacheWarning}</p>}
      {healthIssues.length > 0 && <p className="news-warning" role="status">{healthIssues.map(source => source.name).join('、')}の取得状況に注意が必要です。検索結果は保存済みの情報です。<a href="#news-sources">取得状況を見る</a></p>}
      <div className="news-workspace"><section className="news-feed" aria-labelledby="news-results-heading">
        <div className="news-filter-bar"><label>発行元<select aria-label="発行元" value={filters.source} onChange={event => update({ source: event.target.value })}><option value="">すべての発行元</option>{data.sources.map(source => <option value={source.id} key={source.id}>{source.name}</option>)}</select></label><label>情報の種類<select aria-label="情報の種類" value={filters.type} onChange={event => update({ type: event.target.value })}><option value="">すべての種類</option><option value="official">公式発表・一次資料</option><option value="analysis">Market Note分析</option><option value="media">報道（現在未収録）</option></select></label><button type="button" className="news-reset" onClick={() => update({ ...EMPTY_FILTERS })}>条件をリセット</button></div>
        <fieldset className="news-date-range"><legend>公表日で絞り込み</legend><label>開始日<input aria-label="開始日" aria-invalid={!!error} aria-describedby="news-date-note" type="date" value={filters.from} onChange={event => update({ from: event.target.value })} /></label><span aria-hidden="true">〜</span><label>終了日<input aria-label="終了日" aria-invalid={!!error} aria-describedby="news-date-note" type="date" value={filters.to} onChange={event => update({ to: event.target.value })} /></label></fieldset><p id="news-date-note" className="news-small-note">日時がある情報は日本時間（JST）、日付のみの情報は配信元の記載日で検索します。公的配信はRSS/Atomの記載日で、取得日ではありません。</p>
        {error && <p className="news-date-error" role="alert">{error}</p>}
        <div className="news-results-toolbar" id="news-results"><h2 id="news-results-heading" className="news-result-count" aria-live="polite"><strong>{total}</strong> {filters.view === 'events' ? '件の確認済みの出来事' : '件の収録情報'}</h2><div className="news-view-switch" role="group" aria-label="表示方法"><button type="button" aria-pressed={filters.view === 'articles'} onClick={() => update({ view: 'articles' })}><List size={14} aria-hidden="true" />記事</button><button type="button" aria-pressed={filters.view === 'events'} onClick={() => update({ view: 'events' })}><Layers size={14} aria-hidden="true" />出来事で比較</button></div></div>
        <div className="news-result-options"><span>{filters.view === 'articles' ? '公式発表と独自分析を区別して表示' : '同じ出来事と確認できた情報だけを表示'}</span>{filters.view === 'articles' && <label><span className="news-sr-only">並び順</span><select value={filters.sort} onChange={event => update({ sort: event.target.value })}><option value="new">公表日の新しい順</option><option value="old">公表日の古い順</option></select></label>}</div>
        {active && <p className="news-active-query">絞り込み中：{[filters.q && `「${filters.q}」`, filters.topic, data.sources.find(source => source.id === filters.source)?.name, filters.type && ({ official: '公式発表', analysis: '独自分析', media: '報道（未収録）' }[filters.type]), filters.from && `${filters.from}以降`, filters.to && `${filters.to}まで`].filter(Boolean).join(' / ')}</p>}
        {filters.view === 'articles' ? <>{pageArticles.map(article => <NewsArticleCard key={article.id} article={article} companies={data.companies} />)}{results.length === 0 && <div className="news-empty"><Search size={30} aria-hidden="true" /><h3>{error ? '日付の条件を確認してください' : '収録情報に一致する結果がありません'}</h3><p>{filters.type === 'media' ? '報道媒体の記事は現在収録していません。利用許諾や契約を確認した媒体から、今後の拡張を検討します。' : '検索語や期間を変えてお試しください。登録企業でも、収録情報や公式IRがない場合があります。'}</p><button className="news-secondary-button" type="button" onClick={() => update({ ...EMPTY_FILTERS })}>すべての収録情報を見る</button></div>}</> : <>{pageEvents.map(event => <article className="news-event-card" key={event.id}><p className="kicker">VERIFIED EVENT</p><h3>{event.title}</h3><CompanyPills codes={event.companyCodes} companies={data.companies} /><p className="news-small-note">編集上の確認で同じ出来事に関連づけた{event.articles.length}件です。関連記事全体を表示しています。各記事の公表日は個別に確認してください。</p><details><summary>情報源を読み比べる</summary>{event.articles.map(article => <NewsArticleCard key={article.id} article={article} companies={data.companies} />)}</details></article>)}{events.length === 0 && <div className="news-empty"><Layers size={30} aria-hidden="true" /><h3>比較できる出来事はまだありません</h3><p>同じ企業やテーマへの言及だけでは、同じ出来事と判断していません。対応関係を確認した情報がそろったときに、ここで読み比べられます。</p><button className="news-secondary-button" type="button" onClick={() => update({ view: 'articles' })}>記事一覧を見る</button></div>}</>}
        {pageCount > 1 && <nav className="news-pagination" aria-label="検索結果のページ"><button type="button" disabled={page <= 1} onClick={() => update({ page: page - 1 }, true)}><ArrowLeft size={15} aria-hidden="true" />前へ</button><span>{page} / {pageCount}ページ</span><button type="button" disabled={page >= pageCount} onClick={() => update({ page: page + 1 }, true)}>次へ<ArrowRight size={15} aria-hidden="true" /></button></nav>}
        <CoverageNote />
      </section><aside className="news-sidebar" aria-label="企業と収録範囲">
        <section><p className="kicker">COMPANY RESEARCH</p><h2>ニュースの先にある企業</h2><div className="news-sidebar-companies">{data.companies.slice(0, 5).map(company => <Link key={company.code} href={`/companies/${company.code}`}><span><small>{company.code}</small><strong>{company.name}</strong></span><ArrowUpRight size={16} aria-hidden="true" /></Link>)}</div><Link className="news-text-link" href="/companies">登録企業{data.companies.length}社を見る <ArrowRight size={15} aria-hidden="true" /></Link></section>
        <section className="news-coverage-panel"><p className="kicker">TRANSPARENT BY DESIGN</p><h2>どこまで、見えているか。</h2><p>政府・公的機関の配信と、本サイトの独自分析を収録しています。</p><div className="news-coverage-numbers"><div><strong>{officialCount}</strong><span>公式発表・一次資料</span></div><div><strong>{analysisCount}</strong><span>Market Note分析</span></div></div><p>報道媒体の記事は現在未収録です。媒体追加は利用許諾・契約の確認後に行います。公式発表を第三者の報道として数えていません。</p><a className="news-text-link" href="#news-sources">出典・取得状況を見る <ArrowRight size={14} aria-hidden="true" /></a></section>
        <section className="news-workflow-note"><h2>読む、つなぐ、確かめる。</h2><ol><li>企業・テーマで情報を探す</li><li>出典と公表日を確かめる</li><li>企業ページから財務を分析する</li></ol><p>取得成功は、新しい発表があったことを示しません。各記事の公表日も確認してください。</p></section>
      </aside></div>
      <section id="news-sources" className="news-sources" aria-labelledby="news-sources-title"><div className="news-section-heading"><div><p className="kicker">SOURCES & COVERAGE</p><h2 id="news-sources-title">収録範囲と取得状況</h2></div><p>配信元ごとの保存情報と、最後に取得できた時刻</p></div><p className="news-sources-intro">総務省統計局・財務省・FRB金融政策・米BLS雇用統計／消費者物価と、Market Noteの既存記事が対象です。速報性・網羅性を保証するものではなく、配信元の過去情報をすべて収録するものでもありません。本文の無断収集や報道記事の転載は行いません。</p><p className="news-small-note">公的配信の日時はRSS/Atom記載値で、実際の発表時刻と一致しない場合があります。日時を独自補正していません（タイムゾーン表示のみJSTに統一）。</p><p className="news-small-note">外部配信スナップショット作成：{data.generatedAt ? formatNewsDate(data.generatedAt) : '未確認'}。公表日時とは異なります。取得状況は閲覧時の端末時刻で判定し、1分ごと・画面復帰時に見直します。</p><div className="news-source-grid">{data.sources.map(source => <SourceCard key={source.id} source={source} data={data} now={now} />)}</div><p className="news-small-note">取得失敗や更新遅延でも保存情報は残します。保存件数が0件でも、配信元に情報が存在しないことを意味しません。内容や更新後の版は、原文で確認してください。</p></section>
    </div>
    <noscript><p className="news-wrap news-warning">検索・絞り込みと現在の取得状況の判定にはJavaScriptが必要です。表示中の記事リンクと企業ページはそのまま開けます。</p></noscript>
  </>;
}
