import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {pathToFileURL} from 'node:url';
import {parse} from 'parse5';

const attribute=(node,name)=>node.attrs?.find(a=>a.name===name)?.value;
const children=node=>(node.childNodes??[]).filter(n=>n.tagName);
const all=(node,predicate)=>(node.childNodes??[]).flatMap(n=>[...(predicate(n)?[n]:[]),...all(n,predicate)]);
const normalize=s=>s.replace(/\s+/g,' ').trim();
const plain=node=>normalize((node.childNodes??[]).map(n=>n.nodeName==='#text'?n.value:plain(n)).join(''));
const classed=(n,name)=>(attribute(n,'class')??'').split(/\s+/).includes(name);
function visible(node) {
 if(node.tagName) {
  assert.ok(!['script','style','template','noscript'].includes(node.tagName),'Invisible content');
  assert.ok(!node.attrs?.some(a=>['hidden','inert','style'].includes(a.name)||/^on/i.test(a.name)),'Hidden/styled/event content');
  assert.notEqual(attribute(node,'aria-hidden'),'true');
  assert.ok(!/(^|\s)(hidden|sr-only|invisible)(\s|$)/.test(attribute(node,'class')??''));
 }
 for(const c of node.childNodes??[]) visible(c);
}
function inlineExpected(s) {
 return {text:normalize(s.replace(/\[([^\]]+)\]\((https:\/\/[^\s)]+)\)/g,'$1').replace(/\*\*([^*]+)\*\*/g,'$1')),links:[...s.matchAll(/\[([^\]]+)\]\((https:\/\/[^\s)]+)\)/g)].map(m=>({label:m[1],url:m[2]}))};
}
function inlineActual(n) {
 assert.ok(all(n,c=>c.tagName&&!['a','strong'].includes(c.tagName)).length===0,'Unexpected inline structure');
 return {text:plain(n),links:all(n,c=>c.tagName==='a').map(a=>({label:plain(a),url:attribute(a,'href')}))};
}
function expected(markdown) {
 return markdown.trim().split(/\n\s*\n/).slice(1).map(b=>{
  if(b==='---')return ['hr'];
  if(/^###? /.test(b))return [b.startsWith('###')?'h3':'h2',inlineExpected(b.replace(/^###? /,''))];
  if(b.startsWith('|'))return ['table',b.split('\n').filter((_,i)=>i!==1).map(row=>row.trim().slice(1,-1).split('|').map(s=>inlineExpected(s.trim())))];
  if(/^\d+\. /.test(b)||b.startsWith('- '))return [/^\d/.test(b)?'ol':'ul',b.split('\n').map(s=>inlineExpected(s.replace(/^(\d+\.|-) /,'')))];
  return ['p',inlineExpected(b)];
 });
}
function actual(body) {
 assert.ok((body.childNodes??[]).filter(n=>n.nodeName==='#text').every(n=>!normalize(n.value)),'Loose body text');
 return children(body).map(n=>{
  if(n.tagName==='hr')return ['hr'];
  if(['p','h2','h3'].includes(n.tagName))return [n.tagName,inlineActual(n)];
  if(['ol','ul'].includes(n.tagName)){assert.ok(children(n).every(c=>c.tagName==='li'));return [n.tagName,children(n).map(inlineActual)];}
  assert.ok(n.tagName==='div'&&classed(n,'table-wrap'),'Unexpected block');
  assert.deepEqual(children(n).map(c=>c.tagName),['table']);
  const t=children(n)[0]; assert.deepEqual(children(t).map(c=>c.tagName),['thead','tbody']);
  return ['table',children(t).flatMap((section,i)=>children(section).map(row=>{assert.equal(row.tagName,'tr');assert.ok(children(row).every(c=>c.tagName===(i?'td':'th')));return children(row).map(inlineActual);}))];
 });
}
export function verifyResearchArticle(article,html,{allowDraft=false}={}) {
 const doc=parse(html),bodies=all(doc,n=>classed(n,'research-article-body'));
 assert.equal(bodies.length,1);const body=bodies[0];visible(body);
 for(let ancestor=body.parentNode;ancestor?.tagName;ancestor=ancestor.parentNode){assert.equal(attribute(ancestor,'hidden'),undefined);assert.equal(attribute(ancestor,'inert'),undefined);assert.equal(attribute(ancestor,'style'),undefined);assert.notEqual(attribute(ancestor,'aria-hidden'),'true');assert.ok(!/(^|\s)(hidden|sr-only|invisible)(\s|$)/.test(attribute(ancestor,'class')??''));}
 const h1=all(doc,n=>n.tagName==='h1');assert.equal(h1.length,1);visible(h1[0]);assert.equal(plain(h1[0]),article.title);
 assert.deepEqual(actual(body),expected(article.markdown),'Complete ordered article differs');
 const title=all(doc,n=>n.tagName==='title');assert.equal(title.length,1);assert.equal(plain(title[0]),`${article.title} | Market Note`);
 for(const [key,value] of [['description',article.description],['og:description',article.description],['twitter:description',article.description],['og:title',`${article.title} | Market Note`],['twitter:title',`${article.title} | Market Note`]]) {
  const tags=all(doc,n=>n.tagName==='meta'&&(attribute(n,'name')===key||attribute(n,'property')===key));assert.equal(tags.length,1);assert.equal(attribute(tags[0],'content'),value,key);
 }
 if(!allowDraft)assert.ok(article.publishedTime,'Actual publication timestamp required');
 const dates=all(doc,n=>classed(n,'report-date'));assert.equal(dates.length,1);visible(dates[0]);
 if(article.publishedTime){const time=all(dates[0],n=>n.tagName==='time');assert.equal(time.length,1);assert.equal(attribute(time[0],'datetime'),article.publishedTime);const formatted=new Intl.DateTimeFormat('ja-JP',{timeZone:'Asia/Tokyo',year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit'}).format(new Date(article.publishedTime))+' JST';assert.equal(plain(time[0]),formatted);const meta=all(doc,n=>n.tagName==='meta'&&attribute(n,'property')==='article:published_time');assert.equal(meta.length,1);assert.equal(attribute(meta[0],'content'),article.publishedTime);}
 assert.ok(all(doc,n=>n.tagName==='p').some(n=>plain(n).includes(`情報基準日：${article.informationCutoff}`)));
 return {status:'article-content-verified',blocks:expected(article.markdown).length};
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href){
 const slug=process.argv[2];assert.match(slug,/^(corporate|theme)-[a-z0-9-]+$/);
 console.log(verifyResearchArticle(JSON.parse(readFileSync(`app/articles/${slug}/article.json`)),readFileSync(`out/articles/${slug}/index.html`,'utf8'),{allowDraft:process.argv.includes('--draft')}));
}
