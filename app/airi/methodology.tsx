const components = [
  { axis: "過熱度", name: "予想PER", formula: "1 ÷ Σ（各社の保有時価比率 × 翌12か月予想EPS ÷ 株価）", unit: "倍", note: "EPSは1株当たり利益。予想利益と株価の株式分割基準を合わせます。各社のPERを単純平均せず、合計利益利回りが0以下なら算出しません。" },
  { axis: "過熱度", name: "200日線乖離率", formula: "（基準ポートフォリオ価格 ÷ 直近200営業日の平均価格 − 1）× 100", unit: "%", note: "株価が中期的な平均からどれだけ上離れているかを測ります。" },
  { axis: "過熱度", name: "ETF資金流入率", formula: "ARTYの直近4週間の純設定額 ÷ 4週間前の純資産 × 100", unit: "%", note: "AI株への資金流入の代理。価格上昇による純資産の増加は流入に含めず、戦略変更前後の互換性のない履歴をつなぎません。" },
  { axis: "脆弱性", name: "設備投資／営業CF", formula: "大手4社の直近12か月現金設備投資合計 ÷ 営業キャッシュフロー合計 × 100", unit: "%", note: "Microsoft・Amazon・Alphabet・Metaが対象。分母が0以下なら欠損。AI以外の設備投資も含み、リースで調達した設備の負担は十分に捉えられません。" },
  { axis: "脆弱性", name: "純負債／EBITDA", formula: "8社の（有利子負債 − 現金及び現金同等物）合計 ÷ 直近12か月EBITDA合計", unit: "倍", note: "EBITDAは営業利益に減価償却費・償却費を加算。分母が0以下なら欠損。負債にはファイナンスリースを含み、オペレーティングリースを除きます。純現金の企業群なら負の値も取ります。" },
  { axis: "脆弱性", name: "下落時の相関", formula: "基準ポートフォリオ下落日の、8社全28組のPearson相関係数の単純平均", unit: "−1〜1", note: "直近126営業日のうち最低30下落日、かつ全28組の相関が計算可能であることが条件。各社の日次リターンが一緒に動く強さを測ります。" },
  { axis: "脆弱性", name: "米10年実質金利", formula: "米10年物インフレ連動国債利回り（DFII10）", unit: "%", note: "FRBが公表しFREDが提供する系列。2.55%は2.55と入力します。名目金利から当月の物価上昇率を引いた値ではありません。" },
  { axis: "悪化兆候", name: "EPS下方修正超過率", formula: "（3か月前比の予想EPS下方修正銘柄数 − 上方修正銘柄数）÷ 8 × 100", unit: "pt", note: "8社全てで翌12か月予想EPSを比較できる場合のみ採用。同値はどちらにも含めません。時間経過に伴って予測対象期間が変わる影響もあるため、純粋な予想変更とは限りません。" },
  { axis: "悪化兆候", name: "信用スプレッドの変化", formula: "（現在の米HY OAS［%］− 3暦月前時点の直近利用可能な値［%］）× 100", unit: "bp", note: "HY OASはハイイールド債の信用スプレッド。1bpは0.01ポイント。ICEデータの公開利用条件が確認できるまでは掲載対象外とします。" },
  { axis: "悪化兆候", name: "200日線割れ銘柄比率", formula: "各社自身の200日移動平均を下回る銘柄数 ÷ 8 × 100", unit: "%", note: "8社全てに200営業日分の株価が必要。価格が200日線と同じ場合は下回った銘柄に含めません。" },
];

