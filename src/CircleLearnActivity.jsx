import { useState } from 'react'

const CX = 160, CY = 160, R = 110
const deg2pt = deg => {
  const rad = (deg * Math.PI) / 180
  return { x: CX + R * Math.cos(rad), y: CY + R * Math.sin(rad) }
}
const atFrac = (deg, frac) => {
  const p = deg2pt(deg)
  return { x: CX + (p.x - CX) * frac, y: CY + (p.y - CY) * frac }
}

function Candidate({ id, correct, status, onPick, children }) {
  const cls = `cl-hit ${status === id ? 'cl-flash' : ''}`
  return (
    <g className={cls} data-candidate={id} data-correct={correct} onClick={() => onPick(id, correct)}>
      {children}
    </g>
  )
}

function BaseCircle({ children }) {
  return (
    <svg viewBox="0 0 320 320" className="cl-svg">
      <circle cx={CX} cy={CY} r={R} className="cl-base-circle" fill="none" />
      {children}
    </svg>
  )
}

const STEPS = [
  {
    id: 'center',
    title: 'Center',
    instruction: 'Click the point that is exactly the same distance from every edge of the circle.',
    insight: '✓ That\'s the center — every point on the circle is the same distance from here.',
  },
  {
    id: 'radius',
    title: 'Radius',
    instruction: 'Click the line that goes from the center to the edge of the circle.',
    insight: '✓ That\'s a radius — a segment joining the center to the circle\'s edge.',
  },
  {
    id: 'diameter',
    title: 'Diameter',
    instruction: 'Click the line that goes all the way across the circle, straight through the center.',
    insight: '✓ That\'s a diameter — always exactly twice the radius.',
  },
  {
    id: 'chord',
    title: 'Chord',
    instruction: 'Click the line joining two points on the circle that does NOT pass through the center.',
    insight: '✓ That\'s a chord. (Fun fact: a diameter is actually the longest possible chord!)',
  },
  {
    id: 'arc',
    title: 'Arc',
    instruction: 'Click the curved part of the boundary between the two dots — not the straight line.',
    insight: '✓ That\'s an arc — any portion of the circle\'s boundary.',
  },
  {
    id: 'circumference',
    title: 'Circumference',
    instruction: 'Click all 4 marker rings to trace the whole way around the circle.',
    insight: '✓ You went all the way around — that total distance is the circumference!',
  },
  {
    id: 'sector',
    title: 'Sector',
    instruction: 'Click the pizza-slice shape with two straight edges AND one curved edge.',
    insight: '✓ That\'s a sector — bounded by two radii and the arc between them.',
  },
  {
    id: 'segment',
    title: 'Segment',
    instruction: 'Click the region cut off by a single straight chord (not two radii).',
    insight: '✓ That\'s a segment — bounded by a chord and the arc it cuts off.',
  },
  {
    id: 'tangent',
    title: 'Tangent',
    instruction: 'Click the line that touches the circle at exactly ONE point — never crossing into it.',
    insight: '✓ That\'s a tangent — it touches the circle at exactly one point.',
  },
]

