import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {verifyResearchArticle} from '../scripts/verify-research-article.mjs';
const slugs=['corporate-nintendo-2026-10-17','corporate-monotaro-2026-10-17','corporate-costco-2026-10-17','theme-microsoft-ai-cashflow-2026-10-17','theme-jpmorgan-nii-margin-2026-10-17'];
for(const slug of slugs){
 const article=JSON.parse(readFileSync(`app/articles/${slug}/article.json`));
 const html=readFileSync(`out/articles/${slug}/index.html`,'utf8');
 const verify=markup=>verifyResearchArticle(article,markup,{allowDraft:article.publishedTime===null});
 test(`${slug}: complete ordered body, every cell/link and metadata`,()=>verify(html));
 for(const [label,mutate] of [
  ['removed paragraph',h=>h.replace(/(<div class="report-body research-article-body">)<p>.*?<\/p>/s,'$1')],
  ['altered table value',h=>h.replace(/(<td[^>]*>)([^<]+)(<\/td>)/,'$1ALTERED$3')],
  ['source destination changed',h=>h.replace(/(<div class="report-body research-article-body">[\s\S]*?<a[^>]*href=")[^"]+/, '$1https://invalid.example/')],
  ['hidden ancestor',h=>h.replace('<article>','<article aria-hidden="true">')],
  ['hidden body',h=>h.replace('class="report-body research-article-body"','hidden="" class="report-body research-article-body"')],
  ['metadata mismatch',h=>h.replace(/(<meta name="description" content=")[^"]+/, '$1INVALID')],
 ])test(`${slug}: rejects ${label}`,()=>{const mutated=mutate(html);assert.notEqual(mutated,html,'Mutation must affect export');assert.throws(()=>verify(mutated));});
 test(`${slug}: draft cannot pass publication check`,()=>{if(!article.publishedTime)assert.throws(()=>verifyResearchArticle(article,html),/publication timestamp/);});
}
