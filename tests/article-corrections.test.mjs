import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { parse } from "parse5";

const dates = ["2026-08-04", "2026-09-05", "2026-09-21", "2026-09-24"];
const attr = (node, name) => node.attrs?.find(item => item.name === name)?.value;
const text = node => (node.childNodes ?? []).map(child => child.nodeName === "#text" ? child.value : text(child)).join("");
const find = (node, predicate) => (node.childNodes ?? []).flatMap(child => [...(predicate(child) ? [child] : []), ...find(child, predicate)]);
const documents = Object.fromEntries(dates.map(date => [date, parse(readFileSync(`out/articles/daily-${date}/index.html`, "utf8"))]));
const note = date => find(documents[date], node => attr(node, "aria-label") === "訂正履歴")[0];
const section = (date, heading) => find(documents[date], node => node.tagName === "section" && (node.childNodes ?? []).some(child => child.tagName === "h2" && text(child).startsWith(heading)))[0];

// These four dated editorial corrections are the only approved changes to the
// preservation fixture. The existing all-article tests still hash every body.
test("four corrections are visible and dated separately from original publication dates", () => {
  for (const date of dates) {
    assert.equal(find(documents[date], node => attr(node, "aria-label") === "訂正履歴").length, 1, date);
    const correction = note(date);
    assert.equal(attr(correction, "hidden"), undefined);
    assert.notEqual(attr(correction, "aria-hidden"), "true");
    assert.equal(find(correction, node => node.tagName === "time")[0]?.attrs.find(item => item.name === "datetime")?.value, "2026-10-07", date);
    assert.match(text(correction), /訂正（2026年10月7日）/);
    assert.ok(find(correction, node => node.tagName === "a").length > 0, date);
    const publication = find(documents[date], node => attr(node, "class") === "report-date");
    assert.equal(publication.length, 1, date);
    const [year, month, day] = date.split("-").map(Number);
    assert.match(text(publication[0]), new RegExp(`${year}年${month}月${day}日`));
    assert.doesNotMatch(text(publication[0]), /10月7日/);
  }
});

test("August 4 separates Q2 actual revenue growth from FY26 guidance", () => {
  const body = text(section("2026-08-04", "2．Palantir"));
  assert.match(body, /2026年4～6月期（Q2）/);
  assert.match(body, /米国商業部門の売上高が前年同期比149％増/);
  assert.match(body, /全社売上高も前年同期比93％増/);
  assert.doesNotMatch(body, /全社売上高も82％/);
  assert.match(text(note("2026-08-04")), /82％は2026年通期/);
  assert.ok(find(note("2026-08-04"), node => node.tagName === "a").some(node => attr(node, "href") === "https://www.sec.gov/Archives/edgar/data/1321655/000132165526000039/a2026q2ex991pressrelease.htm"));
});

test("September 5 corrects all four Brent mentions and discloses later source revision", () => {
  for (const heading of ["今日の結論", "市場スナップショット", "5．ブレント"]) {
    const body = text(section("2026-09-05", heading));
    assert.match(body, /96\.28/);
    assert.doesNotMatch(body, /92\.68/);
  }
  const oil = text(section("2026-09-05", "5．ブレント"));
  assert.match(oil, /前日比0\.8%高/);
  assert.match(oil, /週間では7\.6%/);
  assert.match(text(note("2026-09-05")), /後日配信元訂正反映/);
  assert.match(text(note("2026-09-05")), /9月5日10時49分（米東部夏時間、日本時間同日23時49分）/);
  assert.match(text(note("2026-09-05")), /公開当時に確認済みだった情報としては扱いません/);
});

test("September 21 distinguishes closed cash equities from holiday futures and FX", () => {
  const body = text(section("2026-09-21", "5．日銀"));
  assert.match(body, /現物市場は9月21〜23日が休場/);
  assert.match(body, /取引再開は9月24日/);
  assert.match(body, /9月18日にも取引は行われており/);
  assert.match(body, /為替市場や、日経225先物など対象商品の祝日取引/);
  assert.doesNotMatch(body, /初の本格評価/);
  assert.ok(find(section("2026-09-21", "5．日銀"), node => node.tagName === "a").some(node => attr(node, "href") === "https://www.jpx.co.jp/derivatives/rules/holidaytrading/index.html"));
  assert.match(text(documents["2026-09-21"]), /2026年9月21日午前7時までに/);
  assert.match(text(section("2026-09-21", "今日の結論")), /現物株の反応は9月24日の取引再開後/);
  assert.match(text(section("2026-09-21", "市場スナップショット")), /9月24日再開後の銀行株/);
});

test("September 24 uses September 23 close with a pre-cutoff source", () => {
  const body = text(section("2026-09-24", "2．9月23日"));
  assert.match(body, /S&P500が0\.75%安、NASDAQ総合が1\.13%安、ダウ平均が0\.68%安/);
  assert.match(body, /9月23日16時37分EDT更新＝9月24日5時37分JST/);
  assert.doesNotMatch(body, /0\.02%安|0\.01%高|0\.31%安|ほぼ横ばい|NASDAQ高値維持/);
  assert.match(text(note("2026-09-24")), /基準時刻より後/);
  assert.match(text(note("2026-09-24")), /日本時間9月25日5時17分/);
  assert.match(text(documents["2026-09-24"]), /本記事は2026年9月24日午前7時までに確認できた公開情報/);
  assert.ok(Date.parse("2026-09-23T16:37:00-04:00") < Date.parse("2026-09-24T07:00:00+09:00"));
  assert.ok(Date.parse("2026-09-24T16:17:00-04:00") > Date.parse("2026-09-24T07:00:00+09:00"));
});
