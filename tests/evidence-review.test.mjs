import assert from "node:assert/strict";
import { readFileSync, mkdtempSync, mkdirSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";
import { articleDigest, validateReview, checkRepository, REQUIRED_FROM } from "../scripts/check-evidence.mjs";

const slug = "daily-2026-10-17";
const file = `content/daily/${slug}.json`;
const files = { [file]: readFileSync(file, "utf8") };
const source = JSON.parse(readFileSync(`content/evidence/${slug}.json`, "utf8"));
const copy = () => structuredClone(source);
const validate = review => validateReview(review, { slug, files });

test("first real-content adoption: Tokyo Steel forecast and actual remain distinct", () => {
  assert.equal(validate(source).ready, 1);
  const c = source.comparisons[0];
  assert.deepEqual(c.observations.map(o => o.value), [-4000, 1000, 7230]);
  assert.deepEqual(c.observations.map(o => o.basis), ["company-forecast", "company-forecast", "actual"]);
  assert.ok(c.observations.every(o => o.source.kind === "primary" && o.source.pdfPage === 1));
});

test("ready claim cannot publish with one missing required input", () => {
  const r = copy(); r.comparisons[0].observations.pop();
  assert.throws(() => validate(r), /missing evidence: prior-actual/);
});

for (const [name, mutation, pattern] of [
  ["mixed units", o => { o.unit = "億円"; }, /metadata mismatch/],
  ["forecast reported as actual", o => { o.basis = "actual"; }, /metadata mismatch/],
  ["mixed fiscal period", o => { o.periodStart = "2025-04-01"; }, /metadata mismatch/],
  ["different metric definition", o => { o.definition = "設備投資額"; }, /metadata mismatch/],
  ["missing value", o => { o.value = null; }, /missing\/non-numeric/],
  ["unverified PDF page", o => { delete o.source.pdfPage; }, /PDF page/],
  ["missing source locator", o => { o.source.locator = ""; }, /locator/],
  ["source published after cutoff", o => { o.source.publishedOn = "2026-10-18"; }, /after information cutoff/],
  ["secondary source without explanation", o => { o.source.kind = "secondary"; }, /explain missing primary/],
]) {
  test(`reject ${name}`, () => {
    const r = copy(); mutation(r.comparisons[0].observations[0]);
    assert.throws(() => validate(r), pattern);
  });
}

test("arithmetic error, duplicate evidence and unsupported executable formula are rejected", () => {
  const r = copy(); r.comparisons[0].calculations[0].value = 4000;
  assert.throws(() => validate(r), /does not match inputs/);
  const d = copy(); d.comparisons[0].observations.push(d.comparisons[0].observations[0]);
  assert.throws(() => validate(d), /duplicate observation/);
  const x = copy(); x.comparisons[0].calculations[0].operation = "eval";
  assert.throws(() => validate(x), /unsupported operation/);
});

test("growth from loss and division by zero cannot masquerade as a meaningful percentage", () => {
  for (const operation of ["growth-percent", "ratio-percent"]) {
    const r = copy(); const c = r.comparisons[0];
    c.calculations = [{ id: "bad", operation, inputs: ["new-forecast", "old-forecast"], precision: 1, definition: "割合", value: 0 }];
    if (operation === "ratio-percent") c.observations[0].value = 0;
    assert.throws(() => validate(r), /unsupported operation, arity or denominator/);
  }
});

test("safe formulas support cash outflows and chained margin calculations", () => {
  const r = copy(); const c = r.comparisons[0];
  c.observations.forEach((o, i) => { o.value = [-20, -10, 100][i]; });
  c.calculations = [
    { id: "fcf", operation: "sum", inputs: ["prior-actual", "old-forecast", "new-forecast"], definition: "営業CF＋負数の有形・無形取得支出", precision: 0, value: 70 },
    { id: "ratio", operation: "ratio-percent", inputs: ["fcf", "prior-actual"], definition: "割合", precision: 1, value: 70 },
  ];
  assert.equal(validate(r).ready, 1);
});

test("a removed comparison does not block supported article content", () => {
  const r = copy(); const c = r.comparisons[0];
  c.status = "withheld"; c.reason = "追加調査でも前期実績を確認できない";
  c.omittedClaim = c.claim; delete c.claim; c.calculations = []; c.observations.pop();
  assert.throws(() => validate(r), /withheld claim remains/);
  const revised = { [file]: files[file].replace(c.omittedClaim, "この比較に必要な前期実績は確認できていません。") };
  r.articleSha256 = articleDigest(revised);
  assert.equal(validateReview(r, { slug, files: revised }).withheld, 1);
});

test("changed article source requires a fresh review rather than silently reusing evidence", () => {
  assert.throws(() => validateReview(source, { slug, files: { [file]: files[file] + "\n" } }), /article changed after evidence review/);
  const changed = copy(); changed.comparisons[0].claim = "新しい未確認の比較結論";
  assert.throws(() => validate(changed), /claim must match article text/);
});

test("new reports cannot use the selected-comparisons archive exception", () => {
  assert.throws(() => validateReview(source, { slug, files, required: true }), /all material comparisons/);
});

test("repository gate covers new daily and weekly files without retroactively stopping archives", () => {
  const root = mkdtempSync(path.join(tmpdir(), "market-evidence-"));
  const write = (name, value) => { const p = path.join(root, name); mkdirSync(path.dirname(p), { recursive: true }); writeFileSync(p, value); };
  try {
    write("content/daily/daily-2026-10-17.json", "{}");
    mkdirSync(path.join(root, "app/articles"), { recursive: true });
    assert.equal(checkRepository(root).legacyArticlesUnchanged, 1);
    const newSlug = `daily-${REQUIRED_FROM}`;
    const name = `content/daily/${newSlug}.json`;
    write(name, "{}");
    assert.throws(() => checkRepository(root), /missing content\/evidence/);
    const review = { version: 1, articleSlug: newSlug, articleSha256: articleDigest({ [name]: "{}" }), informationCutoff: "2026-10-18T07:00:00+09:00", checkedAt: "2026-10-18T07:01:00+09:00", coverage: "all-material-comparisons", reviewNote: "Fixture has no comparison claims", comparisons: [] };
    write(`content/evidence/${newSlug}.json`, JSON.stringify(review));
    assert.equal(checkRepository(root).checked.length, 1);
    write("app/articles/weekly-2026-10-24/page.tsx", "export default null;");
    assert.throws(() => checkRepository(root), /weekly-2026-10-24: missing/);
    write("content/evidence/unknown.json", "{}");
    assert.throws(() => checkRepository(root), /orphaned evidence/);
  } finally { rmSync(root, { recursive: true, force: true }); }
});

test("both production build commands enforce the gate; existing publication checks remain", () => {
  const pkg = JSON.parse(readFileSync("package.json", "utf8"));
  for (const key of ["build", "build:pages"]) assert.ok(pkg.scripts[key].startsWith("node scripts/check-evidence.mjs &&"));
  const workflow = readFileSync(".github/workflows/pages.yml", "utf8");
  assert.ok(workflow.includes("npm run check:evidence && npm run test:evidence"));
  assert.ok(workflow.includes("tests/publication-verification.test.mjs"));
  assert.ok(workflow.includes("npm run test:browser && npm run test:browser:news"));
});
