import type { Metadata } from "next";
import editorialTitles from "../content/editorial-titles.json";

type TitleFields = { title?: string; headline?: string; description?: string; excerpt?: string; publishedTime?: string };

/** One title supplies the card, H1 and sharing/search metadata; legacy headline is a fallback. */
export function resolveArticleTitle(article: TitleFields): string {
  const title = article.title?.trim() || article.headline?.trim();
  if (!title) throw new Error("An article must have a non-empty title or legacy headline");
  return title;
}

export function createArticleMetadata(article: TitleFields): Metadata {
  const title = `${resolveArticleTitle(article)} | Market Note`;
  const description = article.description?.trim() || article.excerpt?.trim() || resolveArticleTitle(article);
  const image = "https://market-note-jp.github.io/market-note/og.png";
  return {
    title,
    description,
    openGraph: { type: "article", title, description, ...(article.publishedTime ? { publishedTime: article.publishedTime } : {}), images: [{ url: image, width: 1800, height: 940, alt: "Market Note" }] },
    twitter: { card: "summary_large_image", title, description, images: [image] },
  };
}

/** Static legacy routes can opt in without rewriting their URL, date, body or registry entry. */
export function withEditorialTitle<T extends { href: string; title: string }>(article: T): T {
  const slug = article.href.replace(/^\/articles\//, "").replace(/\/$/, "");
  const entry = (editorialTitles as Record<string, { title: string; description?: string }>)[slug];
  return entry ? { ...article, title: resolveArticleTitle(entry) } : article;
}
