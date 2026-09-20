import { useState } from 'react'
import { generateAP } from './apShared'

const UNIT = 16
const MAX_OVERSHOOT = 2

function buildTargets(ap) {
  return Array.from({ length: ap.n }, (_, i) => ap.a + i * ap.d)
}

export default function APDragBuildActivity() {
  const [ap, setAp] = useState(() => generateAP())
  const [columns, setColumns] = useState(() => Array(ap.n).fill(0))
  const [showHints, setShowHints] = useState(false)
  const [showReveal, setShowReveal] = useState(false)
  const [dragOverIdx, setDragOverIdx] = useState(null)

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

  const handleDrop = (e, i) => {
    e.preventDefault()
    setDragOverIdx(null)
    addBlock(i)
  }

  return (
    <div className="db-activity">
      <div className="db-brief">
        <p className="db-rule">
          First term <strong>a = {ap.a}</strong>, each next column needs <strong>d = {ap.d}</strong> more blocks
          than the one before it. Drag blocks from the tray onto the right column — click a placed block to remove it.
        </p>
        <div className="db-brief-actions">
          <button className="db-link-btn" onClick={() => setShowHints(v => !v)}>
            {showHints ? '🙈 Hide Target Numbers' : '💡 Show Target Numbers'}
          </button>
          <button className="db-new-btn" onClick={newChallenge}>🔄 New Challenge</button>
        </div>
      </div>

      <div className="db-tray">
        <span className="db-tray-label">Block Tray</span>
        <div
          className="db-block-source"
          draggable
          onDragStart={e => e.dataTransfer.setData('text/plain', 'block')}
        >
          ⬛
        </div>
        <span className="db-tray-hint">drag me →</span>
      </div>

      <div className="db-columns-row">
        {targets.map((target, i) => {
          const count = columns[i]
          const status = count === target ? 'match' : count > target ? 'over' : 'under'
          return (
            <div key={i} className="db-col" data-idx={i}>
              <div
                className={`db-col-stack db-col-${status} ${dragOverIdx === i ? 'db-col-dragover' : ''}`}
                onDragOver={e => { e.preventDefault(); setDragOverIdx(i) }}
                onDragLeave={() => setDragOverIdx(null)}
                onDrop={e => handleDrop(e, i)}
              >
                {Array.from({ length: count }).map((_, j) => (
                  <div key={j} className="db-block" style={{ height: UNIT }} onClick={() => removeBlock(i)} />
                ))}
                {count === 0 && <span className="db-dropzone-hint">drop here</span>}
              </div>
              {showHints && <span className="db-target-hint">target: {target}</span>}
              <span className={`db-status-badge db-status-${status}`}>
                {status === 'match' ? '✓' : status === 'over' ? 'too many' : count}
              </span>
              <span className="db-col-index">Column {i + 1}</span>
            </div>
          )
        })}
      </div>

      {solved && (
        <div className="db-solved-banner">
          🎉 Staircase built correctly! Sequence: {targets.join(', ')}
          {!showReveal && (
            <button className="db-reveal-btn" onClick={() => setShowReveal(true)}>
              ⟳ Reveal the Rectangle Proof
            </button>
          )}
        </div>
      )}

      {solved && showReveal && (
        <div className="db-reveal">
          <div className="db-reveal-bars">
            {targets.map((val, i) => {
              const mirrored = targets[ap.n - 1 - i]
              return (
                <div key={i} className="db-reveal-col">
                  <div className="db-reveal-seg db-reveal-seg-mirror" style={{ height: mirrored * UNIT }} />
                  <div className="db-reveal-seg db-reveal-seg-main" style={{ height: val * UNIT }} />
                </div>
              )
            })}
          </div>
          <p className="db-derivation">
            Every column totals a + last = {ap.a} + {targets[ap.n - 1]} = {ap.a + targets[ap.n - 1]}.
            Rectangle area = n × (a+last) = {ap.n} × {ap.a + targets[ap.n - 1]} = {ap.n * (ap.a + targets[ap.n - 1])}
            {' '}→ Sum = area ÷ 2 = {(ap.n * (ap.a + targets[ap.n - 1])) / 2}
          </p>
        </div>
      )}
    </div>
  )
}
