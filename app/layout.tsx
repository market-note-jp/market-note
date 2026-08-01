import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Market Note | 日米市場を、毎朝読む",
  description: "日本株・米国株・半導体・マクロを、公開情報に基づいて読み解く市場アーカイブ。",
  openGraph: {
    title: "Market Note | 日米市場を、毎朝読む",
    description: "日本株・米国株・半導体・マクロを、公開情報に基づいて読み解く市場アーカイブ。",
    images: [{ url: "/og.png", width: 1800, height: 940, alt: "Market Note" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Market Note | 日米市場を、毎朝読む",
    description: "日本株・米国株・半導体・マクロを、公開情報に基づいて読み解く市場アーカイブ。",
    images: ["/og.png"],
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
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
        {children}
      </body>
    </html>
  );
}
