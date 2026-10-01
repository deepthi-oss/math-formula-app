import { useState } from 'react'

const CX = 160, CY = 160, R = 110

const deg2pt = deg => {
  const rad = (deg * Math.PI) / 180
  return { x: CX + R * Math.cos(rad), y: CY + R * Math.sin(rad) }
}

const RADIUS_PT = deg2pt(300)
const DIA_A = deg2pt(0)
const DIA_B = deg2pt(180)
const CHORD_A = deg2pt(150)
const CHORD_B = deg2pt(230)
const SECTOR_A = deg2pt(20)
const SECTOR_B = deg2pt(70)
const ARC_A = deg2pt(95)
const ARC_B = deg2pt(135)
const TAN_PT = deg2pt(270)

const PARTS = [
  {
    id: 'center',
    label: 'Center',
    def: 'The fixed point inside the circle that is equidistant from every point on the circle.',
  },
  {
    id: 'radius',
    label: 'Radius',
    def: 'A line segment joining the center to any point on the circle.',
  },
  {
    id: 'diameter',
    label: 'Diameter',
    def: 'A line segment through the center joining two points on the circle — twice the radius.',
  },
  {
    id: 'chord',
    label: 'Chord',
    def: "A line segment joining any two points on the circle — it doesn't have to pass through the center.",
  },
  {
    id: 'arc',
    label: 'Arc',
    def: "A part of the circle's boundary between two points.",
  },
  {
    id: 'circumference',
    label: 'Circumference',
    def: 'The total distance around the circle.',
  },
  {
    id: 'sector',
    label: 'Sector',
    def: 'The region enclosed by two radii and the arc between them — like a slice of pizza.',
  },
  {
    id: 'segment',
    label: 'Segment',
    def: 'The region enclosed by a chord and the arc it cuts off.',
  },
  {
    id: 'tangent',
    label: 'Tangent',
    def: 'A line that touches the circle at exactly one point.',
  },
]

function shuffledOrder() {
  return [...PARTS].sort(() => Math.random() - 0.5).map(p => p.id)
}