export default function CircleLearnActivity() {
  const [step, setStep] = useState(0)
  const [solved, setSolved] = useState(false)
  const [flashId, setFlashId] = useState(null)
  const [circRings, setCircRings] = useState(() => new Set())

  const current = STEPS[step]
  const done = step >= STEPS.length

  const pick = (id, correct) => {
    if (solved) return
    if (correct) {
      setSolved(true)
      setFlashId(null)
    } else {
      setFlashId(id)
      setTimeout(() => setFlashId(null), 400)
    }
  }

  const next = () => {
    setStep(s => s + 1)
    setSolved(false)
    setFlashId(null)
    setCircRings(new Set())
  }

  const restart = () => {
    setStep(0)
    setSolved(false)
    setFlashId(null)
    setCircRings(new Set())
  }

  const ringClick = angle => {
    if (solved) return
    const nextRings = new Set(circRings)
    nextRings.add(angle)
    setCircRings(nextRings)
    if (nextRings.size === 4) setSolved(true)
  }

  if (done) {
    return (
      <div className="cl-activity">
        <p className="cl-done-banner">🎉 You've discovered all {STEPS.length} parts of a circle — try "Spot the Part" next to test yourself!</p>
        <button className="cl-new-btn" onClick={restart}>🔄 Go Through It Again</button>
      </div>
    )
  }

  const RADIUS_OK = deg2pt(60)
  const RADIUS_SHORT = atFrac(150, 0.55)
  const RADIUS_FLOAT_A = { x: CX - 50, y: CY + 35 }
  const RADIUS_FLOAT_B = deg2pt(210)

  const DIA_OK_A = deg2pt(0), DIA_OK_B = deg2pt(180)
  const DIA_OFF_A = deg2pt(12), DIA_OFF_B = deg2pt(187)
  const DIA_SHORT_A = atFrac(0, 0.3), DIA_SHORT_B = atFrac(180, 0.3)

  const CH_OK_A = deg2pt(150), CH_OK_B = deg2pt(230)
  const CH_FLOAT_A = { x: 30, y: 30 }, CH_FLOAT_B = { x: 90, y: 30 }

  const ARC_PT_A = deg2pt(20), ARC_PT_B = deg2pt(100)

  const RINGS = [0, 90, 180, 270].map(a => ({ a, pt: deg2pt(a) }))

  const SEC_A = deg2pt(10), SEC_B = deg2pt(100)
  const TRI_A = deg2pt(105), TRI_B = deg2pt(195)

  const SEG_A = deg2pt(140), SEG_B = deg2pt(240)

  const TAN_PT = deg2pt(270)
  const SEC_LINE_A = deg2pt(40), SEC_LINE_B = deg2pt(260)
  const MISS_Y = CY - R - 30

  return (
    <div className="cl-activity">
      <div className="cl-stepper">Part {step + 1} / {STEPS.length}: <strong>{current.title}</strong></div>
      <p className="cl-instruction">{current.instruction}</p>

      {current.id === 'center' && (
        <BaseCircle>
          <Candidate id="correct" correct status={flashId} onPick={pick}>
            <circle cx={CX} cy={CY} r="20" fill="transparent" />
            <circle cx={CX} cy={CY} r="6" className="cl-dot" />
          </Candidate>
          <Candidate id="d1" correct={false} status={flashId} onPick={pick}>
            <circle cx={CX - 40} cy={CY - 20} r="20" fill="transparent" />
            <circle cx={CX - 40} cy={CY - 20} r="6" className="cl-dot" />
          </Candidate>
          <Candidate id="d2" correct={false} status={flashId} onPick={pick}>
            <circle cx={CX + 55} cy={CY + 40} r="20" fill="transparent" />
            <circle cx={CX + 55} cy={CY + 40} r="6" className="cl-dot" />
          </Candidate>
        </BaseCircle>
      )}

      {current.id === 'radius' && (
        <BaseCircle>
          <circle cx={CX} cy={CY} r="4" className="cl-dot" />
          <Candidate id="correct" correct status={flashId} onPick={pick}>
            <line x1={CX} y1={CY} x2={RADIUS_OK.x} y2={RADIUS_OK.y} stroke="transparent" strokeWidth="16" />
            <line x1={CX} y1={CY} x2={RADIUS_OK.x} y2={RADIUS_OK.y} className="cl-line" />
          </Candidate>
          <Candidate id="short" correct={false} status={flashId} onPick={pick}>
            <line x1={CX} y1={CY} x2={RADIUS_SHORT.x} y2={RADIUS_SHORT.y} stroke="transparent" strokeWidth="16" />
            <line x1={CX} y1={CY} x2={RADIUS_SHORT.x} y2={RADIUS_SHORT.y} className="cl-line" />
          </Candidate>
          <Candidate id="float" correct={false} status={flashId} onPick={pick}>
            <line x1={RADIUS_FLOAT_A.x} y1={RADIUS_FLOAT_A.y} x2={RADIUS_FLOAT_B.x} y2={RADIUS_FLOAT_B.y} stroke="transparent" strokeWidth="16" />
            <line x1={RADIUS_FLOAT_A.x} y1={RADIUS_FLOAT_A.y} x2={RADIUS_FLOAT_B.x} y2={RADIUS_FLOAT_B.y} className="cl-line" />
          </Candidate>
        </BaseCircle>
      )}

      {current.id === 'diameter' && (
        <BaseCircle>
          <circle cx={CX} cy={CY} r="4" className="cl-dot" />
          <Candidate id="correct" correct status={flashId} onPick={pick}>
            <line x1={DIA_OK_A.x} y1={DIA_OK_A.y} x2={DIA_OK_B.x} y2={DIA_OK_B.y} stroke="transparent" strokeWidth="16" />
            <line x1={DIA_OK_A.x} y1={DIA_OK_A.y} x2={DIA_OK_B.x} y2={DIA_OK_B.y} className="cl-line" />
          </Candidate>
          <Candidate id="offcenter" correct={false} status={flashId} onPick={pick}>
            <line x1={DIA_OFF_A.x} y1={DIA_OFF_A.y} x2={DIA_OFF_B.x} y2={DIA_OFF_B.y} stroke="transparent" strokeWidth="16" />
            <line x1={DIA_OFF_A.x} y1={DIA_OFF_A.y} x2={DIA_OFF_B.x} y2={DIA_OFF_B.y} className="cl-line" />
          </Candidate>
          <Candidate id="short" correct={false} status={flashId} onPick={pick}>
            <line x1={DIA_SHORT_A.x} y1={DIA_SHORT_A.y} x2={DIA_SHORT_B.x} y2={DIA_SHORT_B.y} stroke="transparent" strokeWidth="16" />
            <line x1={DIA_SHORT_A.x} y1={DIA_SHORT_A.y} x2={DIA_SHORT_B.x} y2={DIA_SHORT_B.y} className="cl-line" />
          </Candidate>
        </BaseCircle>
      )}

      {current.id === 'chord' && (
        <BaseCircle>
          <circle cx={CX} cy={CY} r="4" className="cl-dot" />
          <Candidate id="correct" correct status={flashId} onPick={pick}>
            <line x1={CH_OK_A.x} y1={CH_OK_A.y} x2={CH_OK_B.x} y2={CH_OK_B.y} stroke="transparent" strokeWidth="16" />
            <line x1={CH_OK_A.x} y1={CH_OK_A.y} x2={CH_OK_B.x} y2={CH_OK_B.y} className="cl-line" />
          </Candidate>
          <Candidate id="diameter" correct={false} status={flashId} onPick={pick}>
            <line x1={DIA_OK_A.x} y1={DIA_OK_A.y} x2={DIA_OK_B.x} y2={DIA_OK_B.y} stroke="transparent" strokeWidth="16" />
            <line x1={DIA_OK_A.x} y1={DIA_OK_A.y} x2={DIA_OK_B.x} y2={DIA_OK_B.y} className="cl-line" />
          </Candidate>
          <Candidate id="floating" correct={false} status={flashId} onPick={pick}>
            <line x1={CH_FLOAT_A.x} y1={CH_FLOAT_A.y} x2={CH_FLOAT_B.x} y2={CH_FLOAT_B.y} stroke="transparent" strokeWidth="16" />
            <line x1={CH_FLOAT_A.x} y1={CH_FLOAT_A.y} x2={CH_FLOAT_B.x} y2={CH_FLOAT_B.y} className="cl-line" />
          </Candidate>
        </BaseCircle>
      )}

      {current.id === 'arc' && (
        <BaseCircle>
          <circle cx={ARC_PT_A.x} cy={ARC_PT_A.y} r="4" className="cl-dot" />
          <circle cx={ARC_PT_B.x} cy={ARC_PT_B.y} r="4" className="cl-dot" />
          <Candidate id="chord" correct={false} status={flashId} onPick={pick}>
            <line x1={ARC_PT_A.x} y1={ARC_PT_A.y} x2={ARC_PT_B.x} y2={ARC_PT_B.y} stroke="transparent" strokeWidth="16" />
            <line x1={ARC_PT_A.x} y1={ARC_PT_A.y} x2={ARC_PT_B.x} y2={ARC_PT_B.y} className="cl-line" />
          </Candidate>
          <Candidate id="correct" correct status={flashId} onPick={pick}>
            <path d={`M ${ARC_PT_A.x} ${ARC_PT_A.y} A ${R} ${R} 0 0 1 ${ARC_PT_B.x} ${ARC_PT_B.y}`} stroke="transparent" strokeWidth="18" fill="none" />
            <path d={`M ${ARC_PT_A.x} ${ARC_PT_A.y} A ${R} ${R} 0 0 1 ${ARC_PT_B.x} ${ARC_PT_B.y}`} className="cl-line cl-line-arc" fill="none" />
          </Candidate>
        </BaseCircle>
      )}

      {current.id === 'circumference' && (
        <BaseCircle>
          {circRings.size === 4 && <circle cx={CX} cy={CY} r={R} className="cl-base-circle cl-full-ring" fill="none" />}
          {RINGS.map(({ a, pt }) => (
            <g key={a} className={`cl-hit ${circRings.has(a) ? 'cl-ring-done' : ''}`} onClick={() => ringClick(a)}>
              <circle cx={pt.x} cy={pt.y} r="16" fill="transparent" />
              <circle cx={pt.x} cy={pt.y} r="7" className="cl-ring" />
            </g>
          ))}
        </BaseCircle>
      )}

      {current.id === 'sector' && (
        <BaseCircle>
          <circle cx={CX} cy={CY} r="4" className="cl-dot" />
          <Candidate id="correct" correct status={flashId} onPick={pick}>
            <path
              d={`M ${CX} ${CY} L ${SEC_A.x} ${SEC_A.y} A ${R} ${R} 0 0 1 ${SEC_B.x} ${SEC_B.y} Z`}
              className="cl-fill"
            />
          </Candidate>
          <Candidate id="triangle" correct={false} status={flashId} onPick={pick}>
            <path
              d={`M ${CX} ${CY} L ${TRI_A.x} ${TRI_A.y} L ${TRI_B.x} ${TRI_B.y} Z`}
              className="cl-fill"
            />
          </Candidate>
        </BaseCircle>
      )}

      {current.id === 'segment' && (
        <BaseCircle>
          <Candidate id="correct" correct status={flashId} onPick={pick}>
            <path
              d={`M ${SEG_A.x} ${SEG_A.y} A ${R} ${R} 0 0 1 ${SEG_B.x} ${SEG_B.y} Z`}
              className="cl-fill"
            />
          </Candidate>
          <Candidate id="sector" correct={false} status={flashId} onPick={pick}>
            <path
              d={`M ${CX} ${CY} L ${SEC_A.x} ${SEC_A.y} A ${R} ${R} 0 0 1 ${SEC_B.x} ${SEC_B.y} Z`}
              className="cl-fill"
            />
          </Candidate>
        </BaseCircle>
      )}

      {current.id === 'tangent' && (
        <BaseCircle>
          <Candidate id="correct" correct status={flashId} onPick={pick}>
            <line x1={TAN_PT.x - 55} y1={TAN_PT.y} x2={TAN_PT.x + 55} y2={TAN_PT.y} stroke="transparent" strokeWidth="16" />
            <line x1={TAN_PT.x - 55} y1={TAN_PT.y} x2={TAN_PT.x + 55} y2={TAN_PT.y} className="cl-line" />
          </Candidate>
          <Candidate id="secant" correct={false} status={flashId} onPick={pick}>
            <line x1={SEC_LINE_A.x - 20} y1={SEC_LINE_A.y - 8} x2={SEC_LINE_B.x + 20} y2={SEC_LINE_B.y + 8} stroke="transparent" strokeWidth="16" />
            <line x1={SEC_LINE_A.x - 20} y1={SEC_LINE_A.y - 8} x2={SEC_LINE_B.x + 20} y2={SEC_LINE_B.y + 8} className="cl-line" />
          </Candidate>
          <Candidate id="miss" correct={false} status={flashId} onPick={pick}>
            <line x1={CX - 70} y1={MISS_Y} x2={CX + 70} y2={MISS_Y} stroke="transparent" strokeWidth="16" />
            <line x1={CX - 70} y1={MISS_Y} x2={CX + 70} y2={MISS_Y} className="cl-line" />
          </Candidate>
        </BaseCircle>
      )}

      {solved && (
        <div className="cl-insight">
          <p>{current.insight}</p>
          <button className="cl-next-btn" onClick={next}>
            {step + 1 >= STEPS.length ? 'Finish →' : 'Next Part →'}
          </button>
        </div>
      )}
    </div>
  )
}
