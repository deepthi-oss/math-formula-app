import { useState, useEffect, useRef } from 'react'

const TEAM1_COLOR = '#3B82F6'
const TEAM2_COLOR = '#EF4444'

function generateQuestions() {
  const questions = []
  // Number questions
  for (let i = 0; i < 20; i++) {
    const a = Math.floor(Math.random() * 15) + 1
    const b = Math.floor(Math.random() * 15) + 1
    const type = Math.floor(Math.random() * 3)
    if (type === 0) questions.push({ q: `${a} + ${b} = ?`, a: String(a + b) })
    else if (type === 1) questions.push({ q: `${a + b} − ${b} = ?`, a: String(a) })
    else questions.push({ q: `${a} × ${b} = ?`, a: String(a * b) })
  }
  // Formula questions
  const formulas = [
    { q: '(a + b)² = ?', a: 'a²+2ab+b²' },
    { q: '(a − b)² = ?', a: 'a²-2ab+b²' },
    { q: '(a+b)(a−b) = ?', a: 'a²-b²' },
    { q: 'a² + b² = ?', a: '(a+b)²-2ab' },
    { q: 'Area of circle = ?', a: 'πr²' },
    { q: 'a² + b² = c² is called?', a: 'pythagorean theorem' },
    { q: 'Area of rectangle = ?', a: 'l×w' },
    { q: 'Perimeter of square = ?', a: '4s' },
  ]
  questions.push(...formulas)
  // Shuffle
  return questions.sort(() => Math.random() - 0.5)
}

function NumPad({ value, onChange, onSubmit, disabled }) {
  const handleNum = (n) => {
    if (disabled) return
    onChange(prev => prev + n)
  }
  const handleDelete = () => { if (disabled) return; onChange(prev => prev.slice(0, -1)) }
  const handleClear = () => { if (disabled) return; onChange('') }

  return (
    <div className="tow-numpad">
      <div className="tow-numpad-display">{value || <span className="tow-numpad-placeholder">Your answer</span>}</div>
      <div className="tow-numpad-grid">
        {['1','2','3','4','5','6','7','8','9','0','.','-'].map(n => (
          <button key={n} className="tow-numpad-btn" onClick={() => handleNum(n)} disabled={disabled}>{n}</button>
        ))}
      </div>
      <div className="tow-numpad-actions">
        <button className="tow-numpad-del" onClick={handleDelete} disabled={disabled}>⌫</button>
        <button className="tow-numpad-clear" onClick={handleClear} disabled={disabled}>C</button>
        <button className="tow-numpad-submit" onClick={onSubmit} disabled={disabled || !value}>✓</button>
      </div>
    </div>
  )
}

function TugAnimation({ ropePos }) {
  // ropePos: 0 = team1 winning, 50 = center, 100 = team2 winning
  const knobLeft = ropePos + '%'
  return (
    <div className="tow-animation">
      <div className="tow-scene">
        {/* Team 1 characters */}
        <div className="tow-chars tow-chars-left" style={{ transform: `translateX(${(ropePos - 50) * 0.3}px)` }}>
          <span className="tow-char">🧑‍🎓</span>
          <span className="tow-char">👨‍🎓</span>
          <span className="tow-char">👩‍🎓</span>
        </div>
        {/* Rope */}
        <div className="tow-rope-container">
          <div className="tow-rope">
            <div className="tow-rope-line tow-rope-left" style={{ background: TEAM1_COLOR }} />
            <div className="tow-rope-knob" style={{ left: knobLeft }}>🔴</div>
            <div className="tow-rope-line tow-rope-right" style={{ background: TEAM2_COLOR }} />
          </div>
        </div>
        {/* Team 2 characters */}
        <div className="tow-chars tow-chars-right" style={{ transform: `translateX(${(ropePos - 50) * 0.3}px)` }}>
          <span className="tow-char">👩‍🎓</span>
          <span className="tow-char">👨‍🎓</span>
          <span className="tow-char">🧑‍🎓</span>
        </div>
      </div>
    </div>
  )
}

