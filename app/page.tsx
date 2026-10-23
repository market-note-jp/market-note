import Link from "next/link";
import ArticleArchive from "./article-archive";
import Image from "next/image";
import { ArrowDown, ArrowRight, ArrowUpRight } from "lucide-react";
import UpcomingEvents from "./upcoming-events";
import SectorGraphic from "./components/sector-graphic";
import { getDailyArticleMetadata } from "../lib/article-content";
import { withEditorialTitle } from "../lib/article-metadata";

const legacyArticles = [
{
  "kind": "週次レポート",
  "theme": "日米株・金融政策",
  "date": "2026-10-24 08:00",
  "dateTime": "2026-10-24T08:00:00+09:00",
  "title": "AI投資の資金調達に警戒、原油高と日米の政策会合へ｜10月19日〜23日",
  "excerpt": "2026年10月19日〜23日の日米株を、4指数の前週末比、SolidigmのIPO検討中止、ファナックの上方修正、原油・債券・円と翌週の金融政策から整理する。",
  "href": "/articles/weekly-2026-10-19"
},
{
  "kind": "企業レポート",
  "theme": "企業分析",
  "date": "2026-10-23 19:38",
  "dateTime": "2026-10-23T19:38:50+09:00",
  "title": "Bunzl：消耗品の卸売が生む現金と、買収・運営改善の実力を読む",
  "excerpt": "Bunzlの消耗品卸を、5年財務、北米の運営回復、関税返金、買収後の現金と資本効率から検証する。",
  "href": "/articles/company-bunzl-2026-10-23"
},
{
  "kind": "企業レポート",
  "theme": "企業分析",
  "date": "2026-10-23 19:38",
  "dateTime": "2026-10-23T19:38:50+09:00",
  "title": "ニフコの稼ぐ力は本物か：小型部品の強みと現金・還元の点検",
  "excerpt": "ニフコの5年業績、最新四半期、運転資金と成長投資を検証。税負担や欧州事業売却、韓国子会社の競争法問題を分け、利益と現金が持続する条件を考える。",
  "href": "/articles/company-nifco-2026-10-23"
},
{
  "kind": "企業レポート",
  "theme": "企業分析",
  "date": "2026-10-23 19:38",
  "dateTime": "2026-10-23T19:38:50+09:00",
  "title": "リンナイ：給湯器の高収益を、電化と海外投資の回収につなげられるか",
  "excerpt": "給湯器の交換需要と海外展開を、10年業績・最新四半期・現金収支・ROICで検証。電化投資の回収条件と品質費用、一時利益を切り分ける。",
  "href": "/articles/company-rinnai-2026-10-23"
},
{
  "kind": "テーマ解説",
  "theme": "市場テーマ",
  "date": "2026-10-23 19:38",
  "dateTime": "2026-10-23T19:38:50+09:00",
  "title": "Bloomの記録的売上は現金になったか。契約資産と前受金から読む成長の負担",
  "excerpt": "Bloomの最新決算から、利益と営業CFの差、契約資産の増加、前受金、設備投資と回収条件を検証する。",
  "href": "/articles/theme-bloom-revenue-cash-2026-10-23"
},
{
  "kind": "テーマ解説",
  "theme": "市場テーマ",
  "date": "2026-10-23 19:38",
  "dateTime": "2026-10-23T19:38:50+09:00",
  "title": "Metaの無議決権株は「即、希薄化」なのか。株式配当と将来の資金調達を分ける",
  "excerpt": "MetaのClass C新設を、比例配当・将来の新株発行・経済的持分・議決権の違いから読み解く。",
  "href": "/articles/theme-meta-class-c-dilution-2026-10-23"
},
{
  "kind": "企業レポート",
  "theme": "企業分析",
  "date": "2026-10-22 20:08",
  "dateTime": "2026-10-22T20:08:24.467+09:00",
  "title": "キッコーマン：しょうゆの成長は、設備投資後にも現金を残せるか",
  "excerpt": "しょうゆ製造と海外食品卸の二つの稼ぎ方を7年の業績・CFで検証。最新四半期の為替寄与、新工場の回収条件、資本効率と自己株買いの実績を分けて考える。",
  "href": "/articles/company-kikkoman-2026-10-22"
},
{
  "kind": "企業レポート",
  "theme": "企業分析",
  "date": "2026-10-22 20:08",
  "dateTime": "2026-10-22T20:08:24.467+09:00",
  "title": "栗田工業をどう見るか　水処理の反復収益と、装置採算・投資回収の条件",
  "excerpt": "水処理の継続収益を、装置採算・運転資金・買収撤退・分析事案から検証。5年業績と最新決算を、継続事業の組替えに注意して読む。",
  "href": "/articles/company-kurita-2026-10-22"
},
{
  "kind": "企業レポート",
  "theme": "企業分析",
  "date": "2026-10-22 20:08",
  "dateTime": "2026-10-22T20:08:24.467+09:00",
  "title": "Cintas：制服のレンタルが高収益になる理由と、大型買収で変わる資本配分",
  "excerpt": "Cintasの制服レンタル・職場サービスを、5年業績、配送網、契約資産、現金創出、資本効率と未完了のUniFirst買収から検証する。",
  "href": "/articles/company-cintas-2026-10-22"
},
{
  "kind": "テーマ解説",
  "theme": "市場テーマ",
  "date": "2026-10-22 20:08",
  "dateTime": "2026-10-22T20:08:24.467+09:00",
  "title": "輸出額が16.7%増えても、輸出企業の利益が同じように増えるとは限らない",
  "excerpt": "日本の9月輸出を数量・価格・地域・商品別に読み、円換算の増収と企業の利益・現金の改善を区別する。",
  "href": "/articles/theme-export-value-profit-2026-10-22"
},
{
  "kind": "テーマ解説",
  "theme": "市場テーマ",
  "date": "2026-10-22 20:08",
  "dateTime": "2026-10-22T20:08:24.467+09:00",
  "title": "訪日客が減っても消費は増える。インバウンド企業の利益を何で判断するか",
  "excerpt": "最新の訪日客数と旅行消費を同じ期間・対象で読み直し、国籍・費目・単価と企業利益の関係を検証する。",
  "href": "/articles/theme-inbound-spending-profit-2026-10-22"
},
{
  "kind": "企業レポート",
  "theme": "企業分析",
  "date": "2026-10-21 20:10",
  "dateTime": "2026-10-21T11:10:43.620Z",
  "title": "日東電工をどう読むか：高収益材料の強さと、円安を除いた成長の見極め",
  "excerpt": "日東電工の光学材料・テープ・ヒューマンライフを、長期財務、為替と数量、運転資本、設備投資、現金創出と成長の条件から検証する。",
  "href": "/articles/company-nitto-2026-10-21"
},
{
  "kind": "企業レポート",
  "theme": "企業分析",
  "date": "2026-10-21 20:10",
  "dateTime": "2026-10-21T11:10:43.620Z",
  "title": "SMC：厚い在庫は強みか重荷か。増益の中身と投資回収を読む",
  "excerpt": "SMCの空気圧制御機器を、10年財務、最新四半期の増益要因、在庫と設備投資、資本効率、競争と成長条件から読み解く。",
  "href": "/articles/company-smc-2026-10-21"
},
{
  "kind": "企業レポート",
  "theme": "企業分析",
  "date": "2026-10-21 20:10",
  "dateTime": "2026-10-21T11:10:43.620Z",
  "title": "Rollinsはなぜ現金を生めるのか。害虫駆除の反復需要と、集客減速に弱い利益構造",
  "excerpt": "Rollinsの害虫駆除サービスを、5年財務、反復需要、集客と訪問効率、買収後の現金、収益認識と資本効率から検証する。",
  "href": "/articles/company-rollins-2026-10-21"
},
{
  "kind": "テーマ解説",
  "theme": "市場テーマ",
  "date": "2026-10-21 20:10",
  "dateTime": "2026-10-21T11:10:43.620Z",
  "title": "利益率が改善しても、成長期待は上がるとは限らないのか",
  "excerpt": "Netflixの最新決算から、利益率の予想超過と成長期待を分けて検証。費用の時期ずれ、前年税務費用、広告見通しを整理する。",
  "href": "/articles/theme-profit-margin-growth-2026-10-21"
},
{
  "kind": "テーマ解説",
  "theme": "市場テーマ",
  "date": "2026-10-21 20:10",
  "dateTime": "2026-10-21T11:10:43.620Z",
  "title": "関税回収を含む上方修正は、持続的な増益と見てよいのか",
  "excerpt": "RTXの最新決算を使い、関税回収を含む上方修正が持続的な増益かを検証。事業別需要、調整後利益とGAAPの差、現金回収を確認する。",
  "href": "/articles/theme-tariff-recovery-earnings-2026-10-21"
},
{
  "kind": "企業レポート",
  "theme": "企業分析",
  "date": "2026-10-20 20:53",
  "dateTime": "2026-10-20T11:53:09.021Z",
  "title": "HOYA企業分析：高収益部材と眼科事業を、利益の質と現金から読み解く",
  "excerpt": "HOYAの眼科・視力補正事業と高収益部材を、5年実績、最新決算、運転資本、現金創出、設備投資、競争条件から検証する。",
  "href": "/articles/company-hoya-2026-10-20"
},
{
  "kind": "企業レポート",
  "theme": "企業分析",
  "date": "2026-10-20 20:53",
  "dateTime": "2026-10-20T11:53:09.021Z",
  "title": "USS（4732）企業研究：中古車の値上がりではなく、台数と手数料で稼ぐ市場の運営者",
  "excerpt": "USSの手数料モデル、10年間の業績、最新決算と上期台数、決済資金・設備投資・還元を検証。出品増と成約率低下を分けて、会社計画の達成条件を読む。",
  "href": "/articles/company-uss-2026-10-20"
},
{
  "kind": "企業レポート",
  "theme": "企業分析",
  "date": "2026-10-20 20:53",
  "dateTime": "2026-10-20T11:53:09.021Z",
  "title": "Fastenal（FAST）企業レポート：ねじを売る会社から「工場の中の流通網」へ",
  "excerpt": "Fastenalの工場内在庫・補充モデルを、2016–2025年財務、2026年第3四半期、Onsite・FMI、資本効率と競合比較から検証する。",
  "href": "/articles/company-fastenal-2026-10-20"
},
{
  "kind": "テーマ解説",
  "theme": "市場テーマ",
  "date": "2026-10-20 20:53",
  "dateTime": "2026-10-20T11:53:09.021Z",
  "title": "中国GDPの成長加速は、内需回復を意味するのか",
  "excerpt": "中国のGDP再加速を、家計所得と消費、サービス小売、投資、貿易の口径をそろえて検証。全面回復と呼べる条件と企業分析への含意を整理する。",
  "href": "/articles/china-gdp-domestic-demand-2026-10-20"
},
{
  "kind": "テーマ解説",
  "theme": "市場テーマ",
  "date": "2026-10-20 20:53",
  "dateTime": "2026-10-20T11:53:09.021Z",
  "title": "米新築住宅の値下げは、なぜ購入負担を十分に軽くできないのか",
  "excerpt": "米住宅業者の値下げと弱い来場はなぜ同時に起こるのか。住宅ローン返済額の条件付き試算、Lennarの採算、販売統計の誤差から検証する。",
  "href": "/articles/us-housing-affordability-2026-10-20"
},
{
  "kind": "企業レポート",
  "theme": "企業分析",
  "date": "2026-10-19 20:04",
  "dateTime": "2026-10-19T11:04:44.200Z",
  "title": "テルモ（4543）企業分析：医療現場の反復需要を、投資回収につなげられるか",
  "excerpt": "医療現場の反復需要と精密加工・量産品質を強みに成長するテルモ。9年の財務、事業別利益、キャッシュフロー、ROICを検証し、CSL契約終了と新規投資の回収条件を整理する。",
  "href": "/articles/corporate-terumo-2026-10-19"
},
{
  "kind": "企業レポート",
  "theme": "企業分析",
  "date": "2026-10-19 20:04",
  "dateTime": "2026-10-19T11:04:44.200Z",
  "title": "ダイフクの受注増をどう読むか：半導体向けの成長と、利益を現金に変える力",
  "excerpt": "半導体向け受注が伸びるダイフクを、10決算期の財務、最新上期、受注残、工事進捗の売上認識、運転資金、投資と還元から検証する。",
  "href": "/articles/corporate-daifuku-2026-10-19"
},
{
  "kind": "企業レポート",
  "theme": "企業分析",
  "date": "2026-10-19 20:04",
  "dateTime": "2026-10-19T11:04:44.200Z",
  "title": "ADPの継続収益をどう読むか：給与計算、預り資金、株主還元のつながり",
  "excerpt": "ADPの9年間の財務、2026年6月期と最新四半期、給与・人事の継続収益、顧客預り資金の運用、PEO費用、再投資後の現金と株主還元を一次資料から検討する。",
  "href": "/articles/corporate-adp-2026-10-19"
},
{
  "kind": "テーマ解説",
  "theme": "市場テーマ",
  "date": "2026-10-19 20:04",
  "dateTime": "2026-10-19T11:04:44.200Z",
  "title": "顧客が決まったAIデータセンターでも、なぜ売上が立たないのか――電力接続と契約の実行力",
  "excerpt": "Nscaleの英国Loughton契約撤退報道を入口に、顧客契約が売上になる条件を解説。電力接続、設備の引き渡し、前受金、接続待ち容量の読み方を一次資料で整理する。",
  "href": "/articles/theme-datacenter-grid-revenue-2026-10-19"
},
{
  "kind": "テーマ解説",
  "theme": "市場テーマ",
  "date": "2026-10-19 20:04",
  "dateTime": "2026-10-19T11:04:44.200Z",
  "title": "HBMが売れても、内製の強みは続くのか――カスタムメモリーの利益配分を読む",
  "excerpt": "NVIDIAのNVHBM公式説明から、HBMの設計・製造分担と利益配分を考える。Samsungの外注報道は未確認として区別し、内製率、出荷量、性能改善を採算へつなぐ条件を整理する。",
  "href": "/articles/theme-hbm-outsourcing-value-2026-10-19"
},
{
  "kind": "企業レポート",
  "theme": "企業分析",
  "date": "2026-10-18 21:57",
  "dateTime": "2026-10-18T12:57:17.380Z",
  "title": "オリックスの最高益をどう読むか：投資回収と運用収益の実力",
  "excerpt": "オリックスの10年間の利益とROE、最新四半期、キオクシア関連評価益、資本回収と配当を整理。運用収益を伸ばす戦略の条件とリスクを検証する。",
  "href": "/articles/corporate-orix-2026-10-18"
},
{
  "kind": "企業レポート",
  "theme": "企業分析",
  "date": "2026-10-18 21:57",
  "dateTime": "2026-10-18T12:57:17.380Z",
  "title": "シマノ：自転車の在庫調整の先に、利益率は戻るのか",
  "excerpt": "シマノの10年の業績と2026年中間決算を基に、自転車の在庫循環、釣具の回復、為替と利益率、設備投資後の現金と還元を検証する。",
  "href": "/articles/corporate-shimano-2026-10-18"
},
{
  "kind": "企業レポート",
  "theme": "企業分析",
  "date": "2026-10-18 21:57",
  "dateTime": "2026-10-18T12:57:17.380Z",
  "title": "Waste Management：ごみを運ぶ経路と処分場が生む利益、その現金をどこに使うか",
  "excerpt": "10年の財務と最新決算から、収集経路・処分場の競争力、Stericycle統合、設備投資後の現金、負債とRNG投資回収を検証する。",
  "href": "/articles/corporate-waste-management-2026-10-18"
},
{
  "kind": "テーマ解説",
  "theme": "市場テーマ",
  "date": "2026-10-18 21:57",
  "dateTime": "2026-10-18T12:57:17.380Z",
  "title": "TSMCは増収なのに、なぜ利益率が下がるのか――新工場と先端技術の立ち上げを読む",
  "excerpt": "TSMCの増収と前四半期比の利益率低下を、利益額・新技術の立ち上げ・設備投資後の現金に分けて検証する。",
  "href": "/articles/theme-tsmc-growth-margin-2026-10-18"
},
{
  "kind": "テーマ解説",
  "theme": "市場テーマ",
  "date": "2026-10-18 21:57",
  "dateTime": "2026-10-18T12:57:17.380Z",
  "title": "石油需要が減っているのに、なぜ原油高が続くのか",
  "excerpt": "IEAとEIAの最新見通しから、需要以上の供給減、在庫の置き場所、軽油不足、輸送費を分けて読む。日本への影響と高値が緩む条件を整理する。",
  "href": "/articles/theme-oil-demand-supply-2026-10-18"
},
  {
    "kind": "企業レポート",
    "theme": "企業分析",
    "date": "2026-10-17 21:56",
    "dateTime": "2026-10-17T12:56:44.158Z",
    "title": "任天堂の稼ぐ力を読む：ゲーム機の販売台数より、その後に何を買ってもらえるか",
    "excerpt": "10年の業績と現金化を起点に、世代交代期の利益構造、関税還付、ソフト集計の注意点、資本配分と現在の株価を読み解く。",
    "href": "/articles/corporate-nintendo-2026-10-17"
  },
  {
    "kind": "企業レポート",
    "theme": "企業分析",
    "date": "2026-10-17 21:56",
    "dateTime": "2026-10-17T12:56:44.158Z",
    "title": "MonotaRO：調達の手間を利益に変える会社、その成長を現金で確かめる",
    "excerpt": "間接資材の購買を効率化するMonotaROを、10年の業績、利益から現金への転換、大企業向けの利用浸透、物流投資の回収という観点で分析する。",
    "href": "/articles/corporate-monotaro-2026-10-17"
  },
  {
    "kind": "企業レポート",
    "theme": "企業分析",
    "date": "2026-10-17 21:56",
    "dateTime": "2026-10-17T12:56:44.158Z",
    "title": "Costco：会費だけでは説明できない、薄利と現金創出の強さ",
    "excerpt": "低価格、会員継続、在庫回転が支え合う小売モデルを、10年の財務と最新開示から検証する。成長の持続性は高く評価できる一方、会費の増加、ガソリン価格、仕入先条件による押上げを分けて読む必要がある。",
    "href": "/articles/corporate-costco-2026-10-17"
  },
  {
    "kind": "テーマ解説",
    "theme": "市場テーマ",
    "date": "2026-10-17 21:56",
    "dateTime": "2026-10-17T12:56:44.158Z",
    "title": "MicrosoftのAI投資はいつフリーキャッシュフローの増加につながるか",
    "excerpt": "Azureの成長とFCF減少を同じ期間で検証し、設備投資とリースの会計分類を区別して投資回収の確認条件を考える。",
    "href": "/articles/theme-microsoft-ai-cashflow-2026-10-17"
  },
  {
    "kind": "テーマ解説",
    "theme": "市場テーマ",
    "date": "2026-10-17 21:56",
    "dateTime": "2026-10-17T12:56:44.158Z",
    "title": "JPMorganの純金利収益13%増は利ざや改善の証拠か",
    "excerpt": "2026年7〜9月決算の純金利収益を市場部門と残高要因に分解し、前年との比較と前四半期からの利回り改善を区別する。",
    "href": "/articles/theme-jpmorgan-nii-margin-2026-10-17"
  },
  {
    kind: "週次レポート",
    date: "2026-10-10 08:00",
    dateTime: "2026-10-10T08:00:00+09:00",
    title: "日本株は上昇、米半導体株は反落――原油・金利とAI投資｜10月5日〜9日",
    excerpt: "日経平均+1.06%、ダウ+0.93%、NASDAQ総合+0.64%、SOX-4.30%。AI投資・原油・金利と翌週CPIを一次資料で整理。",
    href: "/articles/weekly-2026-10-05",
  },

  {
    "kind": "週次レポート",
    "date": "2026-09-12",
    "dateTime": "2026-09-12",
    "title": "原油急騰と利上げ観測、AI投資をどう読むか｜9月7日〜11日",
    "excerpt": "日本株・米国株・日経平均・ダウ平均・NASDAQ総合・SOX指数をまとめた週次マーケットニュースレポート。",
    "href": "/articles/weekly-2026-09-07"
  },
  {
    "kind": "週次レポート",
    "date": "2026-09-19",
    "dateTime": "2026-09-19",
    "title": "FRB・日銀の利上げと半導体株の底堅さ｜9月14日〜18日",
    "excerpt": "日本株・米国株・日経平均・ダウ平均・NASDAQ総合・SOX指数をまとめた週次マーケットニュースレポート。",
    "href": "/articles/weekly-2026-09-14"
  },
  {
    kind: "週次レポート",
    date: "2026-10-03 14:17",
    dateTime: "2026-10-03T14:17:00+09:00",
    title: "週次マーケットニュースレポート（2026年9月28日〜10月2日）",
    excerpt: "日経平均+2.93%、SOX+3.69%。米雇用、日銀短観、AI需要、金利・原油と翌週の焦点を出典付きで整理。",
    href: "/articles/weekly-2026-09-28",
  },
  {
    kind: "日次レポート",
    date: "2026-10-03 07:00",
    dateTime: "2026-10-03T07:00:00+09:00",
    title: "デイリー・マーケットブリーフィング（2026年10月3日）",
    excerpt: "米雇用統計と米国株終値、Broadcom・AnthropicのAI投資資金、日本株、日銀短観を整理。",
    href: "/articles/daily-2026-10-03",
  },
  {
    kind: "日次レポート",
    date: "2026-10-02 23:30",
    dateTime: "2026-10-02T23:30:00+09:00",
    title: "デイリー・マーケットブリーフィング（2026年10月2日）",
    excerpt: "米雇用の急減速、Broadcom・AnthropicのAI計算資金、日銀短観、日本株、ニデックを整理。",
    href: "/articles/daily-2026-10-02",
  },
  {
    kind: "日次レポート",
    date: "2026-09-25 07:00",
    dateTime: "2026-09-25T07:00:00+09:00",
    title: "デイリー・マーケットブリーフィング（2026年9月25日）",
    excerpt: "米国株、高金利とAI投資、SoftBankの大型調達、重要鉱物、日本の円・国債市場を整理。",
    href: "/articles/daily-2026-09-25",
  },
  {
    kind: "日次レポート",
    date: "2026-09-24 07:00",
    dateTime: "2026-09-24T07:00:00+09:00",
    title: "デイリー・マーケットブリーフィング（2026年9月24日）",
    excerpt: "米長期金利、米国株、SoftBankのAI投資調達、イットリウム供給、原油を整理。",
    href: "/articles/daily-2026-09-24",
  },
  {
    kind: "企業レポート",
    theme: "企業分析",
    date: "2026-09-23",
    dateTime: "2026-09-23",
    title: "キオクシアのPERは4.5倍？53倍？――実績と予想で変わる数字の読み方",
    excerpt: "前通期実績・直近12カ月・市場予想を区別し、AI需要、長期契約、設備投資と現金収支から利益の持続性を検証。",
    href: "/articles/kioxia-per-2026-09-23",
  },
  {
    kind: "日次レポート",
    date: "2026-09-23 07:00",
    dateTime: "2026-09-23T07:00:00+09:00",
    title: "デイリー・マーケットブリーフィング（2026年9月23日）",
    excerpt: "Alibaba新AIチップ、Meta MuseとNASDAQ最高値、原油100ドル割れ、FRB、日銀1.25%後の市場を整理。",
    href: "/articles/daily-2026-09-23",
  },
  {
    kind: "日次レポート",
    date: "2026-09-22 07:00",
    dateTime: "2026-09-22T07:00:00+09:00",
    title: "デイリー・マーケットブリーフィング（2026年9月22日）",
    excerpt: "AMDの1兆ドル突破、米国株最高値、SoftBankのOpenAI投資債、TSMC先端パッケージ、円157円台を整理。",
    href: "/articles/daily-2026-09-22",
  },
  {
    kind: "日次レポート",
    date: "2026-09-21 07:00",
    dateTime: "2026-09-21T07:00:00+09:00",
    title: "デイリー・マーケットブリーフィング（2026年9月21日）",
    excerpt: "CXMTのDRAM量産、米中AI・重要鉱物協議、FRB、中東情勢、日銀利上げ後の市場を整理。",
    href: "/articles/daily-2026-09-21",
  },
  {
    kind: "日次レポート",
    date: "2026-09-20 07:00",
    dateTime: "2026-09-20T07:00:00+09:00",
    title: "デイリー・マーケットブリーフィング（2026年9月20日）",
    excerpt: "CXMT、米中協議、中国LPR、FRB、中東情勢を整理。",
    href: "/articles/daily-2026-09-20",
  },
  {
    kind: "企業レポート",
    theme: "企業分析",
    date: "2026-09-22",
    dateTime: "2026-09-22",
    title: "ファナック（6954）企業レポート",
    excerpt: "FA・ロボットの競争力、11年間の業績、AI戦略、独自業績予測、PER・DCF評価とリスクを検証。",
    href: "/articles/corporate-fanuc-2026-09-22",
  },
  {
    kind: "日次レポート",
    date: "2026-09-19 07:00",
    dateTime: "2026-09-19T07:00:00+09:00",
    title: "デイリー・マーケットブリーフィング（2026年9月19日・週末版）",
    excerpt: "米国株と米長期金利、日銀1.25%利上げ、Solidigm・CXMTのメモリー投資、原油を整理。",
    href: "/articles/daily-2026-09-19",
  },
  {
    kind: "日次レポート",
    date: "2026-09-18 07:00",
    dateTime: "2026-09-18T07:00:00+09:00",
    title: "デイリー・マーケットブリーフィング（2026年9月18日）",
    excerpt: "米国株反発、GlobalFoundries・Marvell、AppleのAIサーバー構想、原油、日銀会合を整理。",
    href: "/articles/daily-2026-09-18",
  },
  {
    kind: "日次レポート",
    date: "2026-09-17 07:00",
    dateTime: "2026-09-17T07:00:00+09:00",
    title: "デイリー・マーケットブリーフィング（2026年9月17日）",
    excerpt: "FRB利上げ、米国株、SK Hynix・Intel、米小売売上高、日銀会合を整理。",
    href: "/articles/daily-2026-09-17",
  },
  {
    kind: "日次レポート",
    date: "2026-09-16 07:00",
    dateTime: "2026-09-16T07:00:00+09:00",
    title: "デイリー・マーケットブリーフィング（2026年9月16日）",
    excerpt: "米国株と長期金利、サウジ原油供給、MediaTek 2nm、AI安全性、FOMC・日銀を整理。",
    href: "/articles/daily-2026-09-16",
  },
  {
    kind: "日次レポート",
    date: "2026-09-15 07:00",
    dateTime: "2026-09-15T07:00:00+09:00",
    title: "デイリー・マーケットブリーフィング（2026年9月15日）",
    excerpt: "AI・半導体株急落、ASMLのEUV増産、キオクシア米上場検討、原油、FOMC・日銀を整理。",
    href: "/articles/daily-2026-09-15",
  },
  {
    kind: "日次レポート",
    date: "2026-09-14 07:00",
    dateTime: "2026-09-14T07:00:00+09:00",
    title: "デイリー・マーケットブリーフィング（2026年9月14日）",
    excerpt: "サウジ供給障害、AnthropicのIPO観測とAI安全性、円・日銀、FOMCを整理。",
    href: "/articles/daily-2026-09-14",
  },
  {
    kind: "日次レポート",
    date: "2026-09-13 07:00",
    dateTime: "2026-09-13T07:00:00+09:00",
    title: "デイリー・マーケットブリーフィング（2026年9月13日・週末版）",
    excerpt: "AI開発減速論、AnthropicのIPO、サウジ原油供給、円ポジション、FOMC・日銀を整理。",
    href: "/articles/daily-2026-09-13",
  },
  {
    kind: "日次レポート",
    date: "2026-09-12 07:00",
    dateTime: "2026-09-12T07:00:00+09:00",
    title: "デイリー・マーケットブリーフィング（2026年9月12日）",
    excerpt: "米CPIとFRB、米国株反発、日銀と企業物価、原油供給、キオクシアの米国ADS上場構想を整理。",
    href: "/articles/daily-2026-09-12",
  },
  {
    kind: "日次レポート",
    date: "2026-09-11 07:00",
    dateTime: "2026-09-11T07:00:00+09:00",
    title: "デイリー・マーケットブリーフィング（2026年9月11日）",
    excerpt: "米PPIと金利上昇、原油107ドル台、OracleのAIクラウド、NVIDIA推論基盤、日銀利上げ観測を整理。",
    href: "/articles/daily-2026-09-11",
  },
  {
    kind: "日次レポート",
    date: "2026-09-10 07:00",
    dateTime: "2026-09-10T07:00:00+09:00",
    title: "デイリー・マーケットブリーフィング（2026年9月10日）",
    excerpt: "原油100ドル突破、米国株、OpenAI・SamsungのAI半導体、日本の半導体需要、日銀・米インフレを整理。",
    href: "/articles/daily-2026-09-10",
  },
  {
    kind: "日次レポート",
    date: "2026-09-09 07:00",
    dateTime: "2026-09-09T07:00:00+09:00",
    title: "デイリー・マーケットブリーフィング（2026年9月9日）",
    excerpt: "米国株とAI選別、Qualcomm・AmazonのAI半導体、日本GDP・実質賃金と日銀、円、原油を整理。",
    href: "/articles/daily-2026-09-09",
  },
  {
    kind: "日次レポート",
    date: "2026-09-08 07:00",
    dateTime: "2026-09-08T07:00:00+09:00",
    title: "デイリー・マーケットブリーフィング（2026年9月8日）",
    excerpt: "日本のAI・半導体株高、円・日銀、外貨準備、WistronのAIサーバー投資、原油・米CPIを整理。",
    href: "/articles/daily-2026-09-08",
  },
  {
    kind: "日次レポート",
    date: "2026-09-07 07:00",
    dateTime: "2026-09-07T07:00:00+09:00",
    title: "デイリー・マーケットブリーフィング（2026年9月7日）",
    excerpt: "OPEC+、ホルムズ海峡、中国金融支援、AI投資、日銀と日本株を整理。",
    href: "/articles/daily-2026-09-07",
  },
  {
    kind: "日次レポート",
    date: "2026-09-06 07:00",
    dateTime: "2026-09-06T07:00:00+09:00",
    title: "デイリー・マーケットブリーフィング（2026年9月6日・週末版）",
    excerpt: "米雇用統計、FoxconnのAI需要、日本の個人消費、中国レアアース、米イラン緊張と原油を整理。",
    href: "/articles/daily-2026-09-06",
  },
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
  const articles = [...getDailyArticleMetadata(), ...legacyArticles.map(withEditorialTitle)];
  const orderedArticles = [...articles].sort((a, b) => b.date.localeCompare(a.date));
  const latest = orderedArticles[0];
  const recent = orderedArticles.slice(1, 6);
  // Keep the previous publishing day visible while an early daily report is live.
  // Before 07:00 JST the freshness contract still checks that previous report.
  const recentDaily = orderedArticles.filter((article) => article.kind === "日次レポート").slice(0, 2);
  for (const report of recentDaily) {
    if (report.href !== latest.href && !recent.some((article) => article.href === report.href)) {
      recent.push(report);
    }
  }
  const companies = orderedArticles.filter((article) => article.kind === "企業レポート").slice(0, 5);
  const assetPrefix = process.env.GITHUB_ACTIONS === "true" ? "/market-note" : "";

  return (
    <main className="site-shell">
      <section className="market-hero" aria-labelledby="home-title" id="main-content">
        <Image className="hero-photo" src={`${assetPrefix}/market-district-v1.webp`} alt="ガラス張りの高層ビルが並ぶビジネス街のイメージ" fill priority unoptimized sizes="100vw" />
        <div className="hero-shade" />
        <div className="hero-content">
          <p className="hero-eyebrow"><span /> JAPAN & US · MARKET RESEARCH</p>
          <h1 id="home-title">市場を読む。<br />企業を知る。</h1>
          <p className="hero-message">日々の市場から、企業の本質へ。<br />公開情報と出典でたどる、リサーチアーカイブ。</p>
          <div className="hero-actions"><Link className="hero-link" href={latest.href}>最新レポートを読む <ArrowUpRight size={20} aria-hidden="true" /></Link><a className="hero-secondary" href="#companies">企業分析へ <ArrowDown size={16} aria-hidden="true" /></a></div>
          <div className="hero-bottom"><span>MARKET NOTE</span><span>INDEPENDENT PERSPECTIVES</span></div>
        </div>
        <span className="hero-image-label">PERSPECTIVE / 01</span>
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
              <div className="story-meta"><span className="latest-tag">LATEST</span><span className="article-kind">{latest.kind}</span><time dateTime={latest.dateTime}>{latest.date}</time></div>
              <div className="lead-story-content"><div className="lead-date" aria-hidden="true"><span>{latest.date.slice(0, 4)} / {latest.date.slice(5, 7)}</span><strong>{latest.date.slice(8, 10)}</strong><span>DAILY RESEARCH</span></div><div><h3>{latest.title}</h3><p>{latest.excerpt}</p></div></div><span className="text-link">レポートを読む <ArrowUpRight size={19} aria-hidden="true" /></span>
            </Link></article>
            <div className="recent-stories">{recent.map((article) => <article key={article.href}><Link href={article.href}><time dateTime={article.dateTime}>{article.date.slice(5, 10).replace("-", ".")}</time><div><span className="article-kind">{article.kind}</span><h3>{article.title}</h3></div><ArrowUpRight size={17} aria-hidden="true" /></Link></article>)}</div>
          </div>
          <UpcomingEvents />
        </div>
      </section>

      <section className="companies-section" id="companies" aria-labelledby="companies-title"><div className="content-width">
        <div className="section-title-row"><div><p className="kicker">CORPORATE RESEARCH</p><h2 id="companies-title">企業を知る</h2></div><p>事業・競争力・財務の視点から</p></div>
        <div className="company-grid">{companies.map((article, index) => <article className="company-story" key={article.href}><Link href={article.href}>
          <SectorGraphic variant={article.href.includes("kanematsu") ? 3 : article.href.includes("ajinomoto") ? 2 : index} />
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
