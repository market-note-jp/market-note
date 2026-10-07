import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { resolveArticleTitle } from "./article-metadata";

export type ArticleSummary = {
  kind: string;
  date: string;
  dateTime: string;
  title: string;
  excerpt: string;
  href: string;
  theme?: string;
};

export type SourceLink = {
  label: string;
  url: string;
};

export type ArticleTable = {
  headers: string[];
  rows: string[][];
};

export type ArticleSubsection = {
  heading: string;
  paragraphs?: string[];
  bullets?: string[];
};

export type DailyArticleSection = {
  heading: string;
  paragraphs?: string[];
  table?: ArticleTable;
  sources?: SourceLink[];
  subsections?: ArticleSubsection[];
};

export type DailyArticle = {
  slug: string;
  kind: "日次レポート";
  date: string;
  dateTime: string;
  title: string;
  headline: string;
  excerpt: string;
  description: string;
  label: string;
  displayDate: string;
  sections: DailyArticleSection[];
  disclaimer: {
    heading: string;
    paragraphs: string[];
  };
};

const dailyContentDir = path.join(process.cwd(), "content", "daily");
const dailyFilePattern = /^daily-\d{4}-\d{2}-\d{2}\.json$/;

type DailyArticleInput = Omit<DailyArticle, "title" | "headline"> & { title?: string; headline?: string };

function readDailyFile(fileName: string): DailyArticle {
  const filePath = path.join(dailyContentDir, fileName);
  return normalizeDailyArticle(JSON.parse(readFileSync(filePath, "utf8")) as DailyArticleInput, fileName);
}

export function normalizeDailyArticle(input: DailyArticleInput, fileName: string): DailyArticle {
  const title = resolveArticleTitle(input);
  const parsed: DailyArticle = { ...input, title, headline: title };
  const expectedSlug = fileName.replace(/\.json$/, "");

  if (parsed.slug !== expectedSlug) {
    throw new Error(`${fileName}: slug must be ${expectedSlug}`);
  }
  if (parsed.kind !== "日次レポート") {
    throw new Error(`${fileName}: kind must be 日次レポート`);
  }
  for (const key of ["date", "dateTime", "title", "excerpt", "description", "label", "displayDate"] as const) {
    if (!parsed[key]) throw new Error(`${fileName}: missing ${key}`);
  }
  if (!Array.isArray(parsed.sections) || parsed.sections.length === 0) {
    throw new Error(`${fileName}: sections must not be empty`);
  }
  if (!parsed.disclaimer?.paragraphs?.length) {
    throw new Error(`${fileName}: disclaimer must not be empty`);
  }

  return parsed;
}

export function getDailyArticles(): DailyArticle[] {
  return readdirSync(dailyContentDir)
    .filter((fileName) => dailyFilePattern.test(fileName))
    .map(readDailyFile)
    .sort((left, right) => right.date.localeCompare(left.date));
}

export function getDailyArticle(slug: string): DailyArticle | undefined {
  return getDailyArticles().find((article) => article.slug === slug);
}

export function getDailyArticleMetadata(): ArticleSummary[] {
  return getDailyArticles().map((article) => ({
    kind: article.kind,
    date: article.date,
    dateTime: article.dateTime,
    title: article.title,
    excerpt: article.excerpt,
    href: `/articles/${article.slug}`,
  }));
}
