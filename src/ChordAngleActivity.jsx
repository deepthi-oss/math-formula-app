import { useState } from 'react'

const CX = 160, CY = 160, R = 110, ARC_R = 28
const CHORD_ANGLE = 70

const deg2pt = (deg, r = R) => {
  const rad = (deg * Math.PI) / 180
  return { x: CX + r * Math.cos(rad), y: CY + r * Math.sin(rad) }
}

const POSITIONS = [
  { startDeg: 0 },
  { startDeg: 130 },
  { startDeg: 250 },
]

const CHOICES = [
  { id: 'same', label: 'Stay the Same' },
  { id: 'bigger', label: 'Get Bigger' },
  { id: 'smaller', label: 'Get Smaller' },
]

function WheelDiagram({ startDeg, dimmed }) {
  const A = deg2pt(startDeg)
  const B = deg2pt(startDeg + CHORD_ANGLE)
  const arcA = deg2pt(startDeg, ARC_R)
  const arcB = deg2pt(startDeg + CHORD_ANGLE, ARC_R)
  return (
    <svg viewBox="0 0 320 320" className={`cha-svg ${dimmed ? 'cha-dimmed' : ''}`}>
      <circle cx={CX} cy={CY} r={R} className="cha-wheel" />
      <line x1={CX} y1={CY} x2={A.x} y2={A.y} className="cha-spoke" />
      <line x1={CX} y1={CY} x2={B.x} y2={B.y} className="cha-spoke" />
      <line x1={A.x} y1={A.y} x2={B.x} y2={B.y} className="cha-chord" />
      <path d={`M ${arcA.x} ${arcA.y} A ${ARC_R} ${ARC_R} 0 0 1 ${arcB.x} ${arcB.y}`} className="cha-angle-arc" />
      <circle cx={CX} cy={CY} r="4" className="cha-hub" />
    </svg>
  )
}

export default function ChordAngleActivity() {
  const [phase, setPhase] = useState('intro') // intro | predict | reveal | done
  const [posIndex, setPosIndex] = useState(1)
  const [guess, setGuess] = useState(null)

  const startRotating = () => setPhase('predict')

  const pickGuess = choiceId => {
    if (phase !== 'predict') return
    setGuess(choiceId)
    setPhase('reveal')
  }

  const nextRound = () => {
    if (posIndex + 1 >= POSITIONS.length) {
      setPhase('done')
    } else {
      setPosIndex(i => i + 1)
      setGuess(null)
      setPhase('predict')
    }
  }

  const restart = () => {
    setPhase('intro')
    setPosIndex(1)
    setGuess(null)
  }

  if (phase === 'done') {
    return (
      <div className="cha-activity">
        <p className="cha-done-banner">
          🎉 No matter where you spin the thread around the wheel, it always makes the same {CHORD_ANGLE}° angle at
          the hub — because the thread is always the same length. That's why we say:{' '}
          <strong>equal chords subtend equal angles at the centre.</strong>
        </p>
        <button className="cha-new-btn" onClick={restart}>🔄 Go Through It Again</button>
      </div>
    )
  }

  const correct = guess === 'same'

  return (
    <div className="cha-activity">
      <div className="cha-stepper">Position {posIndex + 1} / {POSITIONS.length}</div>

      {phase === 'intro' && (
        <>
          <p className="cha-instruction">
            Think of a bicycle wheel. Tie a piece of thread between the tips of two spokes and pull it tight —
            that's a <strong>chord</strong>. It makes an angle at the hub (the centre).
          </p>
          <WheelDiagram startDeg={POSITIONS[0].startDeg} />
          <p className="cha-angle-readout">Angle at the hub: <strong>{CHORD_ANGLE}°</strong></p>
          <button className="cha-btn" onClick={startRotating}>Now Spin the Wheel →</button>
        </>
      )}

      {(phase === 'predict' || phase === 'reveal') && (
        <>
          <p className="cha-instruction">
            Imagine the thread slides to a new spot on the wheel — but it's still the exact same piece of thread,
            so it's still the exact same length. What happens to the angle it makes at the hub?
          </p>
          <WheelDiagram startDeg={POSITIONS[posIndex].startDeg} dimmed={phase === 'predict'} />

          {phase === 'predict' && (
            <div className="cha-choices">
              {CHOICES.map(c => (
                <button key={c.id} className="cha-choice-btn" onClick={() => pickGuess(c.id)}>{c.label}</button>
              ))}
            </div>
          )}

          {phase === 'reveal' && (
            <div className="cha-insight">
              <p className="cha-angle-readout">Angle at the hub: <strong>{CHORD_ANGLE}°</strong></p>
              <p className={correct ? 'cha-feedback-correct' : 'cha-feedback-wrong'}>
                {correct
                  ? '✓ Exactly right — it stayed the same!'
                  : `Not quite — you guessed it would ${CHOICES.find(c => c.id === guess).label.toLowerCase()}, but it stayed exactly the same.`}
              </p>
              <button className="cha-next-btn" onClick={nextRound}>
                {posIndex + 1 >= POSITIONS.length ? 'See the Rule →' : 'Spin It Again →'}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
