import { useState } from 'react'

const A_MIN = 1, A_MAX = 10
const D_MIN = 1, D_MAX = 6
const N_MIN = 1, N_MAX = 8
const MAX_BAR_PX = 220
const PALETTE = ['#F59E0B', '#6366F1', '#10B981', '#EC4899', '#8B5CF6', '#F43F5E']

const TABS = [
  { id: 'staircase', label: 'Staircase', icon: '🪜' },
  { id: 'numberline', label: 'Number Line', icon: '📍' },
  { id: 'pairing', label: 'Pairing', icon: '🤝' },
  { id: 'realworld', label: 'Real-World Stack', icon: '🏟️' },
]

const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v))

function NumberLineView({ terms, d }) {
  const min = Math.min(...terms)
  const max = Math.max(...terms)
  const range = Math.max(1, max - min)
  return (
    <div className="ap-numberline-view">
      <div className="ap-track">
        <div className="ap-track-line" />
        {terms.map((val, i) => {
          const pct = (val - min) / range
          return (
            <div key={i} className="ap-hop-point" style={{ left: `${pct * 100}%` }}>
              <span className={`ap-hop-dot ${i === terms.length - 1 ? 'ap-hop-dot-active' : ''}`} />
              <span className="ap-hop-label">{val}</span>
            </div>
          )
        })}
      </div>
      <p className="ap-hint">Each hop moves +d = {d} along the line.</p>
    </div>
  )
}

function PairingView({ terms, showPairs, setShowPairs }) {
  const n = terms.length
  const pairSum = terms[0] + terms[n - 1]
  const sum = terms.reduce((s, t) => s + t, 0)
  return (
    <div className="ap-pairing-view">
      <button className="ap-toggle-btn" onClick={() => setShowPairs(v => !v)}>
        {showPairs ? '↺ Hide Pairs' : '🤝 Pair Up (Gauss Trick)'}
      </button>
      <div className="ap-pairing-row">
        {terms.map((val, i) => {
          const isMiddle = n % 2 === 1 && i === Math.floor(n / 2)
          const pairIndex = Math.min(i, n - 1 - i)
          const color = isMiddle ? '#9CA3AF' : PALETTE[pairIndex % PALETTE.length]
          return (
            <div
              key={i}
              className="ap-chip"
              style={showPairs ? { borderColor: color, background: color + '22', color } : {}}
            >
              {val}
            </div>
          )
        })}
      </div>
      {showPairs && (
        <p className="ap-derivation">
          Pair the ends: {terms[0]} + {terms[n - 1]} = {pairSum}. Every matching pair sums to {pairSum}.
          {n % 2 === 0
            ? ` ${n / 2} pairs × ${pairSum} = ${(n / 2) * pairSum}`
            : ` ${Math.floor(n / 2)} pairs + 1 middle term (${terms[Math.floor(n / 2)]})`}
          {' '}→ Sum = {sum}
        </p>
      )}
    </div>
  )
}

function RealWorldView({ terms }) {
  const total = terms.reduce((s, t) => s + t, 0)
  return (
    <div className="ap-realworld-view">
      <p className="ap-realworld-caption">🏟️ Stadium seating — each row has d more seats than the last</p>
      <div className="ap-rows">
        {terms.map((count, i) => (
          <div key={i} className="ap-row">
            <span className="ap-row-label">Row {i + 1}</span>
            <div className="ap-row-seats">
              {Array.from({ length: count }).map((_, j) => (
                <span key={j} className="ap-seat" />
              ))}
            </div>
            <span className="ap-row-count">{count}</span>
          </div>
        ))}
      </div>
      <p className="ap-realworld-total">Total seats so far: {total}</p>
    </div>
  )
}

