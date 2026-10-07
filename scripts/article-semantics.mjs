import assert from "node:assert/strict";
import { parse } from "parse5";

const children = node => (node.childNodes ?? []).filter(child => child.tagName);
const attr = (node, name) => node.attrs?.find(item => item.name === name)?.value;
const hasClass = (node, name) => (attr(node, "class") ?? "").split(/\s+/).includes(name);
const normalize = value => String(value ?? "").replace(/\s+/g, " ").trim();
const text = node => normalize((node.childNodes ?? []).map(child => child.nodeName === "#text" ? child.value : child.nodeName === "#comment" ? "" : text(child)).join(""));
function descendants(node, predicate) {
  return (node.childNodes ?? []).flatMap(child => [...(predicate(child) ? [child] : []), ...descendants(child, predicate)]);
}
function assertVisibleAttributes(node) {
  if (node.tagName) {
    assert.ok(!["script", "style", "template", "noscript"].includes(node.tagName), "Non-visible content cannot substitute for article content");
    assert.ok(!(node.attrs ?? []).some(item => /^on/i.test(item.name)), "Unexpected event handler in article content");
    assert.ok(!(attr(node, "class") ?? "").split(/\s+/).some(name => ["hidden", "sr-only", "invisible"].includes(name)), "Hidden article content");
    if (attr(node, "style") !== undefined) assert.ok(node.tagName === "i" && /^width:\s*[\d.]+%\s*;?$/.test(attr(node, "style")), "Unexpected inline style in article content");
    assert.equal(attr(node, "hidden"), undefined, "Hidden article content");
    assert.notEqual(attr(node, "aria-hidden"), "true", "Hidden article content");
    assert.equal(attr(node, "inert"), undefined, "Inert article content");
    assert.ok(!/(?:display\s*:\s*none|visibility\s*:\s*hidden|opacity\s*:\s*0(?:\D|$)|content-visibility\s*:\s*hidden)/i.test(attr(node, "style") ?? ""), "Hidden article content");
  }
}
function assertVisible(node) {
  assertVisibleAttributes(node);
  for (const child of node.childNodes ?? []) assertVisible(child);
}
function assertNoLooseText(node) {
  for (const child of node.childNodes ?? []) if (child.nodeName === "#text") assert.equal(normalize(child.value), "", "Unexpected text outside an article content block");
}
function proseText(node) {
  assert.ok(descendants(node, child => child.tagName && !["strong", "em", "b", "i", "br", "span"].includes(child.tagName)).length === 0, "Unexpected element or link in paragraph text");
  return text(node);
}
function sources(node) {
  if (hasClass(node, "source-panel")) {
    assertNoLooseText(node);
    const parts = children(node);
    assert.deepEqual(parts.map(part => part.tagName), ["span", "p"], "Unexpected source panel content");
    assert.ok(hasClass(parts[0], "source-panel-label") && text(parts[0]) === "出典・参考資料");
    assert.ok(hasClass(parts[1], "inline-sources"));
    node = parts[1];
  }
  assertNoLooseText(node);
  const entries = children(node);
  assert.ok(entries.length > 0 && entries.every(entry => entry.tagName === "span"), "Invalid source entries");
  return entries.map((entry, index) => {
    const parts = children(entry);
    const loose = normalize((entry.childNodes ?? []).filter(child => child.nodeName === "#text").map(child => child.value).join(""));
    if (parts.length === 2) {
      assert.deepEqual(parts.map(part => part.tagName), ["span", "a"]);
      assert.ok(hasClass(parts[0], "source-number"));
      assert.equal(text(parts[0]), String(index + 1).padStart(2, "0"));
      assert.equal(loose, "");
    } else {
      assert.deepEqual(parts.map(part => part.tagName), ["a"]);
      assert.equal(loose, index ? "／" : "");
    }
    const link = parts.at(-1);
    return { label: proseText(link), url: attr(link, "href") };
  });
}
function tableData(node) {
  const tables = descendants(node, child => child.tagName === "table");
  assert.equal(tables.length, 1, "Expected one article table");
  assertNoLooseText(node);
  assert.deepEqual(children(node).map(child => child.tagName), ["table"], "Unexpected table wrapper content");
  const table = tables[0];
  const header = children(table).find(child => child.tagName === "thead");
  const body = children(table).find(child => child.tagName === "tbody");
  assert.ok(header && body, "Missing table header or body");
  assert.deepEqual(children(table).map(child => child.tagName), ["thead", "tbody"], "Unexpected table content");
  assert.equal(children(header).length, 1, "Unexpected table header rows");
  const rowCells = (row, tag) => { assert.equal(row.tagName, "tr"); assert.ok(children(row).every(cell => cell.tagName === tag), "Unexpected table cell type"); return children(row).map(proseText); };
  return { headers: rowCells(children(header)[0], "th"), rows: children(body).map(row => rowCells(row, "td")) };
}
function chartPoints(table) {
  return (table?.rows ?? []).filter(row => /^(S&P500|NASDAQ総合|NYダウ|日経平均)$/.test(row[0])).flatMap(row => {
    const match = row[1]?.match(/([+−-]\d+(?:\.\d+)?)%/);
    return match ? [{ label: row[0], value: match[1] + "%", asof: row[2] }] : [];
  });
}
function verifyChart(figure, section) {
  const expected = chartPoints(section.table);
  assert.ok(expected.length >= 2, "Unexpected chart without sufficient source data");
  assert.deepEqual(children(figure).map(node => node.tagName), ["figcaption", "div"], "Unexpected chart content");
  const caption = children(figure)[0];
  assert.equal(text(caption), "MARKET AT A GLANCE主要株価指数の前日比上表の記載値を可視化 / リアルタイムデータではありません", "Unexpected chart caption");
  const bars = children(figure)[1];
  assert.ok(hasClass(bars, "snapshot-bars"));
  assertNoLooseText(bars);
  const rows = children(bars);
  assert.ok(rows.every(row => hasClass(row, "snapshot-bar-row")), "Unexpected chart content");
  const maximum = Math.max(...expected.map(point => Math.abs(Number(point.value.replace("%", "").replace("−", "-")))), .01);
  const actual = rows.map(row => {
    const nodes = children(row);
    assert.deepEqual(nodes.map(node => node.tagName), ["span", "div", "strong", "small"], "Unexpected chart row");
    assertNoLooseText(row);
    assert.deepEqual(children(nodes[1]).map(child => child.tagName), ["i"]);
    const bar = children(nodes[1])[0];
    const change = Number(text(nodes[2]).replace("%", "").replace("−", "-"));
    assert.ok(Math.abs(parseFloat((attr(bar, "style") ?? "").replace("width:", "")) - Math.abs(change) / maximum * 100) < .0001, "Chart bar does not match source data");
    assert.equal(hasClass(bar, "is-negative"), change < 0, "Chart direction does not match source data");
    return { label: text(nodes[0]), value: text(nodes[2]), asof: text(nodes[3]) };
  });
  assert.deepEqual(actual, expected, "Chart differs from the article's stated values");
}
function expectedText(value) {
  assert.ok(typeof value === "string" && value.trim(), "Empty article text");
  return normalize(value);
}
function expectedTokens(section) {
  const tokens = [["h2", expectedText(section.heading)], ...(section.paragraphs ?? []).map(value => ["p", expectedText(value)])];
  if (section.table) tokens.push(["table", { headers: section.table.headers.map(expectedText), rows: section.table.rows.map(row => row.map(expectedText)) }]);
  if (section.sources?.length) tokens.push(["sources", section.sources.map(source => ({ label: expectedText(source.label), url: expectedText(source.url) }))]);
  for (const subsection of section.subsections ?? []) {
    const nested = [["h3", expectedText(subsection.heading)], ...(subsection.paragraphs ?? []).map(value => ["p", expectedText(value)])];
    if (subsection.bullets?.length) nested.push(["ul", subsection.bullets.map(expectedText)]);
    tokens.push(["subsection", nested]);
  }
  return tokens;
}
function actualTokens(section, expected) {
  assertNoLooseText(section);
  const tokens = [];
  for (const node of children(section)) {
    if (hasClass(node, "source-panel") || hasClass(node, "inline-sources")) tokens.push(["sources", sources(node)]);
    else if (node.tagName === "h2" || node.tagName === "h3") tokens.push([node.tagName, proseText(node)]);
    else if (node.tagName === "p") tokens.push(["p", proseText(node)]);
    else if (hasClass(node, "table-wrap")) tokens.push(["table", tableData(node)]);
    else if (node.tagName === "figure" && hasClass(node, "snapshot-chart")) verifyChart(node, expected);
    else if (node.tagName === "ul") { assert.ok(children(node).every(child => child.tagName === "li")); tokens.push(["ul", children(node).map(proseText)]); }
    else if (node.tagName === "div" && children(node)[0]?.tagName === "h3") tokens.push(["subsection", actualTokens(node, {})]);
    else assert.fail(`Unexpected article block: ${node.tagName}`);
  }
  return tokens;
}

