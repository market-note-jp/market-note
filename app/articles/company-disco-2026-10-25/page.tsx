import ResearchArticle from "../../components/research-article";
import { createArticleMetadata } from "../../../lib/article-metadata";
import article from "./article.json";

export const metadata = createArticleMetadata({ ...article, publishedTime: article.publishedTime ?? undefined });
export default function Page() { return <ResearchArticle article={article} />; }
