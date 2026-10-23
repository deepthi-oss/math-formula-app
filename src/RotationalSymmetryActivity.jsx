import { useState } from 'react'

const SHAPES = [
  { id: 'square', name: 'Square', points: '90,90 230,90 230,230 90,230', order: 4 },
  { id: 'equilateral', name: 'Equilateral Triangle', points: '160,65 242,205 78,205', order: 3 },
  { id: 'rectangle', name: 'Rectangle', points: '60,100 260,100 260,220 60,220', order: 2 },
  { id: 'pentagon', name: 'Regular Pentagon', points: '160,65 250.3,130.6 215.9,236.9 104.1,236.9 69.7,130.6', order: 5 },
  { id: 'irregular', name: 'Irregular Shape', points: '100,90 240,110 220,240 90,200', order: 1 },
]

export default function RotationalSymmetryActivity() {
  const [shapeIndex, setShapeIndex] = useState(0)
  const [phase, setPhase] = useState('predict') // 'predict' | 'spin' | 'revealed'
  const [guess, setGuess] = useState('')
  const [guessCorrect, setGuessCorrect] = useState(null)
  const [stepCount, setStepCount] = useState(0)
  const [justMatched, setJustMatched] = useState(false)

  const shape = SHAPES[shapeIndex]
  const done = shapeIndex >= SHAPES.length
  const totalSteps = shape ? shape.order * 2 : 0
  const stepAngle = shape ? 360 / totalSteps : 0
  const matchesSoFar = Math.floor(stepCount / 2)
  const isMatchStep = stepCount > 0 && stepCount % 2 === 0
  const finishedSpinning = stepCount >= totalSteps

  const restart = () => {
    setShapeIndex(0)
    setPhase('predict')
    setGuess('')
    setGuessCorrect(null)
    setStepCount(0)
    setJustMatched(false)
  }

  const nextShape = () => {
    setShapeIndex(i => i + 1)
    setPhase('predict')
    setGuess('')
    setGuessCorrect(null)
    setStepCount(0)
    setJustMatched(false)
  }

  const checkGuess = () => {
    const val = parseInt(guess, 10)
    setGuessCorrect(!Number.isNaN(val) && val === shape.order)
    setPhase('spin')
  }

  const rotateStep = () => {
    if (finishedSpinning) return
    const next = stepCount + 1
    setStepCount(next)
    if (next % 2 === 0) {
      setJustMatched(true)
      setTimeout(() => setJustMatched(false), 500)
    }
    if (next >= totalSteps) {
      setTimeout(() => setPhase('revealed'), 400)
    }
  }

  if (done) {
    return (
      <div className="rt-activity">
        <p className="rt-done-banner">🎉 You spun all {SHAPES.length} shapes all the way around!</p>
        <button className="rt-new-btn" onClick={restart}>🔄 New Round</button>
      </div>
    )
  }

  return (
    <div className="rt-activity">
      <div className="rt-stepper">Shape {shapeIndex + 1} / {SHAPES.length}: <strong>{shape.name}</strong></div>

      {phase === 'predict' && (
        <div className="rt-predict">
          <p className="rt-predict-q">
            How many times will this shape look exactly the same as you spin it all the way around once (360°)?
          </p>
          <svg viewBox="0 0 320 320" className="rt-svg">
            <polygon points={shape.points} className="rt-shape" />
          </svg>
          <div className="rt-predict-row">
            <input
              type="number"
              className="rt-predict-input"
              value={guess}
              onChange={e => setGuess(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && checkGuess()}
              placeholder="Your guess"
              autoFocus
            />
            <button className="rt-btn" onClick={checkGuess}>Check</button>
          </div>
        </div>
      )}

      {(phase === 'spin' || phase === 'revealed') && (
        <div className="rt-spin">
          {guessCorrect !== null && (
            <p className={`rt-guess-feedback ${guessCorrect ? 'rt-feedback-correct' : 'rt-feedback-wrong'}`}>
              You predicted {guess}. Let's spin it and count together!
            </p>
          )}

          <div className="rt-spin-stage">
            <svg viewBox="0 0 320 320" className={`rt-svg ${justMatched ? 'rt-svg-match' : ''}`}>
              <polygon
                points={shape.points}
                className="rt-shape"
                style={{ transformOrigin: '160px 160px', transform: `rotate(${stepCount * stepAngle}deg)` }}
              />
            </svg>
            {justMatched && <div className="rt-match-badge">✓ Match!</div>}
          </div>

          <div className="rt-spin-stats">
            <span>Angle turned: {Math.round(stepCount * stepAngle)}°</span>
            <span>Matches so far: {matchesSoFar}</span>
          </div>

          {phase === 'spin' && (
            <button className="rt-btn rt-rotate-btn" onClick={rotateStep} disabled={finishedSpinning}>
              ↻ Rotate {Math.round(stepAngle)}°
            </button>
          )}

          {phase === 'revealed' && (
            <div className="rt-reveal">
              <p className={guessCorrect ? 'rt-feedback-correct' : 'rt-feedback-wrong'}>
                {guessCorrect
                  ? `✓ Correct! The order of rotational symmetry is ${shape.order}.`
                  : `The actual order of rotational symmetry is ${shape.order} — you counted ${matchesSoFar} matches.`}
              </p>
              <button className="rt-next-btn" onClick={nextShape}>
                {shapeIndex + 1 >= SHAPES.length ? 'Finish →' : 'Next Shape →'}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
