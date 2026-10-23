import { useState } from 'react'

const dist = (p, q) => Math.hypot(p.x - q.x, p.y - q.y)

const TRIANGLES = [
  {
    id: 'acute',
    name: 'Triangle 1',
    points: [{ x: 160, y: 70 }, { x: 80, y: 230 }, { x: 240, y: 230 }],
    center: { x: 160, y: 170 },
    answer: 'inside',
    bisectors: [
      { x1: 60, y1: 120, x2: 260, y2: 220 },
      { x1: 60, y1: 220, x2: 260, y2: 120 },
    ],
    insight: "This triangle's three angles are all sharp (less than 90°) — mathematicians call it an acute triangle. For an acute triangle, the center always lands INSIDE.",
  },
  {
    id: 'right',
    name: 'Triangle 2',
    points: [{ x: 80, y: 90 }, { x: 80, y: 230 }, { x: 240, y: 230 }],
    center: { x: 160, y: 160 },
    answer: 'edge',
    bisectors: [
      { x1: 20, y1: 160, x2: 300, y2: 160 },
      { x1: 160, y1: 290, x2: 160, y2: 30 },
    ],
    insight: 'This triangle has one square (90°) corner — a right-angled triangle. The center always lands EXACTLY on the middle of the longest side (the one opposite the square corner).',
  },
  {
    id: 'obtuse',
    name: 'Triangle 3',
    points: [{ x: 160, y: 170 }, { x: 50, y: 100 }, { x: 270, y: 100 }],
    center: { x: 160, y: 48.6 },
    answer: 'outside',
    bisectors: [
      { x1: 160, y1: -10, x2: 160, y2: 200 },
      { x1: 60, y1: 205.7, x2: 180, y2: 17.2 },
    ],
    insight: 'This triangle has one wide, blunt corner (more than 90°) — an obtuse triangle. For an obtuse triangle, the center lands OUTSIDE the triangle altogether.',
  },
]

const CHOICES = [
  { id: 'inside', label: 'Inside the triangle' },
  { id: 'edge', label: 'Exactly on one of the sides' },
  { id: 'outside', label: 'Outside the triangle' },
]

export default function CircumcenterLocationActivity() {
  const [step, setStep] = useState(0)
  const [guess, setGuess] = useState(null)
  const [revealed, setRevealed] = useState(false)

  const done = step >= TRIANGLES.length
  const tri = TRIANGLES[step] || TRIANGLES[0]

  const restart = () => {
    setStep(0)
    setGuess(null)
    setRevealed(false)
  }

  const nextTriangle = () => {
    setStep(s => s + 1)
    setGuess(null)
    setRevealed(false)
  }

  const pickGuess = choiceId => {
    if (revealed) return
    setGuess(choiceId)
    setRevealed(true)
  }

  if (done) {
    return (
      <div className="ccl-activity">
        <p className="ccl-done-banner">
          🎉 You found the pattern! Acute triangle → center inside. Right-angled triangle → center exactly on the
          middle of the longest side. Obtuse triangle → center outside.
        </p>
        <button className="ccl-new-btn" onClick={restart}>🔄 Go Through It Again</button>
      </div>
    )
  }

  const pointsStr = tri.points.map(p => `${p.x},${p.y}`).join(' ')
  const correct = guess === tri.answer

  return (
    <div className="ccl-activity">
      <div className="ccl-stepper">{tri.name} ({step + 1} / {TRIANGLES.length})</div>
      <p className="ccl-instruction">
        Every triangle has one special point that is the exact same distance from all 3 corners — it's the center
        of the one circle that passes through all three corners. Where do you think this point will land on this
        triangle?
      </p>

      <svg viewBox="0 0 320 320" className="ccl-svg">
        <polygon points={pointsStr} className="ccl-triangle" />
        {revealed && (
          <>
            {tri.bisectors.map((b, i) => (
              <line key={i} x1={b.x1} y1={b.y1} x2={b.x2} y2={b.y2} className="ccl-bisector" />
            ))}
            <circle cx={tri.center.x} cy={tri.center.y} r={dist(tri.center, tri.points[0])} className="ccl-circle" />
            <circle cx={tri.center.x} cy={tri.center.y} r="6" className="ccl-center-dot" />
          </>
        )}
      </svg>

      {!revealed && (
        <div className="ccl-choices">
          {CHOICES.map(c => (
            <button key={c.id} className="ccl-choice-btn" onClick={() => pickGuess(c.id)}>{c.label}</button>
          ))}
        </div>
      )}

      {revealed && (
        <div className="ccl-insight">
          <p className={correct ? 'ccl-feedback-correct' : 'ccl-feedback-wrong'}>
            {correct
              ? `✓ You got it! The center really did land ${CHOICES.find(c => c.id === tri.answer).label.toLowerCase()}.`
              : `Not quite — you guessed "${CHOICES.find(c => c.id === guess).label}", but it actually landed ${CHOICES.find(c => c.id === tri.answer).label.toLowerCase()}.`}
          </p>
          <p className="ccl-term-note">{tri.insight}</p>
          <p className="ccl-term-note ccl-term-note-muted">
            (This special point has a name: the <strong>circumcenter</strong>. The circle through all three corners is
            the <strong>circumcircle</strong>.)
          </p>
          <button className="ccl-next-btn" onClick={nextTriangle}>
            {step + 1 >= TRIANGLES.length ? 'See the Pattern →' : 'Next Triangle →'}
          </button>
        </div>
      )}
    </div>
  )
}
