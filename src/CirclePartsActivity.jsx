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

const ALL_IDS = PARTS.map(p => p.id)

function shuffledIds(ids) {
  return [...ids].sort(() => Math.random() - 0.5)
}

export default function CirclePartsActivity() {
  const [order, setOrder] = useState(() => shuffledIds(ALL_IDS))
  const [step, setStep] = useState(0)
  const [revealed, setRevealed] = useState(() => new Set())
  const [wrongId, setWrongId] = useState(null)
  const [attempts, setAttempts] = useState({})
  const [roundNumber, setRoundNumber] = useState(1)
  const [phase, setPhase] = useState('quiz') // 'quiz' | 'round1-summary' | 'final-summary'
  const [lastRoundAttempts, setLastRoundAttempts] = useState({})

  const done = step >= order.length
  const currentId = !done ? order[step] : null
  const currentPart = PARTS.find(p => p.id === currentId)

  const newRound = () => {
    setOrder(shuffledIds(ALL_IDS))
    setStep(0)
    setRevealed(new Set())
    setWrongId(null)
    setAttempts({})
    setRoundNumber(1)
    setPhase('quiz')
  }

  const finishRound = currentAttempts => {
    setLastRoundAttempts(currentAttempts)
    if (roundNumber === 1) {
      const struggling = ALL_IDS.filter(id => (currentAttempts[id] || 0) > 0)
      setPhase(struggling.length === 0 ? 'final-summary' : 'round1-summary')
    } else {
      setPhase('final-summary')
    }
  }

  const startReview = () => {
    const struggling = ALL_IDS
      .filter(id => (lastRoundAttempts[id] || 0) > 0)
      .sort((a, b) => (lastRoundAttempts[b] || 0) - (lastRoundAttempts[a] || 0))
    setOrder(shuffledIds(struggling))
    setStep(0)
    setRevealed(new Set())
    setWrongId(null)
    setAttempts({})
    setRoundNumber(2)
    setPhase('quiz')
  }

  const handleClick = partId => {
    if (phase !== 'quiz' || done || revealed.has(partId)) return
    if (partId === currentId) {
      const nextRevealed = new Set(revealed)
      nextRevealed.add(partId)
      setRevealed(nextRevealed)
      setWrongId(null)
      if (step + 1 >= order.length) {
        finishRound(attempts)
      }
      setStep(s => s + 1)
    } else {
      setWrongId(partId)
      setAttempts(a => ({ ...a, [currentId]: (a[currentId] || 0) + 1 }))
      setTimeout(() => setWrongId(null), 450)
    }
  }

  const cls = id => `cp-hit ${revealed.has(id) ? 'cp-found' : ''} ${wrongId === id ? 'cp-wrong' : ''}`

  if (phase === 'round1-summary') {
    const struggling = ALL_IDS
      .filter(id => (lastRoundAttempts[id] || 0) > 0)
      .sort((a, b) => (lastRoundAttempts[b] || 0) - (lastRoundAttempts[a] || 0))
    return (
      <div className="cp-activity">
        <p className="cp-prompt">🎯 Round 1 complete! Found: {PARTS.length} / {PARTS.length}</p>
        <div className="cp-feedback-list">
          {PARTS
            .slice()
            .sort((a, b) => (lastRoundAttempts[b.id] || 0) - (lastRoundAttempts[a.id] || 0))
            .map(p => {
              const misses = lastRoundAttempts[p.id] || 0
              return (
                <div key={p.id} className={`cp-feedback-row ${misses > 0 ? 'cp-feedback-missed' : 'cp-feedback-clean'}`}>
                  <span>{p.label}</span>
                  <span>{misses === 0 ? '✓ first try' : `${misses} wrong attempt${misses > 1 ? 's' : ''}`}</span>
                </div>
              )
            })}
        </div>
        <p className="cp-review-note">
          Let's review the {struggling.length} part{struggling.length > 1 ? 's' : ''} that took more tries:{' '}
          <strong>{struggling.map(id => PARTS.find(p => p.id === id).label).join(', ')}</strong>
        </p>
        <button className="cp-new-btn cp-review-btn" onClick={startReview}>▶ Start Review Round</button>
      </div>
    )
  }

  if (phase === 'final-summary') {
    const wasPerfect = roundNumber === 1
    return (
      <div className="cp-activity">
        <p className="cp-prompt cp-prompt-done">
          {wasPerfect
            ? `🎉 Perfect! You identified all ${PARTS.length} parts on the first try.`
            : '🎉 Review complete! Nice work getting those down.'}
        </p>
        <button className="cp-new-btn" onClick={newRound}>🔄 New Round</button>
      </div>
    )
  }

  return (
    <div className="cp-activity">
      {roundNumber === 2 && <div className="cp-progress cp-review-badge">Review Round</div>}
      {!done ? (
        <p className="cp-prompt">
          Click the <strong>{currentPart.label.toUpperCase()}</strong> on the diagram
        </p>
      ) : (
        <p className="cp-prompt cp-prompt-done">🎉 Round complete!</p>
      )}

      <div className="cp-progress">Found: {step} / {order.length}</div>

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
