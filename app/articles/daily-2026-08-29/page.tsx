import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "デイリー・マーケットブリーフィング（2026年8月29日・週末版） | Market Note",
  description: "米国株、FRB、NVIDIA、米PCE、キオクシア・Sandisk、原油を整理した2026年8月29日の週末版マーケットブリーフィング。",
};

export default function DailyReportAugust29() {
  return (
    <main className="article-page">
      <Link className="back-link" href="/">← 記事一覧へ戻る</Link>
      <article>
        <header className="report-header">
          <p className="report-label">DAILY MARKET BRIEFING</p>
          <h1>デイリー・マーケットブリーフィング</h1>
          <p className="report-date">2026年8月29日（土）・週末版</p>
        </header>
        <div className="report-body">
          <section><h2>今日の結論</h2><p>29日の焦点は、<strong>NVIDIAの好決算だけでは米ハイテク株の上昇が続かず、FRBのインフレ警戒と高い資本コストが再び相場の重しになったこと</strong>だ。</p><p>AI需要そのものは強い一方、株価は業績だけでなく金利とバリュエーションに左右されている。日本ではキオクシアとSandiskの大型投資計画が、AI向けメモリー需要の中期的な強さを示している。</p></section>
          <section><h2>市場スナップショット</h2><div className="table-wrap"><table><thead><tr><th>対象</th><th>確認できた値・変化</th><th>読み方</th></tr></thead><tbody><tr><td>S&amp;P500（8月28日）</td><td>-0.25%</td><td>FRBのインフレ警戒で反落</td></tr><tr><td>NASDAQ総合（8月28日）</td><td>-0.52%</td><td>大型テックが弱い</td></tr><tr><td>NVIDIA（8月28日）</td><td>-4.6%</td><td>好決算後も利益確定</td></tr><tr><td>ブレント原油（8月28日）</td><td>89.31ドル（-0.43%）</td><td>週では5%超下落</td></tr><tr><td>米コアPCE（7月）</td><td>前年比+3.3%</td><td>2%目標を上回る</td></tr></tbody></table></div><p className="inline-sources"><a href="https://www.reuters.com/business/sp-500-nasdaq-futures-slip-after-tech-rally-warshs-speech-awaited-2026-08-28/" target="_blank" rel="noreferrer">Reuters・米国株（2026年8月28日）</a> <a href="https://www.reuters.com/business/energy/oil-track-weekly-loss-even-iran-tensions-simmer-2026-08-28/" target="_blank" rel="noreferrer">Reuters・原油（2026年8月28日）</a></p></section>
          <section><h2>1．米国株反落――FRBのインフレ警戒がAI株高を抑える</h2><p>28日の米国株はS&amp;P500が0.25%安、NASDAQ総合が0.52%安、ダウ平均が0.02%安。FRB議長Kevin Warshがインフレが2%へ明確に低下しなければ追加の政策対応が必要との姿勢を示し、金利上昇への警戒が強まった。</p><p className="inline-sources"><a href="https://www.reuters.com/business/sp-500-nasdaq-futures-slip-after-tech-rally-warshs-speech-awaited-2026-08-28/" target="_blank" rel="noreferrer">Reuters（2026年8月28日）</a></p><h3>株価・市場への影響</h3><p>高PERのAI・半導体株ほど金利上昇の影響を受けやすく、好業績だけでは一方向の上昇が続きにくい。</p><h3>次の注目点</h3><ul><li>9月FOMCの利上げ織り込み</li><li>米10年債利回り</li><li>テック以外への資金循環</li></ul></section>
          <section><h2>2．NVIDIAは4.6%安――好決算後もバリュエーションを再評価</h2><p>NVIDIAは前日に強い売上成長見通しを示したものの、28日の株価は4.6%下落した。AI需要への期待は維持されているが、決算後の急騰を受けて利益確定と金利警戒が重なった。</p><p className="inline-sources"><a href="https://www.reuters.com/business/sp-500-nasdaq-futures-slip-after-tech-rally-warshs-speech-awaited-2026-08-28/" target="_blank" rel="noreferrer">Reuters（2026年8月28日）</a> <a href="https://investor.nvidia.com/news/press-release-details/2026/NVIDIA-Announces-Financial-Results-for-Second-Quarter-Fiscal-2027/default.aspx" target="_blank" rel="noreferrer">NVIDIA IR（2026年8月26日）</a></p><h3>株価・市場への影響</h3><p>日本の半導体関連株でも、AI需要の実需と短期的な株価過熱を分けて見る必要がある。</p><h3>次の注目点</h3><ul><li>次世代GPUの供給計画</li><li>データセンター投資の継続性</li><li>半導体株の決算後の需給</li></ul></section>
          <section><h2>3．米コアPCEは前年比3.3%――消費は伸び鈍化</h2><p>米BEAによると、7月PCE価格指数は前年比3.7%、食品・エネルギーを除くコアは3.3%。実質PCEは前月比ほぼ横ばいで、インフレ高止まりと消費の鈍化が同時に確認された。</p><p className="inline-sources"><a href="https://www.bea.gov/news/2026/personal-income-and-outlays-july-2026" target="_blank" rel="noreferrer">米BEA（2026年8月26日）</a></p><h3>株価・市場への影響</h3><p>利上げ観測には上向き、景気敏感株には下向きの材料となりやすく、業績選別が強まりやすい。</p><h3>次の注目点</h3><ul><li>次回雇用統計</li><li>サービスインフレ</li><li>実質消費の回復</li></ul></section>
          <section><h2>4．キオクシアとSandisk、2032年までに310億ドル超を日本へ投資</h2><p>キオクシアとSandiskは、AIブームによるメモリー需要拡大を背景に、2032年までに日本で310億ドル超を共同投資する計画を公表した。計画は政府支援を前提としている。</p><p className="inline-sources"><a href="https://www.reuters.com/world/asia-pacific/kioxia-sandisk-invest-over-31-billion-japan-amid-ai-boom-2026-08-27/" target="_blank" rel="noreferrer">Reuters（2026年8月27日）</a></p><h3>株価・市場への影響</h3><p>NAND・メモリー製造装置・材料・電力設備など、日本のAI供給網への中期的な設備投資需要を支える。</p><h3>次の注目点</h3><ul><li>政府支援の規模</li><li>投資時期と生産能力</li><li>AI向けメモリー価格</li></ul></section>
          <section><h2>5．原油は89.31ドル――ホルムズ再開観測で週間下落</h2><p>ブレント原油は28日に89.31ドルで終了し、週間では5%超下落した。ホルムズ海峡の通航を巡る合意観測が供給不安を和らげた一方、実際の通航量は平常時を下回っている。</p><p className="inline-sources"><a href="https://www.reuters.com/business/energy/oil-track-weekly-loss-even-iran-tensions-simmer-2026-08-28/" target="_blank" rel="noreferrer">Reuters（2026年8月28日）</a></p><h3>株価・市場への影響</h3><p>原油安は日本の輸入コストには追い風だが、地政学リスクが残るため急反発への備えも必要となる。</p><h3>次の注目点</h3><ul><li>ホルムズ海峡の実際の通航量</li><li>米国とイランの協議</li><li>90ドルを挟む原油の値動き</li></ul></section>
          <p className="disclaimer">これは投資助言ではなく、2026年8月29日7:00 JST時点で確認できた公開情報に基づく市場概況の整理です。掲載した数値・見通しは将来の市場動向や投資成果を保証するものではありません。投資判断は、ご自身の目的、資金状況、リスク許容度を踏まえて行ってください。</p>
        </div>
      </article>
    </main>
  );
}
