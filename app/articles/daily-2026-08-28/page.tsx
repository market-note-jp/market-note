import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "デイリー・マーケットブリーフィング（2026年8月28日） | Market Note",
  description: "NVIDIA決算後の半導体株高、米国株、米PCE、FRB、ホルムズ海峡と原油を整理した2026年8月28日のマーケットブリーフィング。",
};

export default function DailyReportAugust28() {
  return (
    <main className="article-page">
      <Link className="back-link" href="/">← 記事一覧へ戻る</Link>
      <article>
        <header className="report-header">
          <p className="report-label">DAILY MARKET BRIEFING</p>
          <h1>デイリー・マーケットブリーフィング</h1>
          <p className="report-date">2026年8月28日（金）</p>
        </header>
        <div className="report-body">
          <section>
            <h2>今日の結論</h2>
            <p>28日の焦点は、<strong>NVIDIAの強い業績と長期見通しがAI相場を再点火し、NASDAQと半導体株を押し上げた一方、米インフレ高止まりと中東情勢がなお資本コストを高く保っていること</strong>だ。</p>
            <p>AI需要は業績面で再確認された。次に見るべきは、NVIDIAの成長が日本の半導体・メモリー・電力インフラ企業へどこまで波及するか、そしてFRBが3%台のPCEをどう評価するかだ。</p>
          </section>
          <section>
            <h2>市場スナップショット</h2>
            <div className="table-wrap"><table><thead><tr><th>対象</th><th>確認できた値・変化</th><th>読み方</th></tr></thead><tbody>
              <tr><td>S&amp;P500（8月27日）</td><td>7,730.99（+0.72%）</td><td>NVIDIAが指数を押し上げ</td></tr>
              <tr><td>NASDAQ総合（8月27日）</td><td>26,541.35（+1.57%）</td><td>大型テック・半導体が主導</td></tr>
              <tr><td>ダウ平均（8月27日）</td><td>53,569.44（+0.20%）</td><td>上昇はテック中心</td></tr>
              <tr><td>SOX指数（8月27日）</td><td>+2.3%</td><td>AI半導体へ資金回帰</td></tr>
              <tr><td>ブレント原油（8月27日）</td><td>89.70ドル（+2.1%）</td><td>米イラン協議後退で反発</td></tr>
            </tbody></table></div>
            <p className="inline-sources"><a href="https://www.reuters.com/business/nasdaq-futures-take-lead-after-nvidia-forecast-refuels-ai-trade-2026-08-27/" target="_blank" rel="noreferrer">Reuters・米国株（2026年8月27日）</a> <a href="https://www.reuters.com/business/energy/oil-prices-extend-losses-expectations-talks-ease-middle-east-supply-woes-2026-08-27/" target="_blank" rel="noreferrer">Reuters・原油（2026年8月27日）</a></p>
          </section>
          <section><h2>1．NVIDIA株急騰――70%成長見通しでAI相場を再点火</h2><p>NVIDIAは四半期決算で売上高962億ドル、データセンター売上890億ドルを計上し、来年度売上高が約70%増加する見通しを示した。27日の株価は大幅上昇し、AI関連株全体へ買いが波及した。</p><p className="inline-sources"><a href="https://www.reuters.com/business/nvidia-rises-after-signaling-longer-ai-spending-runway-2026-08-27/" target="_blank" rel="noreferrer">Reuters・NVIDIA（2026年8月27日）</a> <a href="https://investor.nvidia.com/news/press-release-details/2026/NVIDIA-Announces-Financial-Results-for-Second-Quarter-Fiscal-2027/default.aspx" target="_blank" rel="noreferrer">NVIDIA IR（2026年8月26日）</a></p><h3>株価・市場への影響</h3><p>AI需要のピークアウト懸念が後退し、日本の半導体製造装置、検査、メモリー、光通信、電力設備などにも期待が波及しやすい。</p><h3>次の注目点</h3><ul><li>日本市場のNVIDIA関連株の反応</li><li>Vera Rubinの量産計画</li><li>メモリー不足による供給制約</li></ul></section>
          <section><h2>2．NASDAQは1.57%高――ただし上昇はテックに偏る</h2><p>27日のS&amp;P500は0.72%高、NASDAQ総合は1.57%高、ダウ平均は0.20%高。S&amp;P500情報技術セクターは3.4%、SOX指数は2.3%上昇した。Reutersは、指数上昇の一方でS&amp;P500の多くの業種が下落したと伝えている。</p><p className="inline-sources"><a href="https://www.reuters.com/business/nasdaq-futures-take-lead-after-nvidia-forecast-refuels-ai-trade-2026-08-27/" target="_blank" rel="noreferrer">Reuters（2026年8月27日）</a></p><h3>株価・市場への影響</h3><p>AI主導の指数上昇は強いが、市場の幅が狭い場合はNVIDIAや半導体の反落が指数全体へ与える影響も大きくなる。</p><h3>次の注目点</h3><ul><li>上昇銘柄数の広がり</li><li>金融・景気敏感株への波及</li><li>SOX指数の高値更新</li></ul></section>
          <section><h2>3．米PCEは3%台――AI好決算でも金利リスクは消えない</h2><p>7月PCE価格指数は前年比3.7%、コアPCEは3.3%。インフレはFRB目標の2%を上回り、強い企業業績と高い金利が併存する状態が続く。</p><p className="inline-sources"><a href="https://www.bea.gov/news/2026/personal-income-and-outlays-july-2026" target="_blank" rel="noreferrer">米BEA（2026年8月26日）</a></p><h3>株価・市場への影響</h3><p>利益成長が金利上昇を上回れる企業と、バリュエーションだけで買われてきた銘柄の差が広がりやすい。</p><h3>次の注目点</h3><ul><li>FRB議長のジャクソンホール発言</li><li>米長期金利</li><li>9月FOMCの政策織り込み</li></ul></section>
          <section><h2>4．ホルムズ海峡の通航はなお低水準――原油89.70ドルへ反発</h2><p>27日のブレント原油は2.1%高の89.70ドル。米国がイランとの従来条件での合意復帰に否定的と報じられ、外交的な解決期待が後退した。Kplerによるとホルムズ海峡の通航はやや増えたものの、平常時を下回る。</p><p className="inline-sources"><a href="https://www.reuters.com/business/energy/oil-prices-extend-losses-expectations-talks-ease-middle-east-supply-woes-2026-08-27/" target="_blank" rel="noreferrer">Reuters・原油（2026年8月27日）</a> <a href="https://www.reuters.com/world/middle-east/shipping-traffic-through-strait-hormuz-rises-slightly-data-shows-2026-08-27/" target="_blank" rel="noreferrer">Reuters・通航量（2026年8月27日）</a></p><h3>株価・市場への影響</h3><p>原油再上昇は日本の輸入コストと米インフレを押し上げる一方、資源・エネルギー株には支援材料となる。</p><h3>次の注目点</h3><ul><li>90ドル台定着の有無</li><li>イラン・オマーン協議</li><li>実際のタンカー通航量</li></ul></section>
          <section><h2>5．日本のエネルギー安全保障――ホルムズ依存低減が政策テーマに</h2><p>日本政府は26日、原油調達先の多様化やホルムズ海峡を回避する中東パイプラインへの支援を含むエネルギー供給強靱化策を示した。日本は中東原油への依存度が高く、地政学リスクが企業収益と物価へ直結しやすい。</p><p className="inline-sources"><a href="https://www.reuters.com/business/energy/japan-diversify-crude-supplies-back-mideast-pipelines-resilience-effort-media-2026-08-26/" target="_blank" rel="noreferrer">Reuters（2026年8月26日）</a></p><h3>株価・市場への影響</h3><p>商社、エネルギー、海運、電力設備などでは短期の原油価格だけでなく、調達網再編やインフラ投資が中期テーマになり得る。</p><h3>次の注目点</h3><ul><li>政府の具体的支援策</li><li>商社の調達先多様化</li><li>原油高の国内CPIへの波及</li></ul></section>
          <p className="disclaimer">これは投資助言ではなく、2026年8月28日時点の公開情報に基づく市場概況の整理です。掲載した数値・見通しは将来の市場動向や投資成果を保証するものではありません。投資判断は、ご自身の目的、資金状況、リスク許容度を踏まえて行ってください。</p>
        </div>
      </article>
    </main>
  );
}
