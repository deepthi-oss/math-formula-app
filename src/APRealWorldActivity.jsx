import { useState } from 'react'
import { generateAP, randInt, sumOfN } from './apShared'

export default function APRealWorldActivity() {
  const [ap, setAp] = useState(() => generateAP({ aMin: 1, aMax: 6, dMin: 1, dMax: 4, n: randInt(4, 6) }))
  const [rows, setRows] = useState(() => [ap.a])
  const [currentRow, setCurrentRow] = useState(1)
  const [rowGuess, setRowGuess] = useState('')
  const [rowFeedback, setRowFeedback] = useState(null)
  const [phase, setPhase] = useState('rows')
  const [sumGuess, setSumGuess] = useState('')
  const [sumFeedback, setSumFeedback] = useState(null)
  const [correctCount, setCorrectCount] = useState(0)

  const total = ap.n
  const actualSum = sumOfN(ap.a, ap.d, ap.n)

  const newChallenge = () => {
    const next = generateAP({ aMin: 1, aMax: 6, dMin: 1, dMax: 4, n: randInt(4, 6) })
    setAp(next)
    setRows([next.a])
    setCurrentRow(1)
    setRowGuess('')
    setRowFeedback(null)
    setPhase('rows')
    setSumGuess('')
    setSumFeedback(null)
    setCorrectCount(0)
  }

  const checkRow = () => {
    const val = parseInt(rowGuess, 10)
    const correct = ap.a + currentRow * ap.d
    const isCorrect = val === correct
    if (isCorrect) setCorrectCount(c => c + 1)
    setRowFeedback({ correct: isCorrect, val: correct })
  }

  const continueRows = () => {
    const correct = ap.a + currentRow * ap.d
    setRows(r => [...r, correct])
    setRowGuess('')
    setRowFeedback(null)
    if (currentRow + 1 >= ap.n) {
      setPhase('sumPredict')
    } else {
      setCurrentRow(c => c + 1)
    }
  }

  const checkSum = () => {
    const val = parseInt(sumGuess, 10)
    const isCorrect = val === actualSum
    if (isCorrect) setCorrectCount(c => c + 1)
    setSumFeedback({ correct: isCorrect, val: actualSum })
    setPhase('done')
  }

  return (
    <div className="rw-activity">
      <p className="rw-caption">🏟️ Stadium seating — predict each row before it's revealed</p>

      <div className="rw-rows">
        {rows.map((count, i) => (
          <div key={i} className="rw-row">
            <span className="rw-row-label">Row {i + 1}</span>
            <div className="rw-row-seats">
              {Array.from({ length: count }).map((_, j) => <span key={j} className="rw-seat" />)}
            </div>
            <span className="rw-row-count">{count}</span>
          </div>
        ))}
      </div>

      {phase === 'rows' && (
        <div className="rw-predict-card">
          <p className="rw-predict-text">
            Each row has <strong>d = {ap.d}</strong> more seats than the last. How many seats in Row {currentRow + 1}?
          </p>
          {!rowFeedback ? (
            <div className="rw-predict-row">
              <input
                type="number"
                className="rw-input"
                value={rowGuess}
                onChange={e => setRowGuess(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && checkRow()}
                placeholder="Seats"
                autoFocus
              />
              <button className="rw-btn" onClick={checkRow}>Check</button>
            </div>
          ) : (
            <div className="rw-feedback-block">
              <p className={`rw-feedback ${rowFeedback.correct ? 'rw-feedback-correct' : 'rw-feedback-wrong'}`}>
                {rowFeedback.correct ? '✓ Correct!' : `Not quite — Row ${currentRow + 1} has ${rowFeedback.val} seats`}
              </p>
              <button className="rw-btn" onClick={continueRows}>
                {currentRow + 1 >= ap.n ? 'Reveal Row & Continue →' : 'Reveal Row & Next →'}
              </button>
            </div>
          )}
        </div>
      )}

      {phase === 'sumPredict' && (
        <div className="rw-predict-card">
          <p className="rw-predict-text">All rows built! What's the <strong>total</strong> number of seats?</p>
          <div className="rw-predict-row">
            <input
              type="number"
              className="rw-input"
              value={sumGuess}
              onChange={e => setSumGuess(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && checkSum()}
              placeholder="Total seats"
              autoFocus
            />
            <button className="rw-btn" onClick={checkSum}>Check</button>
          </div>
        </div>
      )}

      {phase === 'done' && (
        <div className="rw-done-banner">
          <p className={sumFeedback.correct ? 'rw-feedback-correct' : 'rw-feedback-wrong'}>
            {sumFeedback.correct ? `✓ Correct! Total = ${actualSum}` : `Total is actually ${actualSum}`}
          </p>
          <p className="rw-formula">Sₙ = n/2 [2a+(n−1)d] = {ap.n}/2 × [{2 * ap.a}+({ap.n}-1)×{ap.d}] = {actualSum}</p>
          <p className="rw-score">You got {correctCount} / {total} predictions right!</p>
        </div>
      )}

      <button className="rw-new-btn" onClick={newChallenge}>🔄 New Challenge</button>
    </div>
  )
}
