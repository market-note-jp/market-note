import Link from "next/link";
import type { ReactNode } from "react";
import "./research-article.css";

export type ResearchArticleData = {
  title: string;
  description: string;
  informationCutoff: string;
  publishedTime: string | null;
  markdown: string;
};

function inline(value: string): ReactNode[] {
  const pattern = /\[([^\]]+)\]\((https:\/\/[^\s)]+)\)|\*\*([^*]+)\*\*/g;
  const result: ReactNode[] = [];
  let end = 0;
  for (const match of value.matchAll(pattern)) {
    result.push(value.slice(end, match.index));
    result.push(match[1]
      ? <a key={match.index} href={match[2]} target="_blank" rel="noreferrer">{match[1]}</a>
      : <strong key={match.index}>{match[3]}</strong>);
    end = match.index! + match[0].length;
  }
  result.push(value.slice(end));
  return result;
}

function blocks(markdown: string) {
  return markdown.trim().split(/\n\s*\n/).map((block, index) => {
    if (block === "---") return <hr key={index} />;
    if (block.startsWith("## ")) return <h2 key={index}>{block.slice(3)}</h2>;
    if (block.startsWith("### ")) return <h3 key={index}>{block.slice(4)}</h3>;
    if (block.startsWith("|")) {
      const rows = block.split("\n").map(line => line.trim().slice(1, -1).split("|").map(cell => cell.trim()));
      return <div className="table-wrap" role="region" aria-label="記事のデータ表（横にスクロールできます）" tabIndex={0} key={index}><table><thead><tr>{rows[0].map((cell, i) => <th key={i}>{inline(cell)}</th>)}</tr></thead><tbody>{rows.slice(2).map((row, i) => <tr key={i}>{row.map((cell, j) => <td key={j}>{inline(cell)}</td>)}</tr>)}</tbody></table></div>;
    }
    if (/^\d+\. /.test(block)) return <ol key={index}>{block.split("\n").map((item, i) => <li key={i}>{inline(item.replace(/^\d+\. /, ""))}</li>)}</ol>;
    if (block.startsWith("- ")) return <ul key={index}>{block.split("\n").map((item, i) => <li key={i}>{inline(item.slice(2))}</li>)}</ul>;
    return <p key={index}>{inline(block)}</p>;
  });
}

export default function ResearchArticle({ article }: { article: ResearchArticleData }) {
  const body = article.markdown.split(/\n\s*\n/).slice(1).join("\n\n");
  const publication = article.publishedTime
    ? new Intl.DateTimeFormat("ja-JP", { timeZone: "Asia/Tokyo", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" }).format(new Date(article.publishedTime)) + " JST"
    : "公開準備中";
  return <main className="article-page editorial-article" id="main-content"><Link className="back-link" href="/">MARKET NOTE / レポート</Link><article>
    <header className="report-header"><p className="report-label">MARKET NOTE RESEARCH</p><h1>{article.title}</h1><p className="report-deck">{article.description}</p><p className="report-date">公開日時：{article.publishedTime ? <time dateTime={article.publishedTime}>{publication}</time> : publication}</p><p>情報基準日：{article.informationCutoff}（公開日とは異なります）</p></header>
    <div className="report-body research-article-body">{blocks(body)}</div>
  </article></main>;
}
