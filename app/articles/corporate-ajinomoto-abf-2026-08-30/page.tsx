import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "味の素はなぜ半導体材料で世界シェア95％超なのか | Market Note",
  description:
    "味の素の半導体材料ABFについて、世界シェア、用途、儲けの仕組み、競争力、業界地図、最新業績、成長余地とリスクを整理。",
  openGraph: {
    title: "味の素はなぜ半導体材料で世界シェア95％超なのか | Market Note",
    description:
      "味の素の半導体材料ABFについて、世界シェア、儲けの仕組み、競争力、業界地図と最新業績を整理。",
    type: "article",
    publishedTime: "2026-08-30T00:00:00+09:00",
  },
  twitter: {
    card: "summary_large_image",
    title: "味の素はなぜ半導体材料で世界シェア95％超なのか | Market Note",
    description:
      "世界シェア95％超のABFについて、儲けの仕組み、競争力、業界構造と最新業績を整理。",
  },
};

const sources = {
  factBook:
    "https://www.ajinomoto.co.jp/company/jp/ir/library/factbook/main/00/teaserItems1/00/linkList/0/link/Factbook%202026_J.pdf",
  businessBriefing:
    "https://www.ajinomoto.co.jp/company/jp/ir/event/business_briefing/main/0111114/teaserItems1/01/linkList/02/link/20260630_presentation_J.pdf",
  firstQuarter:
    "https://www.ajinomoto.co.jp/company/jp/ir/event/presentation/main/011111114/teaserItems1/00/linkList/03/link/FY26Q1_Presentation_J.pdf",
  fullYear:
    "https://www.ajinomoto.co.jp/company/jp/ir/event/presentation/main/011111116/teaserItems1/00/linkList/03/link/FY25Q4_Presentation_J.pdf",
  innovation: "https://www.ajinomoto.co.jp/company/jp/rd/our_innovation/abf/",
  materiality: "https://www.ajinomoto.co.jp/company/jp/sustainability/materiality.html",
};

function SourceLink({ href, label }: { href: string; label: string }) {
  return <a href={href} target="_blank" rel="noreferrer">{label}</a>;
}