/** Compare ordered article semantics, not styling wrappers. Hidden/extra/missing content fails. */
export function verifyArticleSemantics(article, html) {
  assert.ok(Array.isArray(article.sections) && article.sections.length, "Article has no sections");
  assert.ok(article.disclaimer?.paragraphs?.length, "Article has no disclaimer");
  const document = parse(html);
  const modern = descendants(document, node => hasClass(node, "editorial-article")).length > 0;
  const bodies = descendants(document, node => hasClass(node, "report-body"));
  assert.equal(bodies.length, 1, "Expected exactly one rendered report body");
  const body = bodies[0];
  let scope = body.parentNode;
  while (scope && scope.tagName !== "article") scope = scope.parentNode;
  assert.ok(scope, "Missing article container");
  const headings = descendants(scope, node => node.tagName === "h1");
  assert.equal(headings.length, 1, "Expected exactly one article H1");
  assertVisible(headings[0]);
  const expectedTitle = article.title?.trim() || article.headline?.trim();
  assert.ok(expectedTitle, "Missing authoritative article title");
  assert.equal(text(headings[0]), normalize(expectedTitle), "Stale article headline");
  const dates = descendants(scope, node => hasClass(node, "report-date"));
  assert.equal(dates.length, 1, "Expected exactly one publication date");
  assertVisible(dates[0]);
  assert.ok([normalize(article.displayDate), normalize(`${article.displayDate} · ${article.date.slice(11)} JST`)].includes(text(dates[0])), "Stale article date");
  if (dates[0].tagName === "time") assert.equal(attr(dates[0], "datetime"), article.dateTime, "Stale article timestamp");
  for (const target of [body, headings[0], dates[0]]) {
    for (let ancestor = target; ancestor && ancestor.tagName !== "body"; ancestor = ancestor.parentNode) assertVisibleAttributes(ancestor);
  }
  assertNoLooseText(body);
  const sections = children(body).filter(node => node.tagName === "section");
  const expected = [...article.sections, article.disclaimer];
  assert.equal(sections.length, expected.length, "Missing or extra article sections");
  for (const [index, section] of sections.entries()) {
    assertVisible(section);
    if (modern) assert.equal(children(section).filter(node => hasClass(node, "snapshot-chart")).length, chartPoints(expected[index].table).length >= 2 ? 1 : 0, "Missing or extra source-derived chart");
    assert.deepEqual(actualTokens(section, expected[index]), expectedTokens(expected[index]), `Article section ${index + 1} differs from the commit's complete ordered content`);
  }
  for (const node of children(body).filter(node => node.tagName !== "section")) {
    assert.ok(node.tagName === "a" && hasClass(node, "article-end-link") && attr(node, "href") === "/market-note/#articles" && text(node) === "レポート一覧に戻る ↗", "Unexpected content after report sections");
  }
  if (modern) {
    const documentTitles = descendants(document, node => node.tagName === "title");
    assert.equal(documentTitles.length, 1);
    assert.equal(text(documentTitles[0]), `${expectedTitle} | Market Note`, "Stale search title");
    const description = article.description?.trim() || article.excerpt?.trim() || expectedTitle;
    for (const [name, value] of [["og:title", `${expectedTitle} | Market Note`], ["twitter:title", `${expectedTitle} | Market Note`], ["description", description], ["og:description", description], ["twitter:description", description]]) {
      const tags = descendants(document, node => node.tagName === "meta" && (attr(node, "property") === name || attr(node, "name") === name));
      assert.equal(tags.length, 1, `Missing or duplicate ${name}`);
      assert.equal(attr(tags[0], "content"), value, `Stale ${name}`);
    }
  }
}