export default function ArithmeticProgressionActivity() {
  const [a, setA] = useState(2)
  const [d, setD] = useState(3)
  const [n, setN] = useState(4)
  const [tab, setTab] = useState('staircase')
  const [showRectangle, setShowRectangle] = useState(false)
  const [showPairs, setShowPairs] = useState(false)

  const terms = Array.from({ length: n }, (_, i) => a + i * d)
  const lastTerm = terms[terms.length - 1]
  const sum = terms.reduce((s, t) => s + t, 0)

  const bumpA = delta => setA(v => clamp(v + delta, A_MIN, A_MAX))
  const bumpD = delta => setD(v => clamp(v + delta, D_MIN, D_MAX))
  const bumpN = delta => setN(v => clamp(v + delta, N_MIN, N_MAX))

  const maxHeightValue = showRectangle ? a + lastTerm : lastTerm
  const unit = Math.max(4, Math.min(24, MAX_BAR_PX / Math.max(1, maxHeightValue)))

  return (
    <div className="ap-activity">
      <div className="ap-controls">
        <div className="ap-param">
          <span className="ap-param-label">First term (a)</span>
          <div className="ap-stepper">
            <button onClick={() => bumpA(-1)} disabled={a === A_MIN}>−</button>
            <span>{a}</span>
            <button onClick={() => bumpA(1)} disabled={a === A_MAX}>+</button>
          </div>
        </div>
        <div className="ap-param">
          <span className="ap-param-label">Common difference (d)</span>
          <div className="ap-stepper">
            <button onClick={() => bumpD(-1)} disabled={d === D_MIN}>−</button>
            <span>{d}</span>
            <button onClick={() => bumpD(1)} disabled={d === D_MAX}>+</button>
          </div>
        </div>
        <div className="ap-param">
          <span className="ap-param-label">Terms (n)</span>
          <div className="ap-stepper">
            <button onClick={() => bumpN(-1)} disabled={n === N_MIN}>−</button>
            <span>{n}</span>
            <button onClick={() => bumpN(1)} disabled={n === N_MAX}>+</button>
          </div>
        </div>
      </div>

      <div className="ap-sequence-strip">Sequence: {terms.join(', ')}</div>

      <div className="ap-tabs">
        {TABS.map(t => (
          <button
            key={t.id}
            className={`ap-tab ${tab === t.id ? 'ap-tab-active' : ''}`}
            onClick={() => setTab(t.id)}
          >
            <span>{t.icon}</span> {t.label}
          </button>
        ))}
      </div>

      <div className="ap-stage">
        {tab === 'staircase' && (
          <div className="ap-staircase-view">
            <button className="ap-toggle-btn" onClick={() => setShowRectangle(v => !v)}>
              {showRectangle ? '↺ Show Staircase Only' : '⟳ Flip & Pair into Rectangle'}
            </button>
            <div className="ap-bars-row">
              {terms.map((val, i) => {
                const mirrored = terms[n - 1 - i]
                return (
                  <div key={i} className="ap-bar-col">
                    {showRectangle && (
                      <div className="ap-bar-seg ap-bar-seg-mirror" style={{ height: mirrored * unit }} />
                    )}
                    <div className="ap-bar-seg ap-bar-seg-main" style={{ height: val * unit }} />
                    <span className="ap-bar-label">{val}</span>
                  </div>
                )
              })}
            </div>
            {showRectangle && (
              <p className="ap-derivation">
                Every column now totals a + last = {a} + {lastTerm} = {a + lastTerm}.
                Rectangle area = n × (a+last) = {n} × {a + lastTerm} = {n * (a + lastTerm)} → Sum = area ÷ 2 = {sum}
              </p>
            )}
          </div>
        )}

        {tab === 'numberline' && <NumberLineView terms={terms} d={d} />}
        {tab === 'pairing' && <PairingView terms={terms} showPairs={showPairs} setShowPairs={setShowPairs} />}
        {tab === 'realworld' && <RealWorldView terms={terms} />}
      </div>

      <div className="ap-formula-panel">
        <div className="ap-formula-card">
          <span className="ap-formula-label">nth Term</span>
          <span className="ap-formula-value">
            aₙ = a + (n−1)d = {a} + ({n}−1)×{d} = {lastTerm}
          </span>
        </div>
        <div className="ap-formula-card">
          <span className="ap-formula-label">Sum of n Terms</span>
          <span className="ap-formula-value">
            Sₙ = n/2 [2a+(n−1)d] = {n}/2 × [{2 * a}+({n}-1)×{d}] = {sum}
          </span>
        </div>
      </div>
    </div>
  )
}
