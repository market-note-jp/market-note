import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {verifyResearchArticle} from '../scripts/verify-research-article.mjs';
const slugs=["company-secom-2026-11-08","company-oreilly-2026-11-08","company-intertek-2026-11-08","theme-japan-real-wages-consumption-2026-11-08","theme-treasury-buybacks-not-qe-2026-11-08","company-keyence-2026-11-06","company-ametek-2026-11-06","company-kone-2026-11-06","theme-us-productivity-ai-margins-2026-11-06","theme-boe-energy-margins-2026-11-06","company-nintendo-2026-11-05","company-autozone-2026-11-05","company-atlas-copco-2026-11-05","theme-ism-services-demand-deliveries-2026-11-05","theme-arm-silicon-gross-margin-2026-11-05","company-agc-2026-11-04","company-parker-hannifin-2026-11-04","company-diploma-2026-11-04","theme-amd-profit-working-capital-2026-11-04","theme-rba-inflation-housing-2026-11-04","company-graco-2026-11-03","company-azbil-2026-11-03","company-relx-2026-11-03","theme-marvell-lumentum-shareholder-value-2026-11-03","theme-sloos-private-equity-credit-2026-11-03","company-tsugami-2026-11-02","company-dorman-2026-11-02","company-mettler-toledo-2026-11-02","theme-tax-refund-retail-profit-2026-11-02","theme-opec-targets-actual-supply-2026-11-02","company-nakanishi-2026-11-01","company-verisk-2026-11-01","company-loreal-2026-11-01","theme-uk-mortgage-reset-arrears-2026-11-01","theme-power-acquisition-supply-2026-11-01","corporate-orix-2026-10-18","corporate-shimano-2026-10-18","corporate-waste-management-2026-10-18","theme-tsmc-growth-margin-2026-10-18","theme-oil-demand-supply-2026-10-18",'corporate-nintendo-2026-10-17','corporate-monotaro-2026-10-17','corporate-costco-2026-10-17','theme-microsoft-ai-cashflow-2026-10-17','theme-jpmorgan-nii-margin-2026-10-17'];
for(const slug of slugs){
 const article=JSON.parse(readFileSync(`app/articles/${slug}/article.json`));
 const html=readFileSync(`out/articles/${slug}/index.html`,'utf8');
 const verify=markup=>verifyResearchArticle(article,markup,{allowDraft:article.publishedTime===null});
 if(slug.endsWith('-2026-11-04'))test(`${slug}: explicit title block precedes article content`,()=>assert.equal(article.markdown.trim().split(/\n\s*\n/)[0],`# ${article.title}`));
 if(slug==='company-parker-hannifin-2026-11-04')test(`${slug}: opening company description is visibly rendered`,()=>{
  const introduction='Parker Hannifinは、工場や航空機の「動き、流れ、圧力」を制御する部品・システムの会社です。油圧、空圧、フィルター、シールなどを組み合わせ、装置メーカーへの販売と、その後の補修・交換で稼ぎます。';
  assert.equal(article.markdown.trim().split(/\n\s*\n/)[1],introduction);
  assert.ok(html.includes(`<div class="report-body research-article-body"><p>${introduction}</p>`));
 });
 test(`${slug}: complete ordered body, every cell/link and metadata`,()=>verify(html));
 for(const [label,mutate] of [
  ['removed paragraph',h=>h.replace(/(<div class="report-body research-article-body">[\s\S]*?)<p>.*?<\/p>/s,'$1')],
  ['altered table value or prose number',h=>/<td/.test(h) ? h.replace(/(<td[^>]*>)([^<]+)(<\/td>)/,'$1ALTERED$3') : h.replace(/(<div class="report-body research-article-body">[\s\S]*?<p>[^<]*?)([0-9]+)/,'$1ALTERED')],
  ['source destination changed',h=>h.replace(/(<div class="report-body research-article-body">[\s\S]*?<a[^>]*href=")[^"]+/, '$1https://invalid.example/')],
  ['hidden ancestor',h=>h.replace('<article>','<article aria-hidden="true">')],
  ['hidden body',h=>h.replace('class="report-body research-article-body"','hidden="" class="report-body research-article-body"')],
  ['metadata mismatch',h=>h.replace(/(<meta name="description" content=")[^"]+/, '$1INVALID')],
 ])test(`${slug}: rejects ${label}`,()=>{const mutated=mutate(html);assert.notEqual(mutated,html,'Mutation must affect export');assert.throws(()=>verify(mutated));});
 test(`${slug}: draft cannot pass publication check`,()=>{if(!article.publishedTime)assert.throws(()=>verifyResearchArticle(article,html),/publication timestamp/);});
}
