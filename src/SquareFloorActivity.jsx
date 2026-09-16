import { useState } from 'react'

const TILE = 26
const GAP = 3
const MIN_N = 1
const MAX_N = 12

export default function SquareFloorActivity() {
  const [n, setN] = useState(1)

  const expand = () => setN(v => Math.min(MAX_N, v + 1))
  const shrink = () => setN(v => Math.max(MIN_N, v - 1))

  const side = n * TILE + (n - 1) * GAP
  const squareNumber = n * n

  const sequence = Array.from({ length: n }, (_, i) => (i + 1) * (i + 1))

  return (
    <div className="square-floor-card">
      <div className="formula-box-header" style={{ background: '#FFFBEB' }}>
        <span className="formula-box-icon">🧱</span>
        <div>
          <h2 className="formula-box-title" style={{ color: '#F59E0B' }}>
            Expanding Square Floor
          </h2>
          <p className="formula-box-sub">Each tile is a 1 cm × 1 cm square — expand the floor to explore square numbers</p>
        </div>
      </div>

      <div className="square-floor-body">
        <div className="sf-controls">
          <button className="sf-btn sf-btn-shrink" onClick={shrink} disabled={n === MIN_N}>
            − Shrink Floor
          </button>
          <div className="sf-n-badge">n = {n}</div>
          <button className="sf-btn sf-btn-expand" onClick={expand} disabled={n === MAX_N}>
            + Expand Floor
          </button>
        </div>

        <div className="sf-stage">
          <div className="sf-breadth-col" style={{ height: side }}>
            <span className="sf-breadth-label">Breadth = {n} cm</span>
            <span className="sf-brace-v" style={{ height: side }} />
          </div>

          <div className="sf-grid-col">
            <div
              className="square-floor-grid"
              style={{
                gridTemplateColumns: `repeat(${n}, ${TILE}px)`,
                gridAutoRows: `${TILE}px`,
                gap: GAP,
                width: side,
              }}
            >
              {Array.from({ length: squareNumber }).map((_, i) => (
                <div key={i} className="square-floor-tile" />
              ))}
            </div>
            <span className="sf-brace-h" style={{ width: side }} />
            <span className="sf-length-label">Length = {n} cm</span>
          </div>
        </div>

        <div className="sf-stats">
          <div className="sf-stat">
            <span className="sf-stat-label">Natural number</span>
            <span className="sf-stat-value">n = {n}</span>
          </div>
          <div className="sf-stat">
            <span className="sf-stat-label">Formula</span>
            <span className="sf-stat-value">{n} × {n} = {squareNumber}</span>
          </div>
          <div className="sf-stat">
            <span className="sf-stat-label">Square number</span>
            <span className="sf-stat-value">n² = {squareNumber} tiles</span>
          </div>
        </div>

        <div className="sf-sequence">
          <span className="sf-sequence-label">Square number sequence so far:</span>
          <div className="sf-sequence-chips">
            {sequence.map((sq, i) => (
              <span key={i} className={`sf-chip ${i === sequence.length - 1 ? 'sf-chip-active' : ''}`}>
                {sq}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
