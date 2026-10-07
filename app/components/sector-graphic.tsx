/** Original editorial illustrations. Decorative only: these shapes are not market data. */
export default function SectorGraphic({ variant = 0 }: { variant?: number }) {
  return (
    <svg className={`sector-graphic sector-graphic-${variant % 5}`} viewBox="0 0 360 220" fill="none" aria-hidden="true">
      <g stroke="currentColor" strokeWidth="1" opacity=".22">
        {[20, 60, 100, 140, 180, 220, 260, 300, 340].map((x) => <path key={x} d={`M${x} 0v220`} />)}
        {[20, 60, 100, 140, 180, 220].map((y) => <path key={y} d={`M0 ${y}h360`} />)}
      </g>
      {variant % 5 === 0 ? <g stroke="currentColor" strokeWidth="1.5">
        <path d="m180 29 106 61-106 62L74 90l106-61Z" fill="currentColor" fillOpacity=".08" />
        <path d="M74 90v24l106 62 106-62V90M74 114v24l106 62 106-62v-24M180 152v48" />
        <path d="m180 58 57 33-57 33-57-33 57-33Z" fill="currentColor" fillOpacity=".18" />
        <path d="m145 91 35-20 35 20-35 20-35-20Z" />
        {[0, 1, 2, 3, 4].map((i) => <path key={i} d={`m${86+i*18} ${70-i*10} -14 -8 m${207+i*18} ${53+i*10} 14 -8 m${86+i*18} ${102+i*10} -14 8 m${207+i*18} ${133-i*10} 14 8`} />)}
      </g> : variant % 5 === 1 ? <g stroke="currentColor" strokeWidth="2">
        <path d="M84 188h192M114 188v-24h45v24M134 164l37-74 44 21-56 53M172 90l-38-48 28-19 53 88M160 23l82 33-12 29-68-43M230 69l29 9 18-14m-18 14 12 23" />
        <circle cx="190" cy="108" r="16" fill="currentColor" fillOpacity=".1" /><circle cx="152" cy="41" r="11" /><circle cx="237" cy="67" r="9" />
        <path d="M59 154v-44h33M283 106v47h-29" strokeDasharray="5 5" />
      </g> : variant % 5 === 2 ? <g stroke="currentColor" strokeWidth="1.5">
        {[0, 1, 2].map(i=><path key={i} d={`m${109+i*54} ${52+i*14} 37 21v43l-37 21-37-21V${73+i*14}l37-21Z`} />)}
        <path d="m145 73 54 31m-90 33v32l54 31 54-31v-32M163 200v-42" />
        <circle cx="109" cy="95" r="7" fill="currentColor"/><circle cx="163" cy="109" r="7" fill="currentColor"/><circle cx="217" cy="123" r="7" fill="currentColor"/>
      </g> : variant % 5 === 3 ? <g stroke="currentColor" strokeWidth="1.5">
        <circle cx="180" cy="110" r="79" /><ellipse cx="180" cy="110" rx="39" ry="79" /><path d="M101 110h158M112 71h136M112 149h136M180 31v158" />
        <path d="m71 149 198-78m-13-4 13 4-6 13" strokeWidth="3" /><circle cx="122" cy="128" r="6" fill="currentColor"/><circle cx="239" cy="83" r="6" fill="currentColor"/>
      </g> : <g stroke="currentColor" strokeWidth="1.5">
        <circle cx="180" cy="110" r="64" /><path d="M180 30v160M100 110h160m-23-57L123 167m0-114 114 114" />
        {[0,1,2,3].map((i)=><circle key={i} cx={180+(i===0?-80:i===2?80:0)} cy={110+(i===1?-80:i===3?80:0)} r="13" fill="currentColor" fillOpacity=".15"/>)}
        <path d="m180 70 13 27 30 4-22 21 5 30-26-14-26 14 5-30-22-21 30-4 13-27Z" fill="currentColor" fillOpacity=".12"/>
      </g>}
      <path d="M16 16h12M16 16v12m316-12h12v12M16 192v12h12m316-12v12h-12" stroke="currentColor" opacity=".55" />
    </svg>
  );
}
