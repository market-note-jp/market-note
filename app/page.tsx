import Link from "next/link";
import ArticleArchive from "./article-archive";
import Image from "next/image";
import { ArrowDown, ArrowRight, ArrowUpRight, CalendarDays } from "lucide-react";
import { marketCalendarEvents, marketCalendarReviewedAt } from "./market-calendar-data";

const articles = [
  {
    kind: "週次レポート",
    date: "2026-09-05 08:00",
    dateTime: "2026-09-05T08:00:00+09:00",
    title: "週次マーケットニュースレポート（2026年8月31日〜9月4日）",
    excerpt: "世界的な金利上昇、米雇用統計、原油高、日銀利上げ観測、AI・半導体株をまとめた週次レポート。",
    href: "/articles/weekly-2026-08-31",
  },
  {
    kind: "日次レポート",
    date: "2026-09-05 07:00",
    dateTime: "2026-09-05T07:00:00+09:00",
    title: "デイリー・マーケットブリーフィング（2026年9月5日・週末版）",
    excerpt: "米雇用統計、米国株・半導体、米中AI安全協議、日本の財政・AI半導体投資、原油・ホルムズ海峡を整理。",
    href: "/articles/daily-2026-09-05",
  },
  {
    kind: "日次レポート",
    date: "2026-09-04 07:00",
    dateTime: "2026-09-04T07:00:00+09:00",
    title: "デイリー・マーケットブリーフィング（2026年9月4日）",
    excerpt: "米国株、FRB、NVIDIA・Hugging Face、円・日銀、原油、米雇用統計を整理。",
    href: "/articles/daily-2026-09-04",
  },
  {
    kind: "日次レポート",
    date: "2026-09-03 07:00",
    dateTime: "2026-09-03T07:00:00+09:00",
    title: "デイリー・マーケットブリーフィング（2026年9月3日）",
    excerpt: "米国株、Broadcom決算、日銀と円相場、米雇用、ホルムズ海峡と原油を整理。",
    href: "/articles/daily-2026-09-03",
  },
  {
    kind: "日次レポート",
    date: "2026-09-02 07:00",
    dateTime: "2026-09-02T07:00:00+09:00",
    title: "デイリー・マーケットブリーフィング（2026年9月2日）",
    excerpt: "米国株、日米長期金利、原油・ホルムズ海峡、AI規制、東京データセンター投資を整理。",
    href: "/articles/daily-2026-09-02",
  },
  {
    kind: "日次レポート",
    date: "2026-09-01 07:00",
    dateTime: "2026-09-01T07:00:00+09:00",
    title: "デイリー・マーケットブリーフィング（2026年9月1日）",
    excerpt: "米国株、原油、NVIDIA・MediaTek、円・日銀、AIと金融安定を整理。",
    href: "/articles/daily-2026-09-01",
  },
  {
    kind: "日次レポート",
    date: "2026-08-31 07:00",
    dateTime: "2026-08-31T07:00:00+09:00",
    title: "デイリー・マーケットブリーフィング（2026年8月31日）",
    excerpt: "円・日銀、米金融政策、原油・SPR、AI半導体、日本のAI投資を整理。",
    href: "/articles/daily-2026-08-31",
  },
  {
    kind: "日次レポート",
    date: "2026-08-30 07:00",
    dateTime: "2026-08-30T07:00:00+09:00",
    title: "デイリー・マーケットブリーフィング（2026年8月30日・週末版）",
    excerpt: "米国株、NVIDIA、AI投資、米PCE、キオクシア、原油を整理。",
    href: "/articles/daily-2026-08-30",
  },
  {
    kind: "日次レポート",
    date: "2026-08-29 07:00",
    dateTime: "2026-08-29T07:00:00+09:00",
    title: "デイリー・マーケットブリーフィング（2026年8月29日・週末版）",
    excerpt: "米国株、FRB、NVIDIA、米PCE、キオクシア・Sandisk、原油を整理。",
    href: "/articles/daily-2026-08-29",
  },
  {
    kind: "企業レポート",
    theme: "企業分析",
    date: "2026-08-30",
    dateTime: "2026-08-30",
    title: "兼松（8020）企業レポート",
    excerpt: "事業構造、セグメント収益、過去10年間の業績、資本効率、成長要因、リスクと最新四半期を整理。",
    href: "/articles/corporate-kanematsu-2026-08-30",
  },
  {
    kind: "企業レポート",
    theme: "世界シェア",
    date: "2026-08-30",
    dateTime: "2026-08-30",
    title: "味の素はなぜ半導体材料で世界シェア95％超なのか",
    excerpt: "半導体材料ABFの用途、儲けの仕組み、競争力、業界地図、最新業績とリスクを整理。",
    href: "/articles/corporate-ajinomoto-abf-2026-08-30",
  },
  {
    kind: "週次レポート",
    date: "2026-08-29 08:00",
    dateTime: "2026-08-29T08:00:00+09:00",
    title: "週次マーケットニュースレポート（2026年8月24日〜28日）",
    excerpt: "NVIDIA決算、Jackson Hole、米PCE、日銀利上げ観測、円・原油をまとめた週次レポート。",
    href: "/articles/weekly-2026-08-24",
  },
  {
    kind: "日次レポート",
    date: "2026-08-28 07:00",
    dateTime: "2026-08-28T07:00:00+09:00",
    title: "デイリー・マーケットブリーフィング（2026年8月28日）",
    excerpt: "NVIDIA決算後のAI・半導体株高、米PCE、FRB、ホルムズ海峡と原油、日本のエネルギー政策を整理。",
    href: "/articles/daily-2026-08-28",
  },
  {
    kind: "日次レポート",
    date: "2026-08-27 07:00",
    dateTime: "2026-08-27T07:00:00+09:00",
    title: "デイリー・マーケットブリーフィング（2026年8月27日）",
    excerpt: "NVIDIA決算、AWSの追加GPU、米PCE・GDP、ホルムズ海峡、日本のエネルギー政策を整理。",
    href: "/articles/daily-2026-08-27",
  },
  {
    kind: "日次レポート",
    date: "2026-08-26 07:00",
    dateTime: "2026-08-26T07:00:00+09:00",
    title: "デイリー・マーケットブリーフィング（2026年8月26日）",
    excerpt: "米テック株反発、日経平均、NVIDIA決算前、米長期金利、原油、米PCE・GDPを整理。",
    href: "/articles/daily-2026-08-26",
  },
  {
    kind: "日次レポート",
    date: "2026-08-25 07:00",
    dateTime: "2026-08-25T07:00:00+09:00",
    title: "デイリー・マーケットブリーフィング（2026年8月25日）",
    excerpt: "米テック・半導体株安、日経平均、NVIDIA決算、AIデータセンター規制、原油・米PCEを整理。",
    href: "/articles/daily-2026-08-25",
  },
  {
    kind: "日次レポート",
    date: "2026-08-24 07:00",
    dateTime: "2026-08-24T07:00:00+09:00",
    title: "デイリー・マーケットブリーフィング（2026年8月24日）",
    excerpt: "週明け日本株、NVIDIA決算、AIサーバー価格上昇報道、日本の長期金利・財政、原油・米PCEを整理。",
    href: "/articles/daily-2026-08-24",
  },
  {
    kind: "日次レポート",
    date: "2026-08-23 07:00",
    dateTime: "2026-08-23T07:00:00+09:00",
    title: "デイリー・マーケットブリーフィング（2026年8月23日・週末版）",
    excerpt: "NVIDIA決算前のAI・半導体、AIサーバー価格上昇報道、米国株と長期金利、日本株、原油を整理。",
    href: "/articles/daily-2026-08-23",
  },
  {
    kind: "企業レポート",
    theme: "企業分析",
    date: "2026-08-23",
    dateTime: "2026-08-23",
    title: "サンリオ（8136）企業レポート",
    excerpt: "事業構造、11年間の業績推移、地域別利益、資本効率、成長要因、リスクと最新四半期を整理。",
    href: "/articles/corporate-sanrio-2026-08-23",
  },
  {
    kind: "週次レポート",
    date: "2026-08-22 08:00",
    dateTime: "2026-08-22T08:00:00+09:00",
    title: "週次マーケットニュースレポート（2026年8月17日〜21日）",
    excerpt: "世界的な長期金利上昇、原油高、AI・半導体株の調整、日本GDP・CPIをまとめた週次レポート。",
    href: "/articles/weekly-2026-08-17",
  },
  {
    kind: "日次レポート",
    date: "2026-08-22 07:00",
    dateTime: "2026-08-22T07:00:00+09:00",
    title: "デイリー・マーケットブリーフィング（2026年8月22日・週末版）",
    excerpt: "米国株反発、日本7月CPI、NVIDIA決算前のAI・半導体、米長期金利、ホルムズ海峡と原油を整理。",
    href: "/articles/daily-2026-08-22",
  },
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
    excerpt: "米CPI・PPI、小売売上高、日銀利上げ観測、原油、AI・半導体株をまとめた週次レポート。",
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
  const orderedArticles = [...articles].sort((a, b) => b.date.localeCompare(a.date));
  const latest = orderedArticles[0];
  const recent = orderedArticles.slice(1, 4);
  const companies = orderedArticles.filter((article) => article.kind === "企業レポート");
  const upcoming = [...marketCalendarEvents]
    .filter((event) => event.date >= marketCalendarReviewedAt)
    .sort((a, b) => `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`))
    .slice(0, 5);
  const assetPrefix = process.env.GITHUB_ACTIONS === "true" ? "/market-note" : "";

  return (
    <main className="site-shell">
      <section className="market-hero" aria-labelledby="home-title">
        <Image className="hero-photo" src={`${assetPrefix}/market-district-v1.webp`} alt="ガラス張りの高層ビルが並ぶビジネス街のイメージ" fill priority unoptimized sizes="100vw" />
        <div className="hero-shade" />
        <div className="hero-content">
          <p className="hero-eyebrow">JAPAN & US / INDEPENDENT RESEARCH</p>
          <h1 id="home-title">MARKET NOTE</h1>
          <p className="hero-message">市場を読む。企業を知る。</p>
          <a className="hero-link" href="#latest">最新レポート <ArrowDown size={18} aria-hidden="true" /></a>
        </div>
        <span className="hero-caption">都市のビジネス街 / AI生成イメージ</span>
      </section>

      <div className="edition-bar"><div className="content-width">
        <span><span className="edition-label">LATEST UPDATE</span><time dateTime={latest.dateTime}>{latest.date}</time> JST</span>
        <span>日本株 / 米国株 / 企業分析</span>
      </div></div>

      <section className="latest-section content-width" id="latest" aria-labelledby="latest-title">
        <div className="section-title-row"><div><p className="kicker">LATEST INSIGHTS</p><h2 id="latest-title">最新レポート</h2></div><a className="text-link" href="#articles">一覧へ <ArrowRight size={18} aria-hidden="true" /></a></div>
        <div className="news-calendar-layout">
          <div className="latest-news">
            <article className="lead-story"><Link href={latest.href}>
              <div className="story-meta"><span className="article-kind">{latest.kind}</span><time dateTime={latest.dateTime}>{latest.date}</time></div>
              <h3>{latest.title}</h3><p>{latest.excerpt}</p><span className="text-link">レポートを読む <ArrowUpRight size={19} aria-hidden="true" /></span>
            </Link></article>
            <div className="recent-stories">{recent.map((article) => <article key={article.href}><Link href={article.href}><time dateTime={article.dateTime}>{article.date.slice(5, 10).replace("-", ".")}</time><div><span className="article-kind">{article.kind}</span><h3>{article.title}</h3></div><ArrowUpRight size={17} aria-hidden="true" /></Link></article>)}</div>
          </div>
          <aside className="upcoming-panel" aria-labelledby="upcoming-title">
            <div className="upcoming-heading"><CalendarDays size={22} aria-hidden="true" /><div><p className="kicker">UPCOMING</p><h3 id="upcoming-title">直近の予定</h3></div></div>
            <p className="schedule-asof">{marketCalendarReviewedAt} 更新 / 時刻は日本時間</p>
            <ol className="upcoming-list">{upcoming.map((event) => <li key={event.id}><a href={event.sourceUrl} target="_blank" rel="noreferrer">
              <time dateTime={event.date}><strong>{Number(event.date.slice(5, 7))}/{Number(event.date.slice(8, 10))}</strong><span>{event.time}</span></time>
              <div><span className={`event-type event-type-${event.category}`}>{event.category} / {event.region}</span><h4>{event.title}</h4></div>
              <ArrowUpRight size={15} aria-hidden="true" />
            </a></li>)}</ol>
            <Link className="calendar-all-link" href="/calendar">市場カレンダー <ArrowRight size={18} aria-hidden="true" /></Link>
          </aside>
        </div>
      </section>

      <section className="companies-section" id="companies" aria-labelledby="companies-title"><div className="content-width">
        <div className="section-title-row"><div><p className="kicker">CORPORATE RESEARCH</p><h2 id="companies-title">企業を知る</h2></div><p>事業・競争力・財務の視点から</p></div>
        <div className="company-grid">{companies.map((article, index) => <article className="company-story" key={article.href}><Link href={article.href}>
          <div className="company-topline"><span>{String(index + 1).padStart(2, "0")}</span><span>{article.theme}</span><ArrowUpRight size={21} aria-hidden="true" /></div>
          <h3>{article.title}</h3><p>{article.excerpt}</p><time dateTime={article.dateTime}>{article.date}</time>
        </Link></article>)}</div>
      </div></section>

      <section className="articles" id="articles" aria-labelledby="articles-title">
        <div className="section-title-row"><div><p className="kicker">REPORT LIBRARY</p><h2 id="articles-title">すべてのレポート</h2></div><p>{articles.length}件</p></div>
        <ArticleArchive articles={orderedArticles} />
      </section>
      <section className="policy" id="policy"><div><p className="kicker">OUR APPROACH</p><h2>情報の先にある、<br />事業を見つめる。</h2></div><div><p>Market Noteは、日本と米国の市場動向、企業の事業構造と財務を読み解くリサーチアーカイブです。</p><p>公表資料と出典を大切に、日々の変化と長期的な企業の姿を記録します。記事は公開日を付けて保存し、過去の情報も読み返せる形で残します。</p><span className="policy-label">PUBLIC SOURCES. LASTING PERSPECTIVES.</span></div></section>
    </main>
  );
}
