import { createHash } from "node:crypto";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

// Earlier archives stay intact. Earlier articles can opt in with a review file.
export const REQUIRED_FROM = "2026-10-18";
const nonempty = value => typeof value === "string" && value.trim().length > 0;
const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const date = value => typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value) &&
  Number.isFinite(Date.parse(value)) && new Date(value).toISOString().slice(0, 10) === value;
const instant = value => typeof value === "string" && /(Z|[+-]\d{2}:\d{2})$/.test(value) && Number.isFinite(Date.parse(value));
const normalized = value => value.replace(/\s+/g, " ").trim();
const metadata = ["entity", "metric", "periodStart", "periodEnd", "unit", "basis", "definition"];

function need(condition, message) {
  if (!condition) throw new Error(message);
}

export function articleDigest(files) {
  const hash = createHash("sha256");
  for (const [name, content] of Object.entries(files).sort(([a], [b]) => a.localeCompare(b))) {
    hash.update(name).update("\0").update(content).update("\0");
  }
  return hash.digest("hex");
}

export function validateReview(review, { slug, files, required = false }) {
  const body = normalized(Object.values(files).join("\n"));
  need(review?.version === 1 && review.articleSlug === slug, `${slug}: invalid review identity`);
  need(review.articleSha256 === articleDigest(files), `${slug}: article changed after evidence review; recheck and update digest`);
  need(instant(review.checkedAt) && instant(review.informationCutoff), `${slug}: explicit-zone review time and cutoff required`);
  need(Date.parse(review.checkedAt) >= Date.parse(review.informationCutoff), `${slug}: review precedes information cutoff`);
  need(nonempty(review.reviewNote), `${slug}: explain the review scope`);
  need(["all-material-comparisons", "selected-comparisons"].includes(review.coverage), `${slug}: invalid coverage`);
  if (required) need(review.coverage === "all-material-comparisons", `${slug}: new articles require a review of all material comparisons`);
  need(Array.isArray(review.comparisons), `${slug}: comparisons must be an array (empty only after editorial review)`);
  const ids = new Set();
  let ready = 0, withheld = 0;
  for (const comparison of review.comparisons) {
    const label = `${slug}/${comparison.id}`;
    need(nonempty(comparison.id) && !ids.has(comparison.id), `${slug}: duplicate or missing comparison id`);
    ids.add(comparison.id);
    need(nonempty(comparison.question) && nonempty(comparison.definition), `${label}: question and comparison definition required`);
    need(["ready", "withheld"].includes(comparison.status), `${label}: invalid status`);
    need(Array.isArray(comparison.requiredInputs) && comparison.requiredInputs.length > 0, `${label}: list inputs before collecting evidence`);
    need(Array.isArray(comparison.observations), `${label}: observations must be an array`);
    const requirements = new Map();
    for (const spec of comparison.requiredInputs) {
      need(nonempty(spec.id) && !requirements.has(spec.id), `${label}: duplicate or missing input id`);
      need(metadata.every(key => nonempty(spec[key])), `${label}/${spec.id}: incomplete entity/period/unit/basis/definition`);
      need(date(spec.periodStart) && date(spec.periodEnd) && spec.periodStart <= spec.periodEnd, `${label}/${spec.id}: invalid period`);
      need(["actual", "company-forecast", "consensus", "market"].includes(spec.basis), `${label}/${spec.id}: invalid basis`);
      requirements.set(spec.id, spec);
    }
    const values = new Map();
    for (const observation of comparison.observations) {
      const spec = requirements.get(observation.id);
      need(spec && !values.has(observation.id), `${label}: unexpected or duplicate observation`);
      need(metadata.every(key => same(spec[key], observation[key])), `${label}/${observation.id}: input metadata mismatch`);
      need(typeof observation.value === "number" && Number.isFinite(observation.value), `${label}/${observation.id}: missing/non-numeric value; never substitute zero`);
      const source = observation.source;
      let url;
      try { url = new URL(source?.url); } catch { throw new Error(`${label}/${observation.id}: invalid source URL`); }
      need(url.protocol === "https:" && !url.username && !url.password, `${label}/${observation.id}: public HTTPS source required`);
      need(date(source.publishedOn), `${label}/${observation.id}: source publication date required`);
      const cutoffDay = new Date(Date.parse(review.informationCutoff) + 9 * 3600_000).toISOString().slice(0, 10);
      need(source.publishedOn <= cutoffDay, `${label}/${observation.id}: source published after information cutoff`);
      need(nonempty(source.locator), `${label}/${observation.id}: table/section locator required`);
      if (/\.pdf$/i.test(url.pathname)) need(Number.isInteger(source.pdfPage) && source.pdfPage > 0, `${label}/${observation.id}: 1-based PDF page required`);
      need(["primary", "secondary"].includes(source.kind), `${label}/${observation.id}: source provenance required`);
      if (source.kind === "secondary") need(nonempty(source.primaryUnavailableReason), `${label}/${observation.id}: explain missing primary source`);
      values.set(observation.id, observation.value);
    }
    const missing = [...requirements.keys()].filter(id => !values.has(id));
    need(Array.isArray(comparison.calculations), `${label}: calculations must be an array`);
    if (comparison.status === "withheld") {
      need(nonempty(comparison.reason) && nonempty(comparison.omittedClaim), `${label}: explain withheld comparison and record omitted claim`);
      need(!body.includes(normalized(comparison.omittedClaim)), `${label}: withheld claim remains in article`);
      need(comparison.calculations.length === 0 && !comparison.claim, `${label}: do not publish or calculate a withheld comparison`);
      withheld++;
      continue;
    }
    need(missing.length === 0, `${label}: missing evidence: ${missing.join(", ")}`);
    need(nonempty(comparison.claim) && body.includes(normalized(comparison.claim)), `${label}: reviewed claim must match article text`);
    // Only explicit numeric operations, never eval or executable formulas.
    for (const calculation of comparison.calculations) {
      need(nonempty(calculation.id) && !values.has(calculation.id), `${label}: duplicate calculation id`);
      need(nonempty(calculation.definition), `${label}/${calculation.id}: calculation definition required`);
      need(Array.isArray(calculation.inputs) && calculation.inputs.length > 0 && calculation.inputs.every(id => values.has(id)), `${label}/${calculation.id}: missing calculation input`);
      const nums = calculation.inputs.map(id => values.get(id));
      let value;
      if (calculation.operation === "sum") value = nums.reduce((sum, number) => sum + number, 0);
      else if (calculation.operation === "difference" && nums.length === 2) value = nums[0] - nums[1];
      else if (calculation.operation === "ratio-percent" && nums.length === 2 && nums[1] !== 0) value = nums[0] / nums[1] * 100;
      else if (calculation.operation === "growth-percent" && nums.length === 2 && nums[1] > 0) value = (nums[0] / nums[1] - 1) * 100;
      else throw new Error(`${label}/${calculation.id}: unsupported operation, arity or denominator`);
      need(Number.isInteger(calculation.precision) && calculation.precision >= 0 && calculation.precision <= 6, `${label}/${calculation.id}: precision must be 0–6`);
      const rounded = Number(value.toFixed(calculation.precision));
      need(typeof calculation.value === "number" && Number.isFinite(value) && Math.abs(rounded - calculation.value) < 1e-9, `${label}/${calculation.id}: calculation does not match inputs`);
      values.set(calculation.id, value);
    }
    ready++;
  }
  return { slug, ready, withheld, coverage: review.coverage };
}