export default function CirclePartsActivity() {
  const [order, setOrder] = useState(shuffledOrder)
  const [step, setStep] = useState(0)
  const [revealed, setRevealed] = useState(() => new Set())
  const [wrongId, setWrongId] = useState(null)
  const [score, setScore] = useState(0)

  const done = step >= order.length
  const currentId = !done ? order[step] : null
  const currentPart = PARTS.find(p => p.id === currentId)

  const newRound = () => {
    setOrder(shuffledOrder())
    setStep(0)
    setRevealed(new Set())
    setWrongId(null)
    setScore(0)
  }

  const handleClick = partId => {
    if (done || revealed.has(partId)) return
    if (partId === currentId) {
      const next = new Set(revealed)
      next.add(partId)
      setRevealed(next)
      setScore(s => s + 1)
      setWrongId(null)
      setStep(s => s + 1)
    } else {
      setWrongId(partId)
      setTimeout(() => setWrongId(null), 450)
    }
  }

  const cls = id => `cp-hit ${revealed.has(id) ? 'cp-found' : ''} ${wrongId === id ? 'cp-wrong' : ''}`

  return (
    <div className="cp-activity">
      {!done ? (
        <p className="cp-prompt">
          Click the <strong>{currentPart.label.toUpperCase()}</strong> on the diagram
        </p>
      ) : (
        <p className="cp-prompt cp-prompt-done">🎉 Fully labeled! You found all {PARTS.length} parts.</p>
      )}

      <div className="cp-progress">Found: {score} / {PARTS.length}</div>

      <svg viewBox="0 0 320 320" className="cp-svg">
        {/* circumference (base circle) */}
        <g data-part="circumference" className={cls('circumference')} onClick={() => handleClick('circumference')}>
          <circle cx={CX} cy={CY} r={R} stroke="transparent" strokeWidth="16" fill="none" />
          <circle cx={CX} cy={CY} r={R} className="cp-line" fill="none" />
        </g>

        {/* sector fill */}
        <g data-part="sector" className={cls('sector')} onClick={() => handleClick('sector')}>
          <path
            d={`M ${CX} ${CY} L ${SECTOR_A.x} ${SECTOR_A.y} A ${R} ${R} 0 0 1 ${SECTOR_B.x} ${SECTOR_B.y} Z`}
            className="cp-fill cp-fill-sector"
          />
        </g>

        {/* segment fill */}
        <g data-part="segment" className={cls('segment')} onClick={() => handleClick('segment')}>
          <path
            d={`M ${CHORD_A.x} ${CHORD_A.y} A ${R} ${R} 0 0 1 ${CHORD_B.x} ${CHORD_B.y} Z`}
            className="cp-fill cp-fill-segment"
          />
        </g>

        {/* diameter */}
        <g data-part="diameter" className={cls('diameter')} onClick={() => handleClick('diameter')}>
          <line x1={DIA_A.x} y1={DIA_A.y} x2={DIA_B.x} y2={DIA_B.y} stroke="transparent" strokeWidth="16" />
          <line x1={DIA_A.x} y1={DIA_A.y} x2={DIA_B.x} y2={DIA_B.y} className="cp-line" />
        </g>

        {/* radius */}
        <g data-part="radius" className={cls('radius')} onClick={() => handleClick('radius')}>
          <line x1={CX} y1={CY} x2={RADIUS_PT.x} y2={RADIUS_PT.y} stroke="transparent" strokeWidth="16" />
          <line x1={CX} y1={CY} x2={RADIUS_PT.x} y2={RADIUS_PT.y} className="cp-line cp-line-accent" />
        </g>

        {/* chord */}
        <g data-part="chord" className={cls('chord')} onClick={() => handleClick('chord')}>
          <line x1={CHORD_A.x} y1={CHORD_A.y} x2={CHORD_B.x} y2={CHORD_B.y} stroke="transparent" strokeWidth="16" />
          <line x1={CHORD_A.x} y1={CHORD_A.y} x2={CHORD_B.x} y2={CHORD_B.y} className="cp-line cp-line-accent" />
        </g>

        {/* arc highlight (on top of circumference) */}
        <g data-part="arc" className={cls('arc')} onClick={() => handleClick('arc')}>
          <path d={`M ${ARC_A.x} ${ARC_A.y} A ${R} ${R} 0 0 1 ${ARC_B.x} ${ARC_B.y}`} stroke="transparent" strokeWidth="18" fill="none" />
          <path d={`M ${ARC_A.x} ${ARC_A.y} A ${R} ${R} 0 0 1 ${ARC_B.x} ${ARC_B.y}`} className="cp-line cp-line-arc" fill="none" />
        </g>

        {/* tangent */}
        <g data-part="tangent" className={cls('tangent')} onClick={() => handleClick('tangent')}>
          <line x1={TAN_PT.x - 55} y1={TAN_PT.y} x2={TAN_PT.x + 55} y2={TAN_PT.y} stroke="transparent" strokeWidth="16" />
          <line x1={TAN_PT.x - 55} y1={TAN_PT.y} x2={TAN_PT.x + 55} y2={TAN_PT.y} className="cp-line cp-line-accent" />
        </g>

        {/* center */}
        <g data-part="center" className={cls('center')} onClick={() => handleClick('center')}>
          <circle cx={CX} cy={CY} r="10" stroke="transparent" strokeWidth="6" fill="transparent" />
          <circle cx={CX} cy={CY} r="4" className="cp-dot" />
        </g>
      </svg>

      <div className="cp-glossary">
        {PARTS.filter(p => revealed.has(p.id)).map(p => (
          <div key={p.id} className="cp-glossary-row">
            <span className="cp-glossary-term">{p.label}</span>
            <span className="cp-glossary-def">{p.def}</span>
          </div>
        ))}
      </div>

      <button className="cp-new-btn" onClick={newRound}>🔄 New Round</button>
    </div>
  )
}
