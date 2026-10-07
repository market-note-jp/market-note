import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import ts from "typescript";

const root = new URL("../", import.meta.url);

function parseLegacyRegistry(source) {
  const ast = ts.createSourceFile("page.tsx", source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  const declaration = ast.statements.filter(ts.isVariableStatement)
    .flatMap((statement) => [...statement.declarationList.declarations])
    .find((item) => item.name.getText(ast) === "legacyArticles");

  assert.ok(declaration && ts.isArrayLiteralExpression(declaration.initializer), "Keep one legacy homepage article registry");

  return declaration.initializer.elements.map((element) => {
    assert.ok(ts.isObjectLiteralExpression(element));
    return Object.fromEntries(element.properties.map((property) => {
      assert.ok(ts.isPropertyAssignment(property) && ts.isStringLiteral(property.initializer));
      return [ts.isStringLiteral(property.name) ? property.name.text : property.name.getText(ast), property.initializer.text];
    }));
  });
}

export async function loadContentDrivenArticles() {
  const directory = new URL("../content/daily/", import.meta.url);
  const files = await readdir(directory);
  const entries = [];

  for (const file of files.filter((name) => /^daily-\d{4}-\d{2}-\d{2}\.json$/.test(name))) {
    const article = JSON.parse(await readFile(new URL(file, directory), "utf8"));
    const expectedSlug = file.replace(/\.json$/, "");
    assert.equal(article.slug, expectedSlug, `${file}: slug must match filename`);
    assert.equal(article.kind, "日次レポート", `${file}: kind must be 日次レポート`);
    assert.ok(article.date && article.dateTime && article.title && article.excerpt);
    assert.ok(Array.isArray(article.sections) && article.sections.length > 0, `${file}: sections must not be empty`);
    assert.ok(article.disclaimer?.paragraphs?.length, `${file}: disclaimer must not be empty`);

    entries.push({
      kind: article.kind,
      date: article.date,
      dateTime: article.dateTime,
      title: article.title,
      excerpt: article.excerpt,
      href: `/articles/${article.slug}`,
      contentDriven: true,
    });
  }

  return entries;
}

export async function loadArticleRegistry() {
  const source = await readFile(new URL("../app/page.tsx", import.meta.url), "utf8");
  const editorialTitles = JSON.parse(await readFile(new URL("../content/editorial-titles.json", import.meta.url), "utf8"));
  const legacy = parseLegacyRegistry(source).map(article => {
    const editorial = editorialTitles[article.href.replace("/articles/", "")];
    return editorial ? { ...article, title: editorial.title } : article;
  });
  const contentDriven = await loadContentDrivenArticles();
  const articles = [...contentDriven, ...legacy];

  assert.equal(new Set(articles.map((article) => article.href)).size, articles.length, "Article routes must be unique");
  return articles;
}