function staticFiles(root, slug) {
  const directory = path.join(root, "app", "articles", slug);
  const files = {};
  function visit(dir) {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const name = path.join(dir, entry.name);
      if (entry.isDirectory()) visit(name);
      else if (/\.(?:tsx?|json)$/.test(entry.name)) files[path.relative(root, name).split(path.sep).join("/")] = readFileSync(name, "utf8");
    }
  }
  visit(directory);
  return files;
}

export function checkRepository(root = process.cwd()) {
  const articles = new Map();
  const dailyDir = path.join(root, "content", "daily");
  for (const name of readdirSync(dailyDir).filter(name => /^daily-\d{4}-\d{2}-\d{2}\.json$/.test(name))) {
    const relative = `content/daily/${name}`;
    articles.set(name.slice(0, -5), { [relative]: readFileSync(path.join(root, relative), "utf8") });
  }
  const routes = path.join(root, "app", "articles");
  for (const entry of readdirSync(routes, { withFileTypes: true })) {
    if (entry.isDirectory() && /-\d{4}-\d{2}-\d{2}$/.test(entry.name) && !articles.has(entry.name)) {
      articles.set(entry.name, staticFiles(root, entry.name));
    }
  }
  const evidenceDir = path.join(root, "content", "evidence");
  const evidenceNames = existsSync(evidenceDir) ? readdirSync(evidenceDir).filter(name => name.endsWith(".json")) : [];
  for (const name of evidenceNames) need(articles.has(name.slice(0, -5)), `${name}: orphaned evidence review`);
  const checked = [];
  let legacy = 0;
  for (const [slug, files] of articles) {
    const required = slug.slice(-10) >= REQUIRED_FROM;
    const reviewPath = path.join(evidenceDir, `${slug}.json`);
    if (!existsSync(reviewPath)) {
      need(!required, `${slug}: missing content/evidence/${slug}.json; collect evidence or omit unsupported comparisons`);
      legacy++;
      continue;
    }
    checked.push(validateReview(JSON.parse(readFileSync(reviewPath, "utf8")), { slug, files, required }));
  }
  return { status: "evidence-checked", requiredFrom: REQUIRED_FROM, checked, legacyArticlesUnchanged: legacy };
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  try { console.log(JSON.stringify(checkRepository(), null, 2)); }
  catch (error) { console.error(`Evidence review failed: ${error.message}`); process.exitCode = 1; }
}
