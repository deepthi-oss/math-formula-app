import { useState } from 'react'

const CX = 160, CY = 160, R = 110, ARM_SPAN = 54

const deg2pt = deg => {
  const rad = (deg * Math.PI) / 180
  return { x: CX + R * Math.cos(rad), y: CY + R * Math.sin(rad) }
}

const POSITIONS = [
  { bisector: 90 },
  { bisector: 220 },
  { bisector: 320 },
]

const CHOICES = [
  { id: 'same', label: 'Stay the Same' },
  { id: 'bigger', label: 'Get Bigger' },
  { id: 'smaller', label: 'Get Smaller' },
]

function Statue({ bisector }) {
  const armA = deg2pt(bisector - ARM_SPAN / 2)
  const armB = deg2pt(bisector + ARM_SPAN / 2)
  const chordLen = Math.hypot(armA.x - armB.x, armA.y - armB.y)

  return (
    <>
      <svg viewBox="0 0 320 320" className="sst-svg">
        <circle cx={CX} cy={CY} r={R} className="sst-room" />
        {Array.from({ length: 12 }).map((_, i) => {
          const p = deg2pt(i * 30)
          return <line key={i} x1={CX} y1={CY} x2={p.x} y2={p.y} className="sst-floor-line" />
        })}
        <circle cx={CX} cy={CY} r={R} className="sst-room-edge" />

        <line x1={160} y1={165} x2={armA.x} y2={armA.y} className="sst-arm" />
        <line x1={160} y1={165} x2={armB.x} y2={armB.y} className="sst-arm" />
        <circle cx={armA.x} cy={armA.y} r="9" className="sst-hand" />
        <circle cx={armB.x} cy={armB.y} r="9" className="sst-hand" />

        <line x1={armA.x} y1={armA.y} x2={armB.x} y2={armB.y} className="sst-chord" />

        <ellipse cx="160" cy="184" rx="15" ry="21" className="sst-body" />
        <circle cx="160" cy="150" r="17" className="sst-head" />
        <circle cx="153" cy="149" r="2.5" className="sst-eye" />
        <circle cx="167" cy="149" r="2.5" className="sst-eye" />
        <circle cx="147" cy="155" r="4" className="sst-cheek" />
        <circle cx="173" cy="155" r="4" className="sst-cheek" />
        <path d="M 152 157 Q 160 162 168 157" className="sst-smile" />
        <path d="M 160 133 Q 152 122 160 118" className="sst-antenna" />
        <circle cx="160" cy="118" r="3" className="sst-antenna-tip" />
      </svg>
      <div className="sst-stats">
        <span>Arm stretch: <strong>{ARM_SPAN}°</strong></span>
        <span className="sst-ruler-row">
          Hand-to-hand gap: <span className="sst-ruler" style={{ width: Math.round(chordLen) + 'px' }} />
        </span>
      </div>
    </>
  )
}

export default function SpinningStatueActivity() {
  const [phase, setPhase] = useState('intro')
  const [posIndex, setPosIndex] = useState(1)
  const [guess, setGuess] = useState(null)

  const startSpin = () => setPhase('predict')

  const pickGuess = id => {
    if (phase !== 'predict') return
    setGuess(id)
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
      <div className="sst-activity">
        <p className="sst-done-banner">
          🎉 Spin after spin, as long as the little statue's arms stayed stretched at {ARM_SPAN}°, its hands always
          landed exactly the same distance apart! That's the rule: <strong>equal angles at the centre always make
          equal chords.</strong>
        </p>
        <button className="sst-new-btn" onClick={restart}>🔄 Spin It Again From the Start</button>
      </div>
    )
  }

  const correct = guess === 'same'

  return (
    <div className="sst-activity">
      <div className="sst-stepper">Spin {posIndex + 1} / {POSITIONS.length}</div>

      {phase === 'intro' && (
        <>
          <p className="sst-instruction">
            🧍 Meet the little circle statue! It's standing at the exact centre of a round room, with its arms
            stretched out wide to touch the walls on both sides — always at the same {ARM_SPAN}° angle.
          </p>
          <Statue bisector={POSITIONS[0].bisector} />
          <button className="sst-btn" onClick={startSpin}>🌀 Now Make It Spin!</button>
        </>
      )}

      {(phase === 'predict' || phase === 'reveal') && (
        <>
          <p className="sst-instruction">
            The statue spins to face a new direction — but it never changes how far apart its arms are stretched,
            still exactly {ARM_SPAN}°. What happens to the gap between its two hands?
          </p>
          <div className={phase === 'predict' ? 'sst-dimmed' : ''}>
            <Statue bisector={POSITIONS[posIndex].bisector} />
          </div>

          {phase === 'predict' && (
            <div className="sst-choices">
              {CHOICES.map(c => (
                <button key={c.id} className="sst-choice-btn" onClick={() => pickGuess(c.id)}>{c.label}</button>
              ))}
            </div>
          )}

          {phase === 'reveal' && (
            <div className="sst-insight">
              <p className={correct ? 'sst-feedback-correct' : 'sst-feedback-wrong'}>
                {correct
                  ? '✓ Exactly right — the gap stayed the same!'
                  : `Not quite — you guessed it would ${CHOICES.find(c => c.id === guess).label.toLowerCase()}, but it stayed exactly the same.`}
              </p>
              <button className="sst-next-btn" onClick={nextRound}>
                {posIndex + 1 >= POSITIONS.length ? 'See the Rule →' : 'Spin Again →'}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
