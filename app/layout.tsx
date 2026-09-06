import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SiteFooter, SiteHeader } from "./site-chrome";

const isGitHubPages = process.env.GITHUB_ACTIONS === "true";
const siteUrl = isGitHubPages
  ? "https://market-note-jp.github.io/market-note/"
  : "https://market-note-jp.ktsht.chatgpt.site/";
const faviconUrl = isGitHubPages ? "/market-note/favicon.svg" : "/favicon.svg";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Market Note | 市場レポート・企業分析",
  description: "日本株・米国株・半導体・マクロ・企業分析を、公開情報と出典リンク付きで全文保存するリサーチアーカイブ。",
  openGraph: {
    title: "Market Note | 市場レポート・企業分析",
    description: "日本株・米国株・半導体・マクロ・企業分析を、公開情報と出典リンク付きで全文保存するリサーチアーカイブ。",
    images: [{ url: "/og.png", width: 1800, height: 940, alt: "Market Note" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Market Note | 市場レポート・企業分析",
    description: "日本株・米国株・半導体・マクロ・企業分析を、公開情報と出典リンク付きで全文保存するリサーチアーカイブ。",
    images: ["/og.png"],
  },
  icons: {
    icon: faviconUrl,
    shortcut: faviconUrl,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