export default function Methodology() {
  return <section className="airi-section" id="methodology" aria-labelledby="methodology-title">
    <div className="airi-section-heading"><h2 id="methodology-title">AIRIの中身・計算式</h2><p>モデル v0.1.0 ／ 解説更新 2026-09-13</p></div>
    <p>各項目を過去の分布と比較して点数化し、3つの軸ごとに平均した後、その3軸を平均します。すべての項目は「値が大きいほどリスク側」とする設計仮説です。重みや方向の予測力は、まだ検証されていません。</p>

    <h3 className="airi-method-heading">1. 各項目を0〜100点にする</h3>
    <div className="airi-formula" aria-label="項目スコアの計算式">項目スコア = 100 ×（現在値より低い過去値の件数 + 同値の件数 × 0.5）÷ 有効履歴数</div>
    <div className="airi-method-grid"><div><h4>分子：過去値をどれだけ上回るか</h4><p>現在値より低い過去値を数えます。現在値と同じものは0.5件として加えます。過去値とすべて同じなら50点です。</p></div><div><h4>分母：比較に使える月次データの数</h4><p>評価月より前の直近60か月を対象とし、最低36件が必要です。月次参照日は各月1日。株価項目には、その日より前の直近取引日までのデータを使います。</p></div></div>
    <aside className="airi-worked-example" aria-label="架空の計算例"><p className="airi-example-label">計算例・実際の市場データではありません</p><p>過去50件のうち現在値より低いものが40件、同値が0件なら、</p><p className="airi-example-equation">100 × 40 ÷ 50 = <strong>80点</strong></p><p>過去50件の80%を上回る水準という意味です。<strong>暴落確率80%を意味しません。</strong>100点は参照値すべてを上回り、0点はすべてを下回る場合です。</p></aside>

    <h3 className="airi-method-heading">2. 軸ごとに平均し、3軸を平均する</h3>
    <div className="airi-table-wrap"><table><caption className="airi-table-caption">全10項目がそろった場合の重み</caption><thead><tr><th scope="col">軸</th><th scope="col">軸の計算</th><th scope="col">総合に占める軸の重み</th><th scope="col">各項目の総合への重み</th></tr></thead><tbody>
      <tr><th scope="row">過熱度</th><td>3項目のスコア合計 ÷ 3</td><td>1/3（約33.3%）</td><td>各1/9（約11.1%）</td></tr>
      <tr><th scope="row">脆弱性</th><td>4項目のスコア合計 ÷ 4</td><td>1/3（約33.3%）</td><td>各1/12（約8.3%）</td></tr>
      <tr><th scope="row">悪化兆候</th><td>3項目のスコア合計 ÷ 3</td><td>1/3（約33.3%）</td><td>各1/9（約11.1%）</td></tr>
    </tbody></table></div>
    <div className="airi-formula airi-formula-total">AIRI =（過熱度 + 脆弱性 + 悪化兆候）÷ 3</div>
    <p>例えば、過熱度80・脆弱性60・悪化兆候40なら、AIRI =（80 + 60 + 40）÷ 3 = <strong>60点</strong>です。これも説明用の架空例です。10項目を一括で平均する計算とは異なります。</p>
    <p>モデルv0.1.0の重みは固定です。AIが毎週重みを変えたり、文章の印象で加点したりする仕組みではありません。計算の途中では丸めず、画面のスコアを小数第1位に丸めて表示します。</p>

    <h3 className="airi-method-heading">3. 10項目の定義</h3>
    <p>基準ポートフォリオはNVIDIA・Broadcom・AMD・Microsoft・Amazon・Alphabet・Meta・Oracleの8社。米ドル建て、配当を含まない価格ベースで、四半期最初の取引日のリターンを反映する前に、前営業日の終値を使って等金額へ調整します。</p>
    <div className="airi-table-wrap airi-definition-table"><table><thead><tr><th scope="col">項目・軸</th><th scope="col">入力値の計算式</th><th scope="col">単位</th><th scope="col">対象・条件</th></tr></thead><tbody>{components.map(c=><tr key={c.name}><th scope="row"><span className="airi-axis-label">{c.axis}</span>{c.name}</th><td>{c.formula}</td><td>{c.unit}</td><td>{c.note}</td></tr>)}</tbody></table></div>

    <h3 className="airi-method-heading">4. 欠損・古いデータをどう扱うか</h3>
    <p>現在値の出典・日付が有効で、月次履歴が最低36件そろった項目だけを採点します。<strong>欠損は0点に置き換えません。</strong>各軸75%以上、全体80%以上が採点可能であることを総合点の条件としています。</p>
    <div className="airi-table-wrap"><table><caption className="airi-table-caption">現在の項目構成で必要な最低件数</caption><thead><tr><th scope="col">軸</th><th scope="col">必要件数</th><th scope="col">欠損時の計算</th></tr></thead><tbody>
      <tr><th scope="row">過熱度</th><td>3項目中3項目</td><td>1つでも欠ければ軸は算出不可</td></tr>
      <tr><th scope="row">脆弱性</th><td>4項目中3項目以上</td><td>3項目なら、その3項目で平均</td></tr>
      <tr><th scope="row">悪化兆候</th><td>3項目中3項目</td><td>1つでも欠ければ軸は算出不可</td></tr>
    </tbody></table></div>
    <p>したがって、現行構成では<strong>最低9項目</strong>が必要で、欠けてよいのは脆弱性の1項目だけです。全体条件の80%だけを満たしても総合は算出できません。脆弱性が3項目の場合、その各項目の総合への重みは1/9になります。</p>
    <p>古さは観測日からの暦日数で判定します。株価・金利・信用は10日、ETF流入は14日、利益予想は45日、財務は200日が上限。値の取得日を観測日に置き換えず、公表日は評価日より前であることを条件とします。財務比率の分母が0以下の場合も欠損です。</p>
    <p>有効な項目が変わると平均の構成も変わります。そのため前週差は、前回記録から5〜9日で、両方の総合が算出でき、採点に使った項目が同じ場合だけ表示します。</p>

    <h3 className="airi-method-heading">5. データ源・更新・検証状況</h3>
    <p>株価：{['NVDA','AVGO','AMD','MSFT','AMZN','GOOGL','META','ORCL'].map((t,i)=><span key={t}>{i>0?' / ':''}<a href={`https://finance.yahoo.com/quote/${t}/history/`} target="_blank" rel="noreferrer">{t}</a></span>)}（Yahoo Financeの分割調整済み終値）。実質金利：<a href="https://fred.stlouisfed.org/series/DFII10" target="_blank" rel="noreferrer">FRB / FRED・DFII10</a>。予想EPS・ETF純流入・財務の同一定義の履歴は準備中です。</p>
    <p>毎週土曜の午前にデータを確認し、実測値・取得できない項目・出典・観測日を記録します。数値を確認した日と、元のデータの観測日は区別します。更新に失敗した場合も過去の記録を保持し、前回の値を最新値として扱いません。</p>
    <ul className="airi-limitations"><li>現在選んだ8社を過去にさかのぼって使うため、銘柄の事後選択による偏りがあります。</li><li>価格の参照履歴は現在の調整済みデータから再構成しており、公表当時の未改訂データを再現したものではありません。</li><li>長い過熱局面では参照分布自体が上昇します。平均化で一部の極端なリスクが隠れたり、似た要因を重複して評価したりする可能性があります。</li><li>実際の暴落をどれだけ予測できるかは未検証です。高得点を売り、低得点を買いとする売買基準は設けていません。</li></ul>
    <div className="airi-method-links"><a href="https://github.com/market-note-jp/market-note/blob/17126748c445a1777b9ffa22fc44096ae46a6996/scripts/airi_model.py" target="_blank" rel="noreferrer">v0.1.0の計算コード ↗</a><a href="https://github.com/market-note-jp/market-note/tree/main/data/airi/releases" target="_blank" rel="noreferrer">公開済みの週次データ ↗</a></div>
    <p className="airi-notice">本ページの計算例は説明用の架空値で、実測欄・週次履歴には含めていません。AIRIは相対的なリスクスコアです。CRASH-12（12か月以内の35%以上下落確率）は未校正のため提供していません。</p>
  </section>;
}