export default function AjinomotoAbfReport() {
  return (
    <main className="article-page">
      <Link className="back-link" href="/">← 記事一覧へ戻る</Link>

      <article>
        <header className="report-header">
          <p className="report-label">GLOBAL SHARE REPORT</p>
          <h1>味の素はなぜ半導体材料で世界シェア95％超なのか</h1>
          <p className="report-date">世界で強い日本企業 第1回／2026年8月30日</p>
        </header>

        <div className="report-body">
          <p className="disclaimer">
            本稿は公開情報に基づく企業・事業分析であり、特定の有価証券の売買を推奨するものではありません。世界シェアは味の素グループの公表値であり、第三者調査による推計ではありません。
          </p>

          <section>
            <h2>要点</h2>
            <p>
              食品メーカーとして知られる味の素は、高性能なCPUやGPUなどの半導体パッケージ基板に使われる層間絶縁材料「味の素ビルドアップフィルム（ABF）」を持つ。味の素グループの「Fact Book 2026」によると、ABFの世界シェアは95％以上で1位。2026年6月の事業説明会では、発売以来95％超のシェアを維持してきたと説明している。
            </p>
            <p>
              ただし、対象は半導体市場全体ではなく、ロジックIC向け半導体パッケージ基板の層間絶縁材料である。また、ABF単体の売上高と利益は開示されていない。シェアの高さだけでなく、対象市場と開示範囲を合わせて読む必要がある。
            </p>
            <p className="source-note">
              出典：<SourceLink href={sources.factBook} label="Ajinomoto Fact Book 2026" />、<SourceLink href={sources.businessBriefing} label="電子材料事業の成長戦略" />
            </p>
          </section>

          <section>
            <h2>1. まず押さえたい数字</h2>
            <div className="table-wrap">
              <table className="report-table">
                <thead><tr><th>項目</th><th>内容</th></tr></thead>
                <tbody>
                  <tr><td>製品</td><td>味の素ビルドアップフィルム（ABF）</td></tr>
                  <tr><td>用途</td><td>CPU、GPU、ASICなどの半導体パッケージ基板に使う層間絶縁材料</td></tr>
                  <tr><td>世界シェア</td><td>95％以上、世界1位（味の素グループ公表値）</td></tr>
                  <tr><td>発売</td><td>1999年</td></tr>
                  <tr><td>主な顧客</td><td>半導体パッケージ基板メーカー</td></tr>
                  <tr><td>主な需要先</td><td>PC、サーバー、ネットワーク機器、AI、ゲーム機など</td></tr>
                  <tr><td>直近の動き</td><td>2026年4～6月期のファンクショナルマテリアルズは、売上高が前年同期比154％、事業利益が177％</td></tr>
                </tbody>
              </table>
            </div>
            <p className="source-note">
              出典：<SourceLink href={sources.factBook} label="Ajinomoto Fact Book 2026" />、<SourceLink href={sources.firstQuarter} label="2027年3月期 第1四半期プレゼンテーション資料" />
            </p>
          </section>

          <section>
            <h2>2. ABFとは何か</h2>
            <p>
              半導体チップは、そのままではパソコンやサーバーの基板に接続できない。チップと外部の基板をつなぐ「半導体パッケージ基板」が必要になる。その基板の内部には細かな銅配線が何層にも重ねられており、配線同士が接触しないように絶縁する材料がABFである。
            </p>
            <p>
              ABFは単に電気を通さなければよいわけではない。微細な配線を形成しやすいこと、熱や湿気に耐えること、基板の反りを抑えることなど、高性能半導体の進化に合わせて複数の性能を両立する必要がある。味の素グループは、従来は液体だった絶縁材料をフィルム化し、1999年に発売した。
            </p>
            <p className="source-note">
              出典：<SourceLink href={sources.innovation} label="味の素ビルドアップフィルム（ABF）イノベーションストーリー" />、<SourceLink href={sources.businessBriefing} label="電子材料事業の成長戦略" />
            </p>
          </section>

          <section>
            <h2>3. 何で儲けているのか</h2>
            <p>
              ABFの事業は、完成済みの汎用品を広く販売するだけのビジネスではない。味の素ファインテクノは、顧客であるパッケージ基板メーカーの製品開発初期から入り、チップの用途に合わせて性能と価格を同時に設計する。顧客ごとに仕様を調整し、試作、評価、量産移行、技術支援までを一体で行う共同開発型のBtoBビジネスである。
            </p>
            <p>売上と利益を動かす主な要素は、次の3つと考えられる。</p>
            <ol>
              <li>CPU、GPU、ASICなど、高性能ロジックIC向けパッケージ基板の数量</li>
              <li>基板の大型化・多層化による、1基板当たりのABF使用量</li>
              <li>新開発品や高付加価値品の構成比</li>
            </ol>
            <p>
              AIサーバーでは複数の高性能半導体が使われ、パッケージ基板も大型化・多層化する。そのため、半導体の出荷個数だけでなく、1個のパッケージに使われるABFの量も増える構造がある。さらに、味の素グループは高付加価値品の比率上昇が利益率向上に寄与したと説明している。2026年3月期のファンクショナルマテリアルズ事業の事業利益率は50％を超えた。
            </p>
            <p>
              製造面では、味の素ファインテクノがABFの原料となるワニスの生産に特化し、フィルムへの塗工、裁断、保管の一部を外部委託している。配合や品質を左右する中核工程を自社で担いながら、外部企業も組み合わせて供給体制を構築している点も特徴である。
            </p>
            <p className="source-note">
              出典：<SourceLink href={sources.businessBriefing} label="電子材料事業の成長戦略" />、<SourceLink href={sources.fullYear} label="2027年3月期業績予想および企業価値向上に向けた取組み" />
            </p>
          </section>

          <section>
            <h2>4. なぜ世界シェア95％超を維持できるのか</h2>
            <h3>高速開発システム</h3>
            <p>
              研究員が顧客を直接担当し、社内に小ロット試作ラインや顧客と同等の評価設備を持つ。顧客の製造工程を自社内で再現し、材料の試作から量産化までの改善を速く回している。
            </p>
            <h3>バリューチェーン全体との関係</h3>
            <p>
              直接の顧客であるパッケージ基板メーカーだけでなく、原料メーカー、装置メーカー、薬液メーカー、半導体のエンドユーザーとも連携する。将来必要になる性能を早期に把握し、製品設計へ反映しやすい。
            </p>
            <h3>材料、加工条件、評価方法の蓄積</h3>
            <p>
              味の素グループは、ABFを前提とした基板設計が定着していると説明する。世界初のフィルム材料として積み上げた採用実績、品質保証、安定供給、顧客別の共同開発が組み合わさり、現在の高いシェアにつながっている。
            </p>
            <p className="source-note">
              出典：<SourceLink href={sources.businessBriefing} label="電子材料事業の成長戦略" />
            </p>
          </section>

          <section>
            <h2>5. 業界地図で見るABF</h2>
            <p>ABFの大まかな供給構造は次のようになる。</p>
            <div className="table-wrap">
              <table className="report-table">
                <thead><tr><th>段階</th><th>主な担い手と役割</th></tr></thead>
                <tbody>
                  <tr><td>1. 原材料</td><td>原料メーカーが樹脂などの材料を供給</td></tr>
                  <tr><td>2. 配合・ワニス生産</td><td>味の素ファインテクノが材料を配合し、ABF用ワニスを生産</td></tr>
                  <tr><td>3. 塗工・裁断</td><td>外部委託先がPETフィルムへの塗工や裁断を担当</td></tr>
                  <tr><td>4. パッケージ基板</td><td>基板メーカーがABFを用いて多層の回路基板を製造</td></tr>
                  <tr><td>5. 半導体</td><td>半導体メーカーやパッケージ工程でCPU、GPU、ASICなどを実装</td></tr>
                  <tr><td>6. 最終用途</td><td>PC、サーバー、ネットワーク機器、AI機器、ゲーム機などへ搭載</td></tr>
                </tbody>
              </table>
            </div>
            <p>
              味の素ファインテクノの直接の顧客は主にパッケージ基板メーカーだが、実際の開発ではその先にいる半導体メーカーや最終ユーザーの要求も重要になる。ABFは最終製品から見れば小さな材料だが、微細配線や信頼性を左右するため、半導体パッケージの性能を支える位置にある。なお、実際の商流や役割分担は製品・企業ごとに異なる。
            </p>
            <p className="source-note">
              出典：<SourceLink href={sources.businessBriefing} label="電子材料事業の成長戦略" />
            </p>
          </section>

          <section>
            <h2>6. 業績への貢献</h2>
            <p><strong>（単位：億円。味の素ファインテクノ単体のみ百万円）</strong></p>
            <div className="table-wrap">
              <table className="report-table">
                <thead><tr><th>2026年3月期</th><th>売上高</th><th>利益</th></tr></thead>
                <tbody>
                  <tr><td>味の素グループ全体</td><td>15,837億円</td><td>事業利益 1,811億円</td></tr>
                  <tr><td>ヘルスケア等セグメント</td><td>3,415億円</td><td>事業利益 662億円</td></tr>
                  <tr><td>味の素ファインテクノ単体</td><td>98,383百万円</td><td>営業利益 53,012百万円</td></tr>
                </tbody>
              </table>
            </div>
            <p>
              2026年4～6月期も、AI、サーバー、ネットワークなど高性能基板向けABFの販売が好調で、ファンクショナルマテリアルズの売上高は前年同期比154％、事業利益は177％となった。
            </p>
            <p>
              ただし、味の素ファインテクノ単体の数値、ファンクショナルマテリアルズ事業の数値、連結セグメントの数値はそれぞれ集計範囲が異なる。ABF単体の売上高と利益は開示されていないため、これらをABFだけの業績として扱うことはできない。
            </p>
            <p className="source-note">
              出典：<SourceLink href={sources.fullYear} label="2026年3月期決算・2027年3月期業績予想資料" />、<SourceLink href={sources.firstQuarter} label="2027年3月期 第1四半期プレゼンテーション資料" />
            </p>
          </section>

          <section>
            <h2>7. 今後の成長余地</h2>
            <p>
              成長の中心はAIとデータセンターである。生成AIの学習だけでなく、推論用途へ利用が広がれば、GPUに加えてCPUや用途別半導体であるASICの需要拡大も想定される。高性能半導体の増加と、パッケージ基板の大型化・多層化が同時に進めば、ABFの需要には数量と使用量の両面が効く。
            </p>
            <p>
              味の素グループは2025年に群馬工場の新設備を本格稼働させ、2023年から2030年までに250億円の投資枠を設定している。2030年以降を見据え、岐阜県可児市に川崎・群馬に次ぐ第三の生産拠点を設け、2032年の稼働を予定する。また、ABFで培った技術を接着材料、封止材料、磁性材料、光電融合向け材料などへ広げようとしている。
            </p>
            <p className="source-note">
              出典：<SourceLink href={sources.businessBriefing} label="電子材料事業の成長戦略" />
            </p>
          </section>

          <section>
            <h2>8. 確認しておきたいリスク</h2>
            <ul>
              <li><strong>半導体市況の変動：</strong>AI需要が強くても、PCやサーバーの在庫調整、設備投資の減速によって販売数量は変動する。</li>
              <li><strong>代替材料・競合技術：</strong>各国の調達先多元化や国産化、競合材料の性能向上により、採用率やシェアが低下する可能性がある。</li>
              <li><strong>生産と外部委託への依存：</strong>ワニス生産は川崎・群馬が中心で、塗工や保管には外部委託先も関わる。岐阜の新拠点は供給力向上に加えてBCPとリスク分散の役割を持つ。</li>
              <li><strong>技術世代の変化：</strong>光電融合や新しいパッケージ構造が普及した場合、ABF自体の継続的な性能向上と周辺材料への展開が必要になる。</li>
              <li><strong>開示範囲の限界：</strong>世界シェアは会社公表値で、算定対象、市場規模、調査方法の詳細は資料上で示されていない。ABF単体の売上高、利益、顧客構成も非開示である。</li>
            </ul>
            <p className="source-note">
              出典：<SourceLink href={sources.materiality} label="味の素グループ マテリアリティ" />、<SourceLink href={sources.businessBriefing} label="電子材料事業の成長戦略" />
            </p>
          </section>

          <section>
            <h2>9. この企業を追うときの観察点</h2>
            <p>
              味の素を食品会社としてだけ見ると、ABFの成長や高い利益率を見落としやすい。一方で、「世界シェア95％超」という数字だけで事業の強さを判断するのも十分ではない。今後は、ファンクショナルマテリアルズの売上成長と利益率、高付加価値品の構成、群馬・岐阜の増産計画、AI以外の用途拡大、次世代パッケージ材料の進捗を継続して確認したい。
            </p>
          </section>

          <section>
            <h2>10. 参照資料一覧</h2>
            <ol>
              <li><SourceLink href={sources.factBook} label="Ajinomoto Fact Book 2026（2026年7月公表）" /></li>
              <li><SourceLink href={sources.businessBriefing} label="電子材料事業の成長戦略 ― 味の素ファインテクノ社工場 バーチャル見学会 ―（2026年6月30日）" /></li>
              <li><SourceLink href={sources.firstQuarter} label="2027年3月期 第1四半期プレゼンテーション資料（2026年8月6日）" /></li>
              <li><SourceLink href={sources.fullYear} label="2027年3月期業績予想および企業価値向上に向けた取組み（2026年5月7日）" /></li>
              <li><SourceLink href={sources.innovation} label="味の素ビルドアップフィルム（ABF）イノベーションストーリー" /></li>
              <li><SourceLink href={sources.materiality} label="味の素グループ マテリアリティ" /></li>
            </ol>
            <h3>数値とシェアに関する注記</h3>
            <ul>
              <li>世界シェア95％以上は味の素グループの公表値であり、第三者調査による推計ではない。</li>
              <li>ファンクショナルマテリアルズ事業にはABF以外の機能性材料も含まれる。</li>
              <li>味の素ファインテクノ単体、ファンクショナルマテリアルズ事業、連結セグメントの数値は集計範囲が異なる。</li>
              <li>ABF単体の売上高、利益、顧客構成は開示されていない。</li>
            </ul>
          </section>

          <p className="disclaimer">
            本稿は企業と事業の理解を目的に、2026年8月30日時点の公開情報を整理したものです。特定の有価証券の取得、売却、保有を推奨するものではありません。投資判断はご自身の責任で行い、最新の決算資料、有価証券報告書、適時開示等をご確認ください。
          </p>
        </div>
      </article>
    </main>
  );
}
