import { useState } from 'react'

const CX = 160, CY = 160, R = 110

const deg2pt = deg => {
  const rad = (deg * Math.PI) / 180
  return { x: CX + R * Math.cos(rad), y: CY + R * Math.sin(rad) }
}
const lerp = (p, q, t) => ({ x: p.x + (q.x - p.x) * t, y: p.y + (q.y - p.y) * t })

const ROUNDS = [
  { aDeg: 60, bDeg: 160, fracs: [0.15, 0.5, 0.85] },
  { aDeg: 190, bDeg: 290, fracs: [0.15, 0.85, 0.5] },
  { aDeg: 0, bDeg: 100, fracs: [0.5, 0.15, 0.85] },
  { aDeg: 130, bDeg: 250, fracs: [0.85, 0.5, 0.15] },
]

function unit(v) {
  const len = Math.hypot(v.x, v.y) || 1
  return { x: v.x / len, y: v.y / len }
}

export default function RightAngleDetectiveActivity() {
  const [round, setRound] = useState(0)
  const [solved, setSolved] = useState(false)
  const [wrongIdx, setWrongIdx] = useState(null)
  const [score, setScore] = useState(0)

  const done = round >= ROUNDS.length

  const restart = () => {
    setRound(0)
    setSolved(false)
    setWrongIdx(null)
    setScore(0)
  }

  if (done) {
    return (
      <div className="rad-activity">
        <p className="rad-done-banner">
          🕵️ Case closed! You correctly spotted the true midpoint {score} / {ROUNDS.length} times — the one point
          on each chord that makes a perfect right angle with the centre.
        </p>
        <button className="rad-new-btn" onClick={restart}>🔄 New Cases</button>
      </div>
    )
  }

  const r = ROUNDS[round]
  const A = deg2pt(r.aDeg)
  const B = deg2pt(r.bDeg)
  const candidates = r.fracs.map((f, i) => ({ id: i, pt: lerp(A, B, f), isMid: Math.abs(f - 0.5) < 0.001 }))
  const correctCand = candidates.find(c => c.isMid)

  const pickCandidate = cand => {
    if (solved) return
    if (cand.isMid) {
      setSolved(true)
      setScore(s => s + 1)
    } else {
      setWrongIdx(cand.id)
      setTimeout(() => setWrongIdx(null), 450)
    }
  }

  const next = () => {
    setRound(r => r + 1)
    setSolved(false)
    setWrongIdx(null)
  }

  let rightAngleMarker = null
  if (solved) {
    const M = correctCand.pt
    const dirChord = unit({ x: B.x - A.x, y: B.y - A.y })
    const dirPerp = unit({ x: CX - M.x, y: CY - M.y })
    const size = 14
    const p1 = { x: M.x + dirChord.x * size, y: M.y + dirChord.y * size }
    const p2 = { x: p1.x + dirPerp.x * size, y: p1.y + dirPerp.y * size }
    const p3 = { x: M.x + dirPerp.x * size, y: M.y + dirPerp.y * size }
    rightAngleMarker = `M ${p1.x} ${p1.y} L ${p2.x} ${p2.y} L ${p3.x} ${p3.y}`
  }

  return (
    <div className="rad-activity">
      <div className="rad-stepper">🕵️ Case {round + 1} / {ROUNDS.length} · Score: {score}</div>
      <p className="rad-instruction">
        Only ONE of these three magnifying glasses sits on the true midpoint — the one point where a line to the
        centre makes a perfect right angle. Find it!
      </p>

      <svg viewBox="0 0 320 320" className="rad-svg">
        <circle cx={CX} cy={CY} r={R} className="rad-field" />
        <line x1={A.x} y1={A.y} x2={B.x} y2={B.y} className="rad-chord" />
        {solved && <line x1={CX} y1={CY} x2={correctCand.pt.x} y2={correctCand.pt.y} className="rad-pole" />}
        {solved && rightAngleMarker && <path d={rightAngleMarker} className="rad-right-angle" />}
        <circle cx={CX} cy={CY} r="7" className="rad-post" />
        <circle cx={A.x} cy={A.y} r="5" className="rad-endpoint" />
        <circle cx={B.x} cy={B.y} r="5" className="rad-endpoint" />
        {candidates.map(c => (
          <g
            key={c.id}
            className={`rad-hit ${solved && c.isMid ? 'rad-found' : ''} ${wrongIdx === c.id ? 'rad-wrong' : ''}`}
            onClick={() => pickCandidate(c)}
          >
            <circle cx={c.pt.x} cy={c.pt.y} r="18" fill="transparent" />
            <circle cx={c.pt.x} cy={c.pt.y} r="9" className="rad-lens" />
            <line x1={c.pt.x + 6} y1={c.pt.y + 6} x2={c.pt.x + 13} y2={c.pt.y + 13} className="rad-handle" />
          </g>
        ))}
      </svg>

      {solved && (
        <div className="rad-insight">
          <p className="rad-feedback-correct">✓ Found it! That's the midpoint — and the right angle proves it.</p>
          <button className="rad-next-btn" onClick={next}>
            {round + 1 >= ROUNDS.length ? 'Finish the Case File →' : 'Next Case →'}
          </button>
        </div>
      )}
    </div>
  )
}
