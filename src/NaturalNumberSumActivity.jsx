import { useState } from 'react'
import { randInt } from './apShared'

const UNIT = 16
const MAX_OVERSHOOT = 2
const N_MIN = 3
const N_MAX = 7

export default function NaturalNumberSumActivity() {
  const [n, setN] = useState(() => randInt(N_MIN, N_MAX))
  const [phase, setPhase] = useState('predict')
  const [guess, setGuess] = useState('')
  const [guessCorrect, setGuessCorrect] = useState(null)
  const [columns, setColumns] = useState(() => Array(n).fill(0))
  const [showReveal, setShowReveal] = useState(false)

  const targets = Array.from({ length: n }, (_, i) => i + 1)
  const actualSum = (n * (n + 1)) / 2
  const seriesText = n <= 4 ? targets.join(' + ') : `1 + 2 + 3 + ... + ${n}`
  const solved = columns.length === n && columns.every((c, i) => c === targets[i])

  const newChallenge = () => {
    const next = randInt(N_MIN, N_MAX)
    setN(next)
    setPhase('predict')
    setGuess('')
    setGuessCorrect(null)
    setColumns(Array(next).fill(0))
    setShowReveal(false)
  }

  const checkGuess = () => {
    const val = parseInt(guess, 10)
    setGuessCorrect(!Number.isNaN(val) && val === actualSum)
  }

  const startBuilding = () => setPhase('build')

  const addBlock = i => setColumns(cols => {
    const cap = targets[i] + MAX_OVERSHOOT
    if (cols[i] >= cap) return cols
    const next = [...cols]
    next[i] += 1
    return next
  })

  const removeBlock = i => setColumns(cols => {
    if (cols[i] <= 0) return cols
    const next = [...cols]
    next[i] -= 1
    return next
  })

  return (
    <div className="nn-activity">
      {phase === 'predict' && (
        <div className="sf-predict">
          <p className="sf-predict-question">
            What is <strong>{seriesText}</strong> — the sum of the first {n} natural numbers?
          </p>
          <div className="sf-predict-row">
            <input
              type="number"
              className="sf-predict-input"
              value={guess}
              onChange={e => { setGuess(e.target.value); setGuessCorrect(null) }}
              onKeyDown={e => e.key === 'Enter' && checkGuess()}
              placeholder="Your guess"
              autoFocus
            />
            <button className="sf-btn" onClick={checkGuess}>Check</button>
          </div>
          {guessCorrect !== null && (
            <div className={`sf-predict-feedback ${guessCorrect ? 'sf-feedback-correct' : 'sf-feedback-wrong'}`}>
              {guessCorrect
                ? `✓ Correct! 1+2+...+${n} = ${actualSum}`
                : `Not quite — the answer is ${actualSum}. Let's see why by building it.`}
            </div>
          )}
          {guessCorrect !== null && (
            <button className="sf-build-btn" onClick={startBuilding}>🧱 Now Build the Staircase →</button>
          )}
        </div>
      )}

      {(phase === 'build' || phase === 'done') && (
        <>
          <p className="pc-rule">
            Column 1 needs 1 block, column 2 needs 2 blocks, column 3 needs 3 blocks — each column needs one
            more block than the last. Tap <strong>+</strong> to build each column.
          </p>

          <div className="pc-columns-row">
            {targets.map((target, i) => {
              const count = columns[i] ?? 0
              const status = count === target ? 'match' : count > target ? 'over' : 'under'
              return (
                <div key={i} className="pc-col">
                  <div className={`pc-col-stack pc-col-${status}`}>
                    {Array.from({ length: count }).map((_, j) => (
                      <div key={j} className="pc-block" style={{ height: UNIT }} />
                    ))}
                  </div>
                  <span className={`pc-status-badge pc-status-${status}`}>
                    {status === 'match' ? '✓' : status === 'over' ? 'too many' : count}
                  </span>
                  <div className="pc-col-controls">
                    <button onClick={() => removeBlock(i)} disabled={count === 0}>−</button>
                    <button onClick={() => addBlock(i)} disabled={count >= target + MAX_OVERSHOOT}>+</button>
                  </div>
                  <span className="pc-col-index">Column {i + 1}</span>
                </div>
              )
            })}
          </div>

          {solved && (
            <div className="pc-solved-banner">
              🎉 Staircase built correctly! 1 + 2 + ... + {n} = {actualSum}
              {!showReveal && (
                <button className="pc-reveal-btn" onClick={() => setShowReveal(true)}>
                  ⟳ Reveal the Rectangle Proof
                </button>
              )}
            </div>
          )}

          {solved && showReveal && (
            <div className="pc-reveal">
              <div className="pc-reveal-bars">
                {targets.map((val, i) => {
                  const mirrored = targets[n - 1 - i]
                  return (
                    <div key={i} className="pc-reveal-col">
                      <div className="pc-reveal-seg pc-reveal-seg-mirror" style={{ height: mirrored * UNIT }} />
                      <div className="pc-reveal-seg pc-reveal-seg-main" style={{ height: val * UNIT }} />
                    </div>
                  )
                })}
              </div>
              <p className="pc-derivation">
                Every column now totals first + last = 1 + {n} = {n + 1}.
                Rectangle area = n × (n+1) = {n} × {n + 1} = {n * (n + 1)} → Sum = area ÷ 2 = {actualSum}
              </p>
            </div>
          )}
        </>
      )}

      <button className="pc-new-btn" onClick={newChallenge}>🔄 New Challenge</button>
    </div>
  )
}
