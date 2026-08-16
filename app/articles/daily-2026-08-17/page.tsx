import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "デイリー・マーケットブリーフィング（2026年8月17日） | Market Note",
  description: "日本GDP公表前、米小売売上、米国株、ホルムズ海峡、AI・半導体を整理した2026年8月17日のマーケットブリーフィング。",
};

export default function DailyReportAugust17() {
  return (
    <main className="article-page">
      <Link className="back-link" href="/">← 記事一覧へ戻る</Link>
      <article>
        <header className="report-header">
          <p className="report-label">DAILY MARKET BRIEFING</p>
          <h1>デイリー・マーケットブリーフィング</h1>
          <p className="report-date">2026年8月17日（月）</p>
        </header>
        <div className="report-body">
          <section>
            <h2>今日の結論</h2>
            <p>週明けの最重要イベントは、8時50分公表予定の日本4〜6月期GDP速報。現時点では結果未公表のため推測せず、公表後の金利・円・銀行株・輸出株の反応を確認したい。</p>
            <p>外部環境では、14日の米小売売上高が前月比0.6%減となり、米国株は小反落。週末にはホルムズ海峡の通航正常化が進まず、原油高リスクも継続している。AI・半導体ではSMICの価格引き上げと高稼働率が需要の強さを示す一方、Applied Materialsの株価反応は期待値の高さを示している。</p>
          </section>
          <section>
            <h2>市場スナップショット</h2>
            <div className="table-wrap"><table><thead><tr><th>対象</th><th>確認できた値・変化</th><th>読み方</th></tr></thead><tbody>
              <tr><td>日本4〜6月期GDP</td><td>8月17日8:50公表予定</td><td>結果は未公表</td></tr>
              <tr><td>S&amp;P500（8月14日）</td><td>7,785.76（-0.17%）</td><td>最高値圏から小反落</td></tr>
              <tr><td>NASDAQ総合（8月14日）</td><td>26,729.16（-0.28%）</td><td>半導体の一角が重荷</td></tr>
              <tr><td>米小売売上高（7月）</td><td>前月比-0.6%</td><td>消費減速を示唆</td></tr>
              <tr><td>ブレント原油（8月14日終値）</td><td>88.52ドル（+1.67%）</td><td>供給不安が継続</td></tr>
            </tbody></table></div>
            <p className="inline-sources">
              <a href="https://www.esri.cao.go.jp/en/sna/kouhyou/kouhyou_top.html" target="_blank" rel="noreferrer">内閣府・GDP公表予定（2026年8月17日）</a>
              <a href="https://www.reuters.com/business/us-retail-sales-unexpectedly-fall-july-2026-08-14/" target="_blank" rel="noreferrer">Reuters・米小売売上高（2026年8月14日）</a>
              <a href="https://www.reuters.com/business/wall-st-futures-muted-higher-oil-prices-temper-risk-appetite-after-sp-record-2026-08-14/" target="_blank" rel="noreferrer">Reuters・米国株（2026年8月14日）</a>
            </p>
          </section>
          <section><h2>1．日本GDPは8:50公表――日銀9月利上げ観測の分岐点</h2><p>内閣府は4〜6月期GDP1次速報を17日8時50分に公表する。Reutersの事前調査では年率2%程度の成長が予想されているが、7時時点では結果は未公表であり、確定値として扱わない。</p><p className="inline-sources"><a href="https://www.esri.cao.go.jp/en/sna/kouhyou/kouhyou_top.html" target="_blank" rel="noreferrer">内閣府・GDP公表予定</a><a href="https://www.reuters.com/business/take-five/global-markets-themes-graphic-2026-08-14/" target="_blank" rel="noreferrer">Reuters・市場予想（2026年8月14日）</a></p><h3>株価・市場への影響</h3><p>予想を上回る成長は日銀の追加利上げを後押ししやすく、銀行株には追い風、円高を通じて輸出株には逆風になり得る。弱いGDPなら逆方向の反応が想定される。</p><h3>次の注目点</h3><ul><li>実質GDPの前期比・年率</li><li>個人消費と設備投資</li><li>公表直後のドル円・長期金利</li></ul></section>
          <section><h2>2．米小売売上高は0.6%減――景気減速と金利低下の綱引き</h2><p>7月の米小売売上高は前月比0.6%減で、9カ月ぶりに減少した。コア小売売上高も0.4%減となり、個人消費の減速が第3四半期GDPを押し下げる可能性が意識されている。</p><p className="inline-sources"><a href="https://www.reuters.com/business/us-retail-sales-unexpectedly-fall-july-2026-08-14/" target="_blank" rel="noreferrer">Reuters・米小売売上高（2026年8月14日）</a></p><h3>株価・市場への影響</h3><p>FRB利上げ観測の後退は成長株を支えやすいが、企業売上の鈍化を伴う景気減速なら株式全体へのマイナスが勝る可能性がある。</p><h3>次の注目点</h3><ul><li>Walmart、Home Depotなどの決算</li><li>8月の雇用統計</li><li>9月FOMCの金利織り込み</li></ul></section>
          <section><h2>3．米国株は小反落――AI相場は期待値との勝負へ</h2><p>14日のS&amp;P500は0.17%安、NASDAQ総合は0.28%安。Applied Materialsは強い決算・見通しを示した後でも5%超下落し、高い期待が織り込まれていることを示した。</p><p className="inline-sources"><a href="https://www.reuters.com/business/wall-st-futures-muted-higher-oil-prices-temper-risk-appetite-after-sp-record-2026-08-14/" target="_blank" rel="noreferrer">Reuters・米国株（2026年8月14日）</a></p><h3>株価・市場への影響</h3><p>AI関連では好業績そのものより、成長率・受注・利益率が市場予想をどれだけ上回るかが株価を左右する段階に入っている。</p><h3>次の注目点</h3><ul><li>半導体装置株の反発力</li><li>大型テックの業績修正</li><li>AI関連株のバリュエーション調整</li></ul></section>
          <section><h2>4．ホルムズ海峡の通航停滞――原油・インフレリスクを再確認</h2><p>16日時点でもホルムズ海峡のタンカー通航は完全には正常化しておらず、米国とイランの協議も停滞している。14日のブレント原油は88.52ドルで終了した。</p><p className="inline-sources"><a href="https://www.reuters.com/business/energy/most-gulf-bourses-gain-despite-stalled-iran-talks-hormuz-disruption-2026-08-16/" target="_blank" rel="noreferrer">Reuters・湾岸市場とホルムズ（2026年8月16日）</a></p><h3>株価・市場への影響</h3><p>原油高が続けば、インフレ鈍化を前提とした金利低下シナリオを崩し、米国の成長株と日本の輸入型企業の双方に逆風となる。</p><h3>次の注目点</h3><ul><li>ブレント原油90ドル</li><li>米国の追加対イラン制裁</li><li>海峡通航量の回復</li></ul></section>
          <section><h2>5．SMICの価格引き上げ――AI需要の裾野は広い</h2><p>SMICはAI関連需要を背景に一部ウェハ価格を引き上げ、第2四半期の稼働率は93.7%まで上昇した。AI投資が最先端GPUだけでなく、成熟ノードの周辺半導体や電源・通信領域にも波及している可能性を示す。</p><p className="inline-sources"><a href="https://www.reuters.com/world/china/chinese-chipmaker-smic-increases-prices-strong-ai-demand-2026-08-14/" target="_blank" rel="noreferrer">Reuters・SMIC（2026年8月14日）</a></p><h3>株価・市場への影響</h3><p>ファウンドリー需給の逼迫は、製造装置・材料・電子部品の需要を支える一方、半導体を調達する企業にはコスト上昇要因となる。</p><h3>次の注目点</h3><ul><li>SMICの第3四半期出荷量</li><li>中国AI設備投資</li><li>日本の半導体装置・材料株への波及</li></ul></section>
          <p className="disclaimer">これは投資助言ではなく、2026年8月17日7時時点で確認できた公開情報に基づく市場概況の整理です。8時50分公表予定の日本GDPは未公表のため結果を記載していません。掲載した数値・見通しは将来の市場動向や投資成果を保証するものではありません。投資判断は、ご自身の目的、資金状況、リスク許容度を踏まえて行ってください。</p>
        </div>
      </article>
    </main>
  );
}
