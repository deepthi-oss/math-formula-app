import { useState } from 'react'
import { generateAP } from './apShared'

const UNIT = 16
const MAX_OVERSHOOT = 2

function buildTargets(ap) {
  return Array.from({ length: ap.n }, (_, i) => ap.a + i * ap.d)
}

export default function APPredictCheckActivity() {
  const [ap, setAp] = useState(() => generateAP())
  const [columns, setColumns] = useState(() => Array(ap.n).fill(0))
  const [showHints, setShowHints] = useState(false)
  const [showReveal, setShowReveal] = useState(false)

  const targets = buildTargets(ap)
  const solved = columns.every((c, i) => c === targets[i])

  const newChallenge = () => {
    const next = generateAP()
    setAp(next)
    setColumns(Array(next.n).fill(0))
    setShowReveal(false)
  }

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
    <div className="pc-activity">
      <div className="pc-brief">
        <p className="pc-rule">
          First term <strong>a = {ap.a}</strong>, each next column has <strong>d = {ap.d}</strong> more blocks
          than the one before it. Work out how many blocks each column needs, then tap <strong>+</strong> to build it.
        </p>
        <div className="pc-brief-actions">
          <button className="pc-link-btn" onClick={() => setShowHints(v => !v)}>
            {showHints ? '🙈 Hide Target Numbers' : '💡 Show Target Numbers'}
          </button>
          <button className="pc-new-btn" onClick={newChallenge}>🔄 New Challenge</button>
        </div>
      </div>

      <div className="pc-columns-row">
        {targets.map((target, i) => {
          const count = columns[i]
          const status = count === target ? 'match' : count > target ? 'over' : 'under'
          return (
            <div key={i} className="pc-col">
              <div className={`pc-col-stack pc-col-${status}`}>
                {Array.from({ length: count }).map((_, j) => (
                  <div key={j} className="pc-block" style={{ height: UNIT }} />
                ))}
              </div>
              {showHints && <span className="pc-target-hint">target: {target}</span>}
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
          🎉 Staircase built correctly! Sequence: {targets.join(', ')}
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
              const mirrored = targets[ap.n - 1 - i]
              return (
                <div key={i} className="pc-reveal-col">
                  <div className="pc-reveal-seg pc-reveal-seg-mirror" style={{ height: mirrored * UNIT }} />
                  <div className="pc-reveal-seg pc-reveal-seg-main" style={{ height: val * UNIT }} />
                </div>
              )
            })}
          </div>
          <p className="pc-derivation">
            Every column totals a + last = {ap.a} + {targets[ap.n - 1]} = {ap.a + targets[ap.n - 1]}.
            Rectangle area = n × (a+last) = {ap.n} × {ap.a + targets[ap.n - 1]} = {ap.n * (ap.a + targets[ap.n - 1])}
            {' '}→ Sum = area ÷ 2 = {(ap.n * (ap.a + targets[ap.n - 1])) / 2}
          </p>
        </div>
      )}
    </div>
  )
}
