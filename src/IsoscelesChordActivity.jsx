import { useState } from 'react'

const CX = 160, CY = 160, R = 110

const deg2pt = deg => {
  const rad = (deg * Math.PI) / 180
  return { x: CX + R * Math.cos(rad), y: CY + R * Math.sin(rad) }
}

const TRIANGLES = [
  { a: 200, b: 290 },
  { a: 30, b: 150 },
]
const PAIR_SPAN = 60
const PAIR = [
  { a: 10, b: 10 + PAIR_SPAN },
  { a: 190, b: 190 + PAIR_SPAN },
]

const SINGLE_CHOICES = [
  { id: 'oa_longer', label: 'The left string is longer' },
  { id: 'oa_shorter', label: 'The right string is longer' },
  { id: 'equal', label: 'Exactly the same length' },
]
const PAIR_CHOICES = [
  { id: 'same', label: 'Yes, exactly the same size' },
  { id: 'different', label: 'No, different sizes' },
]

function kitePath(p, colorClass) {
  return (
    <g transform={`translate(${p.x}, ${p.y})`}>
      <polygon points="0,-11 9,0 0,11 -9,0" className={colorClass} />
      <line x1="0" y1="11" x2="-4" y2="22" className="isc-tail" />
      <line x1="0" y1="11" x2="4" y2="22" className="isc-tail" />
    </g>
  )
}

function string(c, p, revealed) {
  const mid = { x: (c.x + p.x) / 2, y: (c.y + p.y) / 2 }
  const dx = p.x - c.x, dy = p.y - c.y
  const len = Math.hypot(dx, dy)
  const nx = -dy / len, ny = dx / len
  const bow = mid.x + nx * 8 + ',' + (mid.y + ny * 8)
  return (
    <path
      d={`M ${c.x} ${c.y} Q ${bow} ${p.x} ${p.y}`}
      className={`isc-string ${revealed ? 'isc-string-equal' : ''}`}
    />
  )
}

export default function IsoscelesChordActivity() {
  const [step, setStep] = useState(0) // 0,1 = single triangles, 2 = pair
  const [phase, setPhase] = useState('predict')
  const [guess, setGuess] = useState(null)

  const isPairStep = step === 2
  const done = step > 2

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
    setStep(s => s + 1)
    setPhase('predict')
    setGuess(null)
  }

  if (done) {
    return (
      <div className="isc-activity">
        <p className="isc-done-banner">
          🎉 Every kite string from the post is the same length — the radius! That's why a chord and the centre
          always make an <strong>isosceles triangle</strong>. And when two chords are the same length, their
          triangles are exact <strong>twins</strong> — perfectly congruent.
        </p>
        <button className="isc-new-btn" onClick={restart}>🔄 Go Through It Again</button>
      </div>
    )
  }

  const correct = isPairStep ? guess === 'same' : guess === 'equal'

  if (!isPairStep) {
    const tri = TRIANGLES[step]
    const A = deg2pt(tri.a), B = deg2pt(tri.b)
    const revealed = phase === 'reveal'
    return (
      <div className="isc-activity">
        <div className="isc-stepper">Kite {step + 1} / 2</div>
        <p className="isc-instruction">
          Imagine standing at a post in the park, flying two kites on strings. One string runs to the left kite,
          one to the right kite. Which string do you think is longer?
        </p>
        <svg viewBox="0 0 320 320" className="isc-svg">
          <circle cx={CX} cy={CY} r={R} className="isc-field" />
          {string({ x: CX, y: CY }, A, revealed)}
          {string({ x: CX, y: CY }, B, revealed)}
          <line x1={A.x} y1={A.y} x2={B.x} y2={B.y} className="isc-chord" />
          {kitePath(A, 'isc-kite-a')}
          {kitePath(B, 'isc-kite-b')}
          <circle cx={CX} cy={CY} r="7" className="isc-post" />
        </svg>

        {phase === 'predict' && (
          <div className="isc-choices">
            {SINGLE_CHOICES.map(c => (
              <button key={c.id} className="isc-choice-btn" onClick={() => pick(c.id)}>{c.label}</button>
            ))}
          </div>
        )}

        {phase === 'reveal' && (
          <div className="isc-insight">
            <p className={correct ? 'isc-feedback-correct' : 'isc-feedback-wrong'}>
              {correct ? '✓ Exactly right — both strings are the same length!' : "Not quite — both strings are actually the exact same length."}
            </p>
            <p className="isc-term-note">
              Both strings stretch from the post to the edge of the field — so they're both the same length, the
              <strong> radius</strong>. Two equal sides means this is an <strong>isosceles triangle</strong>.
            </p>
            <button className="isc-next-btn" onClick={next}>
              {step === 0 ? 'Try Another Kite →' : 'One More Thing →'}
            </button>
          </div>
        )}
      </div>
    )
  }

  const A1 = deg2pt(PAIR[0].a), B1 = deg2pt(PAIR[0].b)
  const A2 = deg2pt(PAIR[1].a), B2 = deg2pt(PAIR[1].b)
  const revealed = phase === 'reveal'

  return (
    <div className="isc-activity">
      <div className="isc-stepper">Twin Check</div>
      <p className="isc-instruction">
        Here are two different kite pairs on the same field — their strings aren't shown this time, but the
        distance between each pair of kites (the chord) is exactly the same. Will their triangles with the post be
        exactly the same size and shape?
      </p>
      <svg viewBox="0 0 320 320" className="isc-svg">
        <circle cx={CX} cy={CY} r={R} className="isc-field" />
        {revealed && (
          <>
            <polygon points={`${CX},${CY} ${A1.x},${A1.y} ${B1.x},${B1.y}`} className="isc-tri-fill" />
            <polygon points={`${CX},${CY} ${A2.x},${A2.y} ${B2.x},${B2.y}`} className="isc-tri-fill" />
          </>
        )}
        <line x1={A1.x} y1={A1.y} x2={B1.x} y2={B1.y} className="isc-chord" />
        <line x1={A2.x} y1={A2.y} x2={B2.x} y2={B2.y} className="isc-chord" />
        {kitePath(A1, 'isc-kite-a')}
        {kitePath(B1, 'isc-kite-b')}
        {kitePath(A2, 'isc-kite-a')}
        {kitePath(B2, 'isc-kite-b')}
        <circle cx={CX} cy={CY} r="7" className="isc-post" />
      </svg>

      {phase === 'predict' && (
        <div className="isc-choices">
          {PAIR_CHOICES.map(c => (
            <button key={c.id} className="isc-choice-btn" onClick={() => pick(c.id)}>{c.label}</button>
          ))}
        </div>
      )}

      {phase === 'reveal' && (
        <div className="isc-insight">
          <p className={correct ? 'isc-feedback-correct' : 'isc-feedback-wrong'}>
            {correct ? '✓ Exactly right — twins!' : 'Not quite — they really are exactly the same triangle, just spun to a new spot.'}
          </p>
          <p className="isc-term-note">
            Both triangles have two radius-length sides, and now their bases (the chords) match too — so by SAS,
            they're <strong>congruent</strong>. Equal chords always make congruent isosceles triangles.
          </p>
          <button className="isc-next-btn" onClick={next}>See the Rule →</button>
        </div>
      )}
    </div>
  )
}
