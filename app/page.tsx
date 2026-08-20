import Link from "next/link";
import ArticleArchive from "./article-archive";

const articles = [
  {
    kind: "日次レポート",
    date: "2026-08-21 07:00",
    dateTime: "2026-08-21T07:00:00+09:00",
    title: "デイリー・マーケットブリーフィング（2026年8月21日）",
    excerpt: "米国株急落、米長期金利、日本の貿易統計とAI向け半導体輸出、全国CPI、AlibabaのAI投資、ホルムズ海峡と原油を整理。",
    href: "/articles/daily-2026-08-21",
  },
  {
    kind: "日次レポート",
    date: "2026-08-20 07:00",
    dateTime: "2026-08-20T07:00:00+09:00",
    title: "デイリー・マーケットブリーフィング（2026年8月20日）",
    excerpt: "米国株反発、FOMC議事要旨、米長期金利、MarvellとGoogleのカスタムAIチップ、ホルムズ海峡と原油を整理。",
    href: "/articles/daily-2026-08-20",
  },
  {
    kind: "日次レポート",
    date: "2026-08-19 07:00",
    dateTime: "2026-08-19T07:00:00+09:00",
    title: "デイリー・マーケットブリーフィング（2026年8月19日）",
    excerpt: "米半導体株急落、日米長期金利、ホルムズ海峡と原油、米製造業、FOMC議事要旨を整理。",
    href: "/articles/daily-2026-08-19",
  },
  {
    kind: "日次レポート",
    date: "2026-08-18 07:00",
    dateTime: "2026-08-18T07:00:00+09:00",
    title: "デイリー・マーケットブリーフィング（2026年8月18日）",
    excerpt: "日本GDPと長期金利、米国株と半導体、原油、中国景気、AI投資を整理。",
    href: "/articles/daily-2026-08-18",
  },
  {
    kind: "日次レポート",
    date: "2026-08-17 07:00",
    dateTime: "2026-08-17T07:00:00+09:00",
    title: "デイリー・マーケットブリーフィング（2026年8月17日）",
    excerpt: "日本GDP公表前、米小売売上、米国株、ホルムズ海峡、AI・半導体を整理。",
    href: "/articles/daily-2026-08-17",
  },
  {
    kind: "日次レポート",
    date: "2026-08-16 07:00",
    dateTime: "2026-08-16T07:00:00+09:00",
    title: "デイリー・マーケットブリーフィング（2026年8月16日・週末版）",
    excerpt: "ホルムズ海峡、米対イラン制裁、日本GDP、FRB議事要旨、AI・半導体を整理。",
    href: "/articles/daily-2026-08-16",
  },
  {
    kind: "日次レポート",
    date: "2026-08-15 07:00",
    dateTime: "2026-08-15T07:00:00+09:00",
    title: "デイリー・マーケットブリーフィング（2026年8月15日・週末版）",
    excerpt: "米小売売上、米国株、SMIC、ホルムズ海峡、円・日銀を整理。",
    href: "/articles/daily-2026-08-15",
  },
  {
    kind: "週次レポート",
    date: "2026-08-15 08:00",
    dateTime: "2026-08-15T08:00:00+09:00",
    title: "週次マーケットニュースレポート（2026年8月10日〜14日）",
    excerpt:
      "米CPI・PPI、小売売上高、日銀利上げ観測、原油、AI・半導体株をまとめた週次レポート。",
    href: "/articles/weekly-2026-08-10",
  },
  {
    kind: "日次レポート",
    date: "2026-08-14 07:00",
    dateTime: "2026-08-14T07:00:00+09:00",
    title: "デイリー・マーケットブリーフィング（2026年8月14日）",
    excerpt: "米PPI、米国株最高値、Applied Materials、日本株、原油とドル円を整理。",
    href: "/articles/daily-2026-08-14",
  },
  {
    kind: "日次レポート",
    date: "2026-08-13 07:00",
    dateTime: "2026-08-13T07:00:00+09:00",
    title: "デイリー・マーケットブリーフィング（2026年8月13日）",
    excerpt: "米CPI、米国株、Sony・TSMC、日本企業のAI活用、米PPIを整理。",
    href: "/articles/daily-2026-08-13",
  },
  {
    kind: "日次レポート",
    date: "2026-08-12 07:00",
    dateTime: "2026-08-12T07:00:00+09:00",
    title: "デイリー・マーケットブリーフィング（2026年8月12日）",
    excerpt: "米株続落、ホルムズ海峡と原油、米CPI、NVIDIAのAIインフラ金融、Sony・TSMCの大型JVを整理。",
    href: "/articles/daily-2026-08-12",
  },
  {
    kind: "日次レポート",
    date: "2026-08-11 07:00",
    dateTime: "2026-08-11T07:00:00+09:00",
    title: "デイリー・マーケットブリーフィング（2026年8月11日）",
    excerpt: "米株小反落、ホルムズ海峡と原油急騰、ドル円、米CPI、AI・半導体決算を整理。",
    href: "/articles/daily-2026-08-11",
  },
  {
    kind: "日次レポート",
    date: "2026-08-10 07:00",
    dateTime: "2026-08-10T07:00:00+09:00",
    title: "デイリー・マーケットブリーフィング（2026年8月10日）",
    excerpt: "米株最高値と弱い雇用、米CPI、AI企業業績、キオクシア、ホルムズ海峡と原油を整理。",
    href: "/articles/daily-2026-08-10",
  },
  {
    kind: "日次レポート",
    date: "2026-08-09 07:00",
    dateTime: "2026-08-09T07:00:00+09:00",
    title: "デイリー・マーケットブリーフィング（2026年8月9日・週末版）",
    excerpt: "弱い米雇用と最高値更新、米CPI、AI・半導体、日本企業決算、ホルムズ海峡と原油を整理。",
    href: "/articles/daily-2026-08-09",
  },
  {
    kind: "決算記事",
    theme: "決算",
    date: "2026-08-08 18:15",
    dateTime: "2026-08-08T18:15:00+09:00",
    title: "8月3日〜7日決算総まとめ　AI・データセンター関連に相次ぐ上方修正、好決算でも売られる銘柄も",
    excerpt: "AI・データセンター需要の広がりと、主要企業の上方修正、決算後の株価反応をテーマ別に整理。",
    href: "/articles/earnings-2026-08-03-07",
  },
  {
    kind: "日次レポート",
    date: "2026-08-08 07:00",
    dateTime: "2026-08-08T07:00:00+09:00",
    title: "デイリー・マーケットブリーフィング（2026年8月8日・週末版）",
    excerpt: "米雇用の弱さと最高値更新、AMDのAI需要、ソフトバンクG決算、原油・インフレを整理。",
    href: "/articles/daily-2026-08-08",
  },
  {
    kind: "週次レポート",
    date: "2026-08-08 08:00",
    dateTime: "2026-08-08T08:00:00+09:00",
    title: "週次マーケットニュースレポート（2026年8月3日〜7日）",
    excerpt: "原油安、米雇用統計、金利・円相場、テック・半導体株の反発をまとめた週次レポート。",
    href: "/articles/weekly-2026-08-03",
  },
  {
    kind: "日次レポート",
    date: "2026-08-07 07:00",
    dateTime: "2026-08-07T07:00:00+09:00",
    title: "デイリー・マーケットブリーフィング（2026年8月7日）",
    excerpt: "原油高、米国株の小幅安、ソフトバンクG決算、日経平均、米雇用統計を整理。",
    href: "/articles/daily-2026-08-07",
  },
  {
    kind: "日次レポート",
    date: "2026-08-06 07:00",
    dateTime: "2026-08-06T07:00:00+09:00",
    title: "デイリー・マーケットブリーフィング（2026年8月6日）",
    excerpt: "米国株の選別、NVIDIAとAMD、日経平均、ソフトバンクG決算予定、原油・雇用を整理。",
    href: "/articles/daily-2026-08-06",
  },
  {
    kind: "日次レポート",
    date: "2026-08-05 07:00",
    dateTime: "2026-08-05T07:00:00+09:00",
    title: "デイリー・マーケットブリーフィング（2026年8月5日）",
    excerpt: "米国株の最高値、AMDとPalantir、半導体、原油・金利、米求人を整理。",
    href: "/articles/daily-2026-08-05",
  },
  {
    kind: "日次レポート",
    date: "2026-08-04 08:00",
    dateTime: "2026-08-04T08:00:00+09:00",
    title: "デイリー・マーケットブリーフィング（2026年8月4日）",
    excerpt: "原油安を受けた米株高、Palantir決算、日本株・円相場、米製造業、半導体株の選別を整理。",
    href: "/articles/daily-2026-08-04",
  },
  {
    kind: "日次レポート",
    date: "2026-08-01 08:00",
    dateTime: "2026-08-01T08:00:00+09:00",
    title: "デイリー・マーケットブリーフィング（2026年8月1日・週末版）",
    excerpt: "AmazonとMicrosoftの決算、半導体株の調整、Sony、日銀、円相場と原油をまとめたデイリーブリーフィング。",
    href: "/articles/daily-2026-08-01",
  },
  {
    kind: "週次レポート",
    date: "2026-08-01 08:00",
    dateTime: "2026-08-01T08:00:00+09:00",
    title: "週次マーケットニュースレポート（2026年7月27日〜31日）",
    excerpt: "大型テック決算、日銀、原油・インフレ、AI・半導体株の調整をまとめた週次レポート。",
    href: "/articles/weekly-2026-07-27",
  },
];

