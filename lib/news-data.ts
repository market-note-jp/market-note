import feed from '../data/news/feed.json';
import analysis from '../data/news/analysis.json';
import registry from '../data/news/sources.json';
import companies from '../data/news/companies.json';

export type MediaArticle = {
  id: string; sourceId: string; sourceName: string; type: 'official' | 'analysis';
  title: string; url: string; publishedAt: string | null; updatedAt: string | null;
  fetchedAt: string | null; firstFetchedAt?: string; topics: string[]; companyCodes: string[];
  excerpt?: string; datePrecision?: string; dateProvenance?: string; articleKind?: string;
  revisionCount?: number; lastChangedAt?: string; changeNotice?: string; sourcePublishedAt?: string | null; linkNote?: string;
};
export type CompanyEvent = { id: string; title: string; companyCodes: string[]; articleIds: string[]; publishedAt: string | null; grouping: 'editorial' };
export type Company = {code: string; name: string; aliases: string[]; edinetCode?: string; analysisQuery: string};
export type SourceStatus = {
  id: string; name: string; kind: string; enabled: boolean; rightsUrl: string; rightsCheckedAt: string;
  rightsBasis: string; allowedFields: string[]; pollHours: number; feedUrl?: string; feedInfoUrl?: string;
  lastAttemptAt: string | null; lastSuccessAt: string | null; itemCount: number; status: string; error: string | null; linkNote?: string;
};
export type NewsData = { articles: MediaArticle[]; events: CompanyEvent[]; sources: SourceStatus[]; companies: Company[]; generatedAt: string | null; cacheWarning?: string };
export function getNewsData(): NewsData {
  const snapshot = feed as {articles: MediaArticle[]; events: CompanyEvent[]; sources: Array<Partial<SourceStatus> & {id: string}>; generatedAt: string | null; cacheWarning?: string};
  const articles = [...snapshot.articles, ...analysis as MediaArticle[]].sort((a,b)=>(Date.parse(b.publishedAt || '') || 0) - (Date.parse(a.publishedAt || '') || 0));
  const sources = registry.map(source => {
    const state = snapshot.sources.find(s=>s.id === source.id);
    return { ...source, lastAttemptAt: null, lastSuccessAt: null, error: null, status: source.id === 'market-note' ? 'local' : 'uninitialized', itemCount: articles.filter(a=>a.sourceId===source.id).length, ...state } as SourceStatus;
  });
  return {articles, events: snapshot.events, sources, companies, generatedAt: snapshot.generatedAt, cacheWarning: snapshot.cacheWarning};
}
