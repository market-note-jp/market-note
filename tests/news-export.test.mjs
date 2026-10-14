import assert from 'node:assert/strict';
import {readFile, access} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import test from 'node:test';
const root = new URL('../',import.meta.url);
const read = path=>readFile(new URL(path,root),'utf8');

test('news route publishes real coverage, sources and no prototype fiction',async()=>{
 const html=await read('out/news/index.html');
 assert.match(html, /ニュース/);
 for(const name of ['総務省統計局','財務省','FRB','BLS','Market Note']) assert.ok(html.includes(name),name);
 assert.ok(!html.includes('架空の報道'));
 assert.ok(!html.includes('fictional'));
 const feed=JSON.parse(await read('data/news/feed.json'));
 for(const article of feed.articles.slice(0,5)) assert.ok(html.includes(article.title.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')) || html.includes(article.title),article.title);
});

test('source data is bounded and rights-documented; status digest is exact',async()=>{
 const bytes=await read('data/news/feed.json'); const feed=JSON.parse(bytes);
 const sources=JSON.parse(await read('data/news/sources.json'));
 assert.equal(feed.schemaVersion,1);
 assert.ok(feed.articles.length <= 1000);
 assert.equal(new Set(feed.articles.map(a=>a.id)).size,feed.articles.length);
 assert.equal(feed.events.length,0,'No fabricated company event clusters');
 for(const a of feed.articles){
  assert.equal(a.type,'official');
  const source=sources.find(s=>s.id===a.sourceId);assert.ok(source);
  assert.ok(source.allowedHosts.includes(new URL(a.url).hostname));
  assert.ok(source.rightsCheckedAt && source.rightsUrl);
 }
 const status=JSON.parse(await read('out/news-status.json'));
 assert.equal(status.snapshotHash,createHash('sha256').update(bytes).digest('hex'));
 assert.deepEqual(status.articleIds,feed.articles.map(a=>a.id));
 assert.equal(status.generatedAt,feed.generatedAt);
});

test('each company page exists and has a financial-analysis route',async()=>{
 const companies=JSON.parse(await read('data/news/companies.json'));
 for(const company of companies){
  await access(new URL(`out/companies/${company.code}/index.html`,root));
  const html=await read(`out/companies/${company.code}/index.html`);
  assert.ok(html.includes(company.name),company.code);
  assert.ok(html.includes('/market-note/company-analysis'),company.code);
 }
});

test('the automatic pipeline is fixture tested and does not mutate main',async()=>{
 const workflow=await read('.github/workflows/ingest-news.yml');
 assert.match(workflow,/17 5,11,17,23/);
 assert.match(workflow,/npm run test:news/);
 assert.match(workflow,/npm run lint/);
 assert.match(workflow,/retention-days: 7/);
 assert.match(workflow,/persist-credentials: false/);
 assert.ok(!/git push|contents: write|secrets\.(?!GITHUB_TOKEN)/.test(workflow));
 assert.match(workflow,/Reject a stale main build/);
 assert.match(workflow,/Verify the public news snapshot/);
});
