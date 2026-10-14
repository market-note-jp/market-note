// Index only our published article metadata. No article body rewriting or web crawl.
import { readFile, readdir, writeFile, mkdir } from 'node:fs/promises';
import ts from 'typescript';
import { createHash } from 'node:crypto';
const root = new URL('../', import.meta.url);
const readJSON = async path => JSON.parse(await readFile(new URL(path, root), 'utf8'));
const companies = await readJSON('data/news/companies.json');
const editorial = await readJSON('content/editorial-titles.json');
const page = await readFile(new URL('app/page.tsx', root), 'utf8');
const ast = ts.createSourceFile('page.tsx', page, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
const declaration = ast.statements.filter(ts.isVariableStatement).flatMap(s => [...s.declarationList.declarations]).find(d => d.name.getText(ast) === 'legacyArticles');
if (!declaration || !ts.isArrayLiteralExpression(declaration.initializer)) throw new Error('Cannot find authoritative legacy article registry');
const legacy = declaration.initializer.elements.map(element => {
  if (!ts.isObjectLiteralExpression(element)) throw new Error('Invalid legacy registry item');
  return Object.fromEntries(element.properties.map(p => {
    if (!ts.isPropertyAssignment(p) || !ts.isStringLiteral(p.initializer)) throw new Error('Nonliteral article metadata');
    return [ts.isStringLiteral(p.name) ? p.name.text : p.name.getText(ast), p.initializer.text];
  }));
}).map(a => ({ ...a, title: editorial[a.href.replace('/articles/', '')]?.title || a.title }));
const daily = [];
for (const file of (await readdir(new URL('content/daily/', root))).filter(x => /^daily-\d{4}-\d{2}-\d{2}\.json$/.test(x))) {
  const a = await readJSON(`content/daily/${file}`);
  daily.push({ ...a, href: `/articles/${a.slug}` });
}
const topics = [['半導体', /半導体|HBM|DRAM|ABF|キオクシア|NVIDIA|TSMC|SOX/i], ['金融政策', /金利|FRB|日銀|利上げ|利下げ|金融政策/], ['物価', /物価|CPI|インフレ|PPI/], ['雇用', /雇用|失業/], ['決算・業績', /決算|業績|売上|利益|EPS|PER|ROIC|キャッシュフロー/], ['日本経済', /日本|日経|TOPIX|円|東証/], ['米国経済', /米国|米株|FRB|NASDAQ|S&P|ダウ/], ['エネルギー', /原油|エネルギー|石油/]];
const articles = [...daily, ...legacy].map(a => {
  const text = `${a.title} ${a.excerpt}`;
  // Name match is a navigation aid, not a claim that the company is the event subject.
  const codes = companies.filter(c => [c.name, ...c.aliases].some(alias => text.toLocaleLowerCase().includes(alias.toLocaleLowerCase()))).map(c => c.code);
  return { id: `market-note:${createHash('sha256').update(a.href).digest('hex').slice(0,24)}`, sourceId: 'market-note', sourceName: 'Market Note', type: 'analysis', title: a.title, url: a.href, publishedAt: a.dateTime, updatedAt: null, fetchedAt: null, topics: topics.filter(([,re]) => re.test(text)).map(([name]) => name), companyCodes: codes, excerpt: a.excerpt, dateProvenance: 'original-article', datePrecision: a.dateTime.length === 10 ? 'date' : 'datetime', articleKind: a.kind };
}).sort((a,b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt)).slice(0, 1000);
if (new Set(articles.map(a=>a.url)).size !== articles.length) throw new Error('Duplicate owned article URL');
await mkdir(new URL('data/news/', root), {recursive:true});
await writeFile(new URL('data/news/analysis.json', root), JSON.stringify(articles, null, 2)+'\n');
console.log(`Indexed ${articles.length} existing Market Note articles without modifying them.`);

const snapshot = await readJSON('data/news/feed.json');
await writeFile(new URL('public/news-status.json', root), JSON.stringify({schemaVersion:1, snapshotHash:createHash('sha256').update(await readFile(new URL('data/news/feed.json', root))).digest('hex'), generatedAt:snapshot.generatedAt, sources:snapshot.sources, officialCount:snapshot.articles.length, analysisCount:articles.length, articleIds:snapshot.articles.map(a=>a.id), cacheWarning:snapshot.cacheWarning || null},null,2)+'\n');
