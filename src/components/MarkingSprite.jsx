// Bodenmarkierungen als SVG, von oben gesehen (Fahrtrichtung nach oben).
// Vereinfachte Darstellungen zu Lernzwecken, keine amtlichen Wiedergaben.

const ASPHALT = '#4b5563'
const WHITE = '#ffffff'
const YELLOW = '#f6c026'
const BLUE = '#3b82f6'

const dashes = (x, dash, gap, w = 4, color = WHITE) => {
  const out = []
  for (let y = 4; y < 110; y += dash + gap) {
    out.push(<rect key={y} x={x - w / 2} y={y} width={w} height={Math.min(dash, 110 - y)} fill={color} />)
  }
  return out
}

const DRAWINGS = {
  leitlinie: () => <>{dashes(80, 12, 24)}</>,
  warnlinie: () => <>{dashes(80, 26, 12)}</>,
  sicherheitslinie: () => <rect x={78} y={0} width={4} height={110} fill={WHITE} />,
  sperrflaeche: () => (
    <>
      <polygon points="58,0 102,0 102,110 58,110" fill="none" stroke={WHITE} strokeWidth={3} />
      {[-110, -90, -70, -50, -30, -10, 10, 30, 50, 70, 90, 110].map((o) => (
        <line key={o} x1={58} y1={o + 44} x2={102} y2={o} stroke={WHITE} strokeWidth={3} />
      ))}
    </>
  ),
  fussgaengerstreifen: () => (
    <>
      {dashes(80, 12, 24, 3)}
      {[18, 38, 58, 78, 98, 118, 138].map((x) => (
        <rect key={x} x={x - 6} y={36} width={12} height={38} fill={WHITE} />
      ))}
    </>
  ),
  haltelinie: () => (
    <>
      {dashes(40, 12, 24, 3)}
      <rect x={44} y={46} width={96} height={5} fill={WHITE} />
    </>
  ),
  wartelinie: () => (
    <>
      {dashes(40, 12, 24, 3)}
      {[0, 1, 2, 3, 4].map((i) => (
        <polygon key={i} points={`${50 + i * 20},40 ${68 + i * 20},40 ${59 + i * 20},58`} fill={WHITE} />
      ))}
    </>
  ),
  blaue_zone: () => (
    <>
      {[10, 42, 74].map((y) => (
        <path key={y} d={`M 160 ${y} L 118 ${y} L 118 ${y + 30} L 160 ${y + 30}`} fill="none" stroke={BLUE} strokeWidth={4} />
      ))}
      {dashes(60, 12, 24, 3)}
    </>
  ),
  weisse_parkfelder: () => (
    <>
      {[10, 42, 74].map((y) => (
        <path key={y} d={`M 160 ${y} L 118 ${y} L 118 ${y + 30} L 160 ${y + 30}`} fill="none" stroke={WHITE} strokeWidth={4} />
      ))}
      {dashes(60, 12, 24, 3)}
    </>
  ),
  gelb_durchgezogen: () => (
    <>
      {dashes(60, 12, 24, 3)}
      <rect x={128} y={0} width={4} height={110} fill={YELLOW} />
    </>
  ),
  gelb_unterbrochen: () => (
    <>
      {dashes(60, 12, 24, 3)}
      {dashes(130, 14, 12, 4, YELLOW)}
    </>
  ),
  zickzack: () => (
    <>
      {dashes(60, 12, 24, 3)}
      <polyline points="126,0 138,11 126,22 138,33 126,44 138,55 126,66 138,77 126,88 138,99 126,110" fill="none" stroke={YELLOW} strokeWidth={4} strokeLinejoin="round" />
    </>
  ),
  velostreifen: () => (
    <>
      {dashes(50, 12, 24, 3)}
      <rect x={108} y={0} width={4} height={110} fill={YELLOW} />
      <g fill="none" stroke={WHITE} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" transform="translate(136 55)">
        <circle cx={-7} cy={7} r={5.5} />
        <circle cx={7} cy={7} r={5.5} />
        <path d="M -7 7 L -2 -5 L 5 -5 L 7 7 M -2 -5 L 2 7" />
      </g>
    </>
  ),
}

export default function MarkingSprite({ id, width = 160, className = '' }) {
  const draw = DRAWINGS[id]
  if (!draw) return null
  return (
    <svg
      viewBox="0 0 160 110"
      width={width}
      height={(width * 110) / 160}
      role="img"
      aria-hidden
      className={`overflow-hidden rounded-xl ${className}`}
    >
      <rect width={160} height={110} fill={ASPHALT} />
      {draw()}
    </svg>
  )
}