export default function Home() {
  return (
    <main className="site-shell">
      <header className="site-header">
        <Link className="brand" href="/">
          <span className="brand-mark">M</span>
          <span>MARKET NOTE<small>日本株・米国株のニュースレポート</small></span>
        </Link>
        <nav aria-label="メインナビゲーション"><a href="#articles">記事一覧</a><a href="#policy">このサイトについて</a></nav>
      </header>
      <section className="intro"><p className="kicker">MARKET REPORT ARCHIVE</p><h1>市場をあとから読み返せる形に。</h1><p>毎日・毎週のマーケットレポートを、公開情報と出典リンクを添えて全文保存。</p></section>
      <section className="articles" id="articles" aria-labelledby="articles-title">
        <div className="section-title-row"><div><p className="kicker">ARTICLES</p><h2 id="articles-title">記事一覧</h2></div><p>{articles.length}件</p></div>
        <ArticleArchive articles={articles} />
      </section>
      <section className="policy" id="policy"><p className="kicker">EDITORIAL POLICY</p><h2>レポート本文を省略せず保存します。</h2><p>日次・週次レポートの章立て、表、箇条書き、出典リンク、注意書きを保ったまま記事として公開します。噂や未確認情報を避け、断定を控えた市場概況として蓄積します。</p></section>
      <footer><span>MARKET NOTE</span><span>Public market research archive / Not investment advice.</span></footer>
    </main>
  );
}
