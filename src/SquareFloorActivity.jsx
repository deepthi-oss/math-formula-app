import { useState } from 'react'
import { randInt } from './apShared'

const TILE = 26
const GAP = 3
const N_MIN = 3
const N_MAX = 6

export default function SquareFloorActivity() {
  const [n, setN] = useState(() => randInt(N_MIN, N_MAX))
  const [phase, setPhase] = useState('predict')
  const [guess, setGuess] = useState('')
  const [guessCorrect, setGuessCorrect] = useState(null)
  const [filled, setFilled] = useState(() => new Set())

  const squareNumber = n * n
  const side = n * TILE + (n - 1) * GAP

  const newChallenge = () => {
    setN(randInt(N_MIN, N_MAX))
    setPhase('predict')
    setGuess('')
    setGuessCorrect(null)
    setFilled(new Set())
  }

  const checkGuess = () => {
    const val = parseInt(guess, 10)
    setGuessCorrect(!Number.isNaN(val) && val === squareNumber)
  }

  const startBuilding = () => setPhase('build')

  const tapTile = idx => {
    if (filled.has(idx)) return
    const next = new Set(filled)
    next.add(idx)
    setFilled(next)
    if (next.size === squareNumber) setPhase('done')
  }

  return (
    <div className="square-floor-card">
      <div className="formula-box-header" style={{ background: '#FFFBEB' }}>
        <span className="formula-box-icon">🧱</span>
        <div>
          <h2 className="formula-box-title" style={{ color: '#F59E0B' }}>
            Expanding Square Floor
          </h2>
          <p className="formula-box-sub">Each tile is a 1 cm × 1 cm square</p>
        </div>
      </div>

      <div className="square-floor-body">
        {phase === 'predict' && (
          <div className="sf-predict">
            <p className="sf-predict-question">
              A floor is <strong>{n} cm × {n} cm</strong>. How many 1 cm tiles will you need to cover it?
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
                {guessCorrect ? `✓ Correct! ${n} × ${n} = ${squareNumber}` : `Not quite — the answer is ${n} × ${n} = ${squareNumber}`}
              </div>
            )}
            {guessCorrect !== null && (
              <button className="sf-build-btn" onClick={startBuilding}>🧱 Now Build It Yourself →</button>
            )}
          </div>
        )}

        {(phase === 'build' || phase === 'done') && (
          <>
            <div className="sf-build-header">
              <p className="sf-build-instruction">
                {phase === 'build'
                  ? `Tap each cell to lay a tile. Tiles placed: ${filled.size} / ${squareNumber}`
                  : `🎉 Floor complete! You placed all ${squareNumber} tiles.`}
              </p>
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
                    <div
                      key={i}
                      className={`square-floor-tile ${filled.has(i) ? 'sf-tile-filled' : 'sf-tile-empty'}`}
                      onClick={() => tapTile(i)}
                    />
                  ))}
                </div>
                <span className="sf-brace-h" style={{ width: side }} />
                <span className="sf-length-label">Length = {n} cm</span>
              </div>
            </div>

            {phase === 'done' && (
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
            )}
          </>
        )}

        <button className="sf-new-btn" onClick={newChallenge}>🔄 New Challenge</button>
      </div>
    </div>
  )
}