export default function TugOfWar() {
  const [questions] = useState(generateQuestions)
  const [q1idx, setQ1idx] = useState(0)
  const [q2idx, setQ2idx] = useState(1)
  const [scores, setScores] = useState([0, 0])
  const [answers, setAnswers] = useState(['', ''])
  const [feedback, setFeedback] = useState([null, null]) // null | 'correct' | 'wrong'
  const [timeLeft, setTimeLeft] = useState(60)
  const [running, setRunning] = useState(false)
  const [gameOver, setGameOver] = useState(false)
  const intervalRef = useRef(null)

  const ropePos = scores[0] + scores[1] === 0
    ? 50
    : Math.round((scores[1] / (scores[0] + scores[1])) * 100)

  useEffect(() => {
    if (running && !gameOver) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(t => {
          if (t <= 1) {
            clearInterval(intervalRef.current)
            setRunning(false)
            setGameOver(true)
            return 0
          }
          return t - 1
        })
      }, 1000)
    }
    return () => clearInterval(intervalRef.current)
  }, [running, gameOver])

  const submit = (player) => {
    const idx = player === 0 ? q1idx : q2idx
    const ans = answers[player].trim().toLowerCase().replace(/\s+/g, '')
    const correct = ans === questions[idx].a.toLowerCase().replace(/\s+/g, '')
    const newFeedback = [...feedback]
    newFeedback[player] = correct ? 'correct' : 'wrong'
    setFeedback(newFeedback)
    if (correct) {
      setScores(s => { const n = [...s]; n[player]++; return n })
    }
    setTimeout(() => {
      const newFb = [...newFeedback]
      newFb[player] = null
      setFeedback(newFb)
      const newAnswers = [...answers]
      newAnswers[player] = ''
      setAnswers(newAnswers)
      if (player === 0) setQ1idx(i => (i + 2) % questions.length)
      else setQ2idx(i => (i + 2) % questions.length)
    }, 1000)
  }

  const reset = () => {
    setScores([0, 0])
    setAnswers(['', ''])
    setFeedback([null, null])
    setTimeLeft(60)
    setRunning(false)
    setGameOver(false)
    clearInterval(intervalRef.current)
  }

  const mins = String(Math.floor(timeLeft / 60)).padStart(2, '0')
  const secs = String(timeLeft % 60).padStart(2, '0')

  let winner = null
  if (gameOver) {
    if (scores[0] > scores[1]) winner = 'Team 1'
    else if (scores[1] > scores[0]) winner = 'Team 2'
    else winner = 'TIE'
  }

  return (
    <div className="tow2-page">
      {/* Header */}
      <div className="tow2-header">
        <div className="tow2-score-box" style={{ background: '#EFF6FF', borderColor: '#BFDBFE' }}>
          <div className="tow2-team-label" style={{ color: TEAM1_COLOR }}>Team 1</div>
          <div className="tow2-score-val" style={{ color: TEAM1_COLOR }}>{scores[0]}</div>
        </div>

        <div className="tow2-center">
          <div className="tow2-title">🪢 Tug of War</div>
          <div className={`tow2-timer ${timeLeft <= 10 ? 'tow2-timer-danger' : ''}`}>
            ⏱ {mins}:{secs}
          </div>
          <div className="tow2-ctrl-btns">
            {!running && !gameOver && (
              <button className="tow2-start-btn" onClick={() => setRunning(true)}>▶ Start</button>
            )}
            {running && (
              <button className="tow2-pause-btn" onClick={() => { setRunning(false); clearInterval(intervalRef.current) }}>⏸ Pause</button>
            )}
            <button className="tow2-reset-btn" onClick={reset}>🔄</button>
          </div>
        </div>

        <div className="tow2-score-box" style={{ background: '#FEF2F2', borderColor: '#FECACA' }}>
          <div className="tow2-team-label" style={{ color: TEAM2_COLOR }}>Team 2</div>
          <div className="tow2-score-val" style={{ color: TEAM2_COLOR }}>{scores[1]}</div>
        </div>
      </div>

      {/* Tug animation */}
      <TugAnimation ropePos={ropePos} />

      {/* Winner banner */}
      {gameOver && (
        <div className="tow2-winner-banner">
          {winner === 'TIE'
            ? "🤝 It's a Tie! Both teams are champions!"
            : `🎉 ${winner} wins the Tug of War!`}
          <button className="tow2-play-again" onClick={reset}>Play Again</button>
        </div>
      )}

      {/* Game area */}
      <div className="tow2-game-area">
        {/* Team 1 */}
        <div className={`tow2-team-panel tow2-team1 ${feedback[0] === 'correct' ? 'flash-correct' : ''} ${feedback[0] === 'wrong' ? 'flash-wrong' : ''}`}>
          <div className="tow2-panel-header" style={{ background: TEAM1_COLOR }}>
            <span>👥 TEAM 1</span>
            <span className="tow2-panel-score">{scores[0]} pts</span>
          </div>
          <div className="tow2-question">{questions[q1idx]?.q}</div>
          {feedback[0] && (
            <div className={`tow2-feedback ${feedback[0]}`}>
              {feedback[0] === 'correct' ? '✅ Correct! +1' : `❌ Wrong! Answer: ${questions[q1idx]?.a}`}
            </div>
          )}
          <NumPad
            value={answers[0]}
            onChange={(fn) => setAnswers(a => { const n = [...a]; n[0] = typeof fn === 'function' ? fn(a[0]) : fn; return n })}
            onSubmit={() => submit(0)}
            disabled={!running || gameOver || feedback[0] !== null}
          />
        </div>

        {/* Team 2 */}
        <div className={`tow2-team-panel tow2-team2 ${feedback[1] === 'correct' ? 'flash-correct' : ''} ${feedback[1] === 'wrong' ? 'flash-wrong' : ''}`}>
          <div className="tow2-panel-header" style={{ background: TEAM2_COLOR }}>
            <span>👥 TEAM 2</span>
            <span className="tow2-panel-score">{scores[1]} pts</span>
          </div>
          <div className="tow2-question">{questions[q2idx]?.q}</div>
          {feedback[1] && (
            <div className={`tow2-feedback ${feedback[1]}`}>
              {feedback[1] === 'correct' ? '✅ Correct! +1' : `❌ Wrong! Answer: ${questions[q2idx]?.a}`}
            </div>
          )}
          <NumPad
            value={answers[1]}
            onChange={(fn) => setAnswers(a => { const n = [...a]; n[1] = typeof fn === 'function' ? fn(a[1]) : fn; return n })}
            onSubmit={() => submit(1)}
            disabled={!running || gameOver || feedback[1] !== null}
          />
        </div>
      </div>
    </div>
  )
}