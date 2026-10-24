import { useState } from 'react'

const CX = 160, CY = 160, R = 110

const deg2pt = deg => {
  const rad = (deg * Math.PI) / 180
  return { x: CX + R * Math.cos(rad), y: CY + R * Math.sin(rad) }
}

const ROUNDS = [
  { aDeg: 20, bDeg: 140 },
  { aDeg: 200, bDeg: 320 },
]

const CHOICES = [
  { id: 'lean', label: 'It Will Lean to One Side' },
  { id: 'straight', label: 'It Will Stand at a Perfect Right Angle' },
]

function unit(v) {
  const len = Math.hypot(v.x, v.y) || 1
  return { x: v.x / len, y: v.y / len }
}

function FlagpoleDiagram({ aDeg, bDeg, revealed }) {
  const A = deg2pt(aDeg)
  const B = deg2pt(bDeg)
  const M = { x: (A.x + B.x) / 2, y: (A.y + B.y) / 2 }
  const dirChord = unit({ x: B.x - A.x, y: B.y - A.y })
  const dirPole = unit({ x: CX - M.x, y: CY - M.y })
  const size = 14
  const p1 = { x: M.x + dirChord.x * size, y: M.y + dirChord.y * size }
  const p2 = { x: p1.x + dirPole.x * size, y: p1.y + dirPole.y * size }
  const p3 = { x: M.x + dirPole.x * size, y: M.y + dirPole.y * size }
  const flagMid = { x: M.x + dirPole.x * 32, y: M.y + dirPole.y * 32 }
  const flagPerp = { x: -dirPole.y, y: dirPole.x }

  return (
    <svg viewBox="0 0 320 320" className="fpm-svg">
      <circle cx={CX} cy={CY} r={R} className="fpm-field" />
      <line x1={A.x} y1={A.y} x2={B.x} y2={B.y} className="fpm-chord" />
      <line x1={CX} y1={CY} x2={M.x} y2={M.y} className={`fpm-pole ${revealed ? 'fpm-pole-up' : ''}`} />
      {revealed && (
        <>
          <path d={`M ${p1.x} ${p1.y} L ${p2.x} ${p2.y} L ${p3.x} ${p3.y}`} className="fpm-right-angle" />
          <polygon
            points={`${flagMid.x},${flagMid.y} ${flagMid.x + flagPerp.x * 16},${flagMid.y + flagPerp.y * 16} ${flagMid.x - dirPole.x * 10},${flagMid.y - dirPole.y * 10}`}
            className="fpm-flag"
          />
        </>
      )}
      <circle cx={CX} cy={CY} r="7" className="fpm-post" />
      <circle cx={M.x} cy={M.y} r="6" className="fpm-midpoint" />
      <circle cx={A.x} cy={A.y} r="5" className="fpm-endpoint" />
      <circle cx={B.x} cy={B.y} r="5" className="fpm-endpoint" />
    </svg>
  )
}

export default function FlagpoleMidpointActivity() {
  const [step, setStep] = useState(0)
  const [phase, setPhase] = useState('predict')
  const [guess, setGuess] = useState(null)

  const done = step >= ROUNDS.length

  const restart = () => {
    setStep(0)
    setPhase('predict')
    setGuess(null)
  }

  const pick = id => {
    if (phase !== 'predict') return
    setGuess(id)
    setPhase('reveal')
  }

  const next = () => {
    if (step + 1 >= ROUNDS.length) {
      setStep(ROUNDS.length)
    } else {
      setStep(s => s + 1)
      setPhase('predict')
      setGuess(null)
    }
  }

  if (done) {
    return (
      <div className="fpm-activity">
        <p className="fpm-done-banner">
          🎉 No matter where the chord sits, a flagpole planted at its midpoint — pointing straight to the centre —
          always stands at a perfect right angle to the chord! The line from the centre to a chord's midpoint is
          always <strong>perpendicular</strong> to it.
        </p>
        <button className="fpm-new-btn" onClick={restart}>🔄 Go Through It Again</button>
      </div>
    )
  }

  const round = ROUNDS[step]
  const correct = guess === 'straight'

  return (
    <div className="fpm-activity">
      <div className="fpm-stepper">Field {step + 1} / {ROUNDS.length}</div>
      <p className="fpm-instruction">
        {step === 0
          ? "Here's a fence (a chord) across a round field, and the midpoint of the fence, M. If we plant a flagpole at M, running it straight to the centre post — what will it look like?"
          : "A new fence, a new midpoint. Will the flagpole behave the same way this time?"}
      </p>

      <FlagpoleDiagram aDeg={round.aDeg} bDeg={round.bDeg} revealed={phase === 'reveal'} />

      {phase === 'predict' && (
        <div className="fpm-choices">
          {CHOICES.map(c => (
            <button key={c.id} className="fpm-choice-btn" onClick={() => pick(c.id)}>{c.label}</button>
          ))}
        </div>
      )}

      {phase === 'reveal' && (
        <div className="fpm-insight">
          <p className={correct ? 'fpm-feedback-correct' : 'fpm-feedback-wrong'}>
            {correct ? '✓ Exactly right — a perfect right angle!' : 'Not quite — it actually stands at a perfect right angle, every time.'}
          </p>
          <p className="fpm-term-note">
            AB is the base of an isosceles triangle (CA = CB, both radii), and M is its midpoint — so CM splits it
            into two identical triangles. That forces both angles at M to be exactly 90°.
          </p>
          <button className="fpm-next-btn" onClick={next}>
            {step + 1 >= ROUNDS.length ? 'See the Rule →' : 'Try Another Field →'}
          </button>
        </div>
      )}
    </div>
  )
}
