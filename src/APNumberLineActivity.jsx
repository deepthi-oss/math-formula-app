import { useState } from 'react'
import { generateAP, randInt } from './apShared'

function buildDistractors(correct, d) {
  const offsets = [-2 * d, -d, d, 2 * d, -1, 1, 2, -2].sort(() => Math.random() - 0.5)
  const vals = new Set()
  for (const off of offsets) {
    const v = correct + off
    if (v > 0 && v !== correct) vals.add(v)
    if (vals.size === 3) break
  }
  while (vals.size < 3) {
    const v = correct + randInt(1, 5) * (Math.random() < 0.5 ? -1 : 1)
    if (v > 0 && v !== correct) vals.add(v)
  }
  return [...vals]
}

export default function APNumberLineActivity() {
  const [ap, setAp] = useState(() => generateAP({ aMin: 1, aMax: 8, dMin: 2, dMax: 6, n: randInt(4, 6) }))
  const [revealed, setRevealed] = useState(1)
  const [options, setOptions] = useState(() => shuffleOptions(ap, 1))
  const [wrongPick, setWrongPick] = useState(null)
  const [justSolved, setJustSolved] = useState(false)

  function shuffleOptions(apVal, round) {
    const correct = apVal.a + round * apVal.d
    const distractors = buildDistractors(correct, apVal.d)
    return [correct, ...distractors].sort(() => Math.random() - 0.5)
  }

  const maxVal = ap.a + (ap.n - 1) * ap.d
  const minVal = ap.a
  const range = Math.max(1, maxVal - minVal)
  const terms = Array.from({ length: revealed }, (_, i) => ap.a + i * ap.d)
  const done = revealed >= ap.n

  const newChallenge = () => {
    const next = generateAP({ aMin: 1, aMax: 8, dMin: 2, dMax: 6, n: randInt(4, 6) })
    setAp(next)
    setRevealed(1)
    setOptions(shuffleOptions(next, 1))
    setWrongPick(null)
    setJustSolved(false)
  }

  const pick = val => {
    const correct = ap.a + revealed * ap.d
    if (val === correct) {
      setWrongPick(null)
      setJustSolved(true)
    } else {
      setWrongPick(val)
      setTimeout(() => setWrongPick(null), 500)
    }
  }

  const nextHop = () => {
    const round = revealed + 1
    setRevealed(round)
    setJustSolved(false)
    if (round < ap.n) setOptions(shuffleOptions(ap, round))
  }

  return (
    <div className="nl-activity">
      <p className="nl-rule">
        Start at <strong>a = {ap.a}</strong>. Each hop adds <strong>d = {ap.d}</strong>. Tap the correct landing spot for each hop.
      </p>

      <div className="nl-track-wrap">
        <div className="nl-track">
          <div className="nl-track-line" />
          {terms.map((val, i) => {
            const pct = (val - minVal) / range
            return (
              <div key={i} className="nl-point" style={{ left: `${pct * 100}%` }}>
                <span className="nl-point-dot" />
                <span className="nl-point-label">{val}</span>
              </div>
            )
          })}
        </div>
      </div>

      {!done && !justSolved && (
        <div className="nl-question">
          <p className="nl-question-text">Where does hop #{revealed + 1} land?</p>
          <div className="nl-options">
            {options.map((val, i) => (
              <button
                key={i}
                className={`nl-option ${wrongPick === val ? 'nl-option-wrong' : ''}`}
                onClick={() => pick(val)}
              >
                {val}
              </button>
            ))}
          </div>
        </div>
      )}

      {!done && justSolved && (
        <div className="nl-solved-row">
          <span className="nl-solved-msg">✓ Correct!</span>
          <button className="nl-next-btn" onClick={nextHop}>Next Hop →</button>
        </div>
      )}

      {done && (
        <div className="nl-done-banner">
          🎉 You built the full sequence: {terms.join(', ')}
          <p className="nl-formula">tn = a + (n-1) * d = {ap.a} + ({ap.n}-1) * {ap.d} = {terms[terms.length - 1]}</p>
        </div>
      )}

      <button className="nl-new-btn" onClick={newChallenge}>🔄 New Challenge</button>
    </div>
  )
}
