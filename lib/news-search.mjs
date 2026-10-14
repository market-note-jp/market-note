export const EMPTY_FILTERS = Object.freeze({ q: '', topic: '', source: '', type: '', from: '', to: '', sort: 'new', view: 'articles', page: 1 });

export function normalizeSearch(value) {
  return String(value ?? '').normalize('NFKC').toLocaleLowerCase('ja-JP').replace(/[\u3041-\u3096]/g, char => String.fromCharCode(char.charCodeAt(0) + 0x60)).trim();
}

export function isDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value || '')) return false;
  const date = new Date(`${value}T00:00:00Z`);
  return Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

/** Publication day in Japan. Date-only source values are never timezone-shifted. */
export function publicationDay(article) {
  const value = article.publishedAt;
  if (!value) return '';
  if (article.datePrecision === 'date' || /^\d{4}-\d{2}-\d{2}$/.test(value)) return isDate(value.slice(0, 10)) ? value.slice(0, 10) : '';
  const date = new Date(value);
  if (!Number.isFinite(date.getTime())) return '';
  return new Date(date.getTime() + 9 * 60 * 60 * 1000).toISOString().slice(0, 10);
}

export function formatNewsDate(value, precision) {
  if (!value) return '公表日不明';
  if (precision === 'date' || /^\d{4}-\d{2}-\d{2}$/.test(value)) return isDate(value.slice(0, 10)) ? `${value.slice(0, 10).replaceAll('-', '.')}（時刻記載なし）` : '公表日不明';
  const date = new Date(value);
  if (!Number.isFinite(date.getTime())) return '公表日不明';
  const jst = new Date(date.getTime() + 9 * 60 * 60 * 1000).toISOString();
  return `${jst.slice(0, 10).replaceAll('-', '.')} ${jst.slice(11, 16)} JST`;
}

export function readSearchFilters(search = '') {
  const params = new URLSearchParams(search);
  const filters = { ...EMPTY_FILTERS };
  for (const key of ['q', 'topic', 'source', 'from', 'to']) filters[key] = (params.get(key) || '').slice(0, 300);
  filters.type = ['official', 'analysis', 'media'].includes(params.get('type')) ? params.get('type') : '';
  filters.sort = params.get('sort') === 'old' ? 'old' : 'new';
  filters.view = params.get('view') === 'events' ? 'events' : 'articles';
  const page = Number(params.get('page'));
  filters.page = Number.isSafeInteger(page) && page > 0 ? Math.min(page, 100000) : 1;
  return filters;
}

export function writeSearchFilters(filters) {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries({ ...EMPTY_FILTERS, ...filters })) {
    if (value !== EMPTY_FILTERS[key] && value !== '') params.set(key, String(value));
  }
  return params.toString();
}

export function dateFilterError(filters) {
  if ((filters.from && !isDate(filters.from)) || (filters.to && !isDate(filters.to))) return '有効な公表日を指定してください。';
  if (filters.from && filters.to && filters.from > filters.to) return '開始日は終了日以前にしてください。';
  return '';
}

export function filterNews(articles, companies = [], options = {}) {
  const filters = { ...EMPTY_FILTERS, ...options };
  if (dateFilterError(filters)) return [];
  const tokens = normalizeSearch(filters.q).split(/\s+/u).filter(Boolean);
  const companyIndex = new Map(companies.map(company => [company.code, [company.code, company.name, ...company.aliases].join(' ')]));
  return articles.filter(article => {
    if (filters.type && article.type !== filters.type) return false;
    if (filters.source && article.sourceId !== filters.source) return false;
    if (filters.topic && !article.topics.includes(filters.topic)) return false;
    const date = publicationDay(article);
    if ((filters.from || filters.to) && !date) return false;
    if (filters.from && date < filters.from) return false;
    if (filters.to && date > filters.to) return false;
    const text = normalizeSearch([article.title, article.excerpt || '', article.sourceName, ...article.topics, ...article.companyCodes.map(code => companyIndex.get(code) || code)].join(' '));
    return tokens.every(token => text.includes(token));
  }).sort((a, b) => {
    const dayA = publicationDay(a), dayB = publicationDay(b);
    if (!dayA && !dayB) return a.id.localeCompare(b.id);
    if (!dayA) return 1;
    if (!dayB) return -1;
    // A date-only item has no known intraday order; use its day then a stable ID.
    let compared = dayA.localeCompare(dayB);
    if (compared) return compared * (filters.sort === 'old' ? 1 : -1);
    const timedA = a.datePrecision !== 'date' && a.publishedAt?.includes('T');
    const timedB = b.datePrecision !== 'date' && b.publishedAt?.includes('T');
    if (timedA && timedB) compared = Date.parse(a.publishedAt) - Date.parse(b.publishedAt);
    // Keep date-only records together after timed records on the same day. This
    // is a presentation convention, not an inferred time of publication.
    if (!!timedA !== !!timedB) return timedA ? -1 : 1;
    return compared ? compared * (filters.sort === 'old' ? 1 : -1) : a.id.localeCompare(b.id);
  });
}

/** Only explicit editorial matches with at least two existing, unique articles. */
export function verifiedEvents(events, articles) {
  const index = new Map(articles.map(article => [article.id, article]));
  return events.filter(event => event.grouping === 'editorial' && new Set(event.articleIds).size >= 2 && event.articleIds.every(id => index.has(id)))
    .map(event => ({ ...event, articles: [...new Set(event.articleIds)].map(id => index.get(id)) }));
}

/** Last successful retrieval is independent of the newest article's publication. */
export function sourceHealth(source, now = null, toleranceHours = 1) {
  if (!source.enabled) return { state: 'disabled', label: '収集対象外' };
  if (source.kind === 'analysis' || source.status === 'local') return { state: 'local', label: 'サイト内記事' };
  if (source.status === 'error' || source.error) return { state: 'error', label: '取得失敗・保存分を表示' };
  const success = Date.parse(source.lastSuccessAt || '');
  if (!Number.isFinite(success)) return { state: 'unknown', label: '取得成功を未確認' };
  if (now === null || !Number.isFinite(now)) return { state: 'checking', label: '現在の鮮度を確認中' };
  if (success > now + toleranceHours * 3600000) return { state: 'unknown', label: '取得時刻を確認してください' };
  if (now - success > (Math.max(0, source.pollHours) * 2 + toleranceHours) * 3600000) return { state: 'stale', label: '更新遅延・保存分を表示' };
  return { state: 'ok', label: '取得成功' };
}
