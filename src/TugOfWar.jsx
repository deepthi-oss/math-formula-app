import { useState, useEffect, useRef } from 'react'

const TEAM1_COLOR = '#3B82F6'
const TEAM2_COLOR = '#EF4444'

const BOT_DIFFICULTY = {
  Easy: { speed: 8000, accuracy: 0.4 },
  Medium: { speed: 4000, accuracy: 0.7 },
  Hard: { speed: 1500, accuracy: 0.95 },
}

function generateQuestions() {
  const questions = []
  for (let i = 0; i < 20; i++) {
    const a = Math.floor(Math.random() * 15) + 1
    const b = Math.floor(Math.random() * 15) + 1
    const type = Math.floor(Math.random() * 3)
    if (type === 0) questions.push({ q: `${a} + ${b} = ?`, a: String(a + b) })
    else if (type === 1) questions.push({ q: `${a + b} − ${b} = ?`, a: String(a) })
    else questions.push({ q: `${a} × ${b} = ?`, a: String(a * b) })
  }
  const formulas = [
    { q: '(a + b)² = ?', a: 'a²+2ab+b²' },
    { q: '(a − b)² = ?', a: 'a²-2ab+b²' },
    { q: '(a+b)(a−b) = ?', a: 'a²-b²' },
    { q: 'Area of circle = ?', a: 'πr²' },
    { q: 'Area of rectangle = ?', a: 'l×w' },
    { q: 'Perimeter of square = ?', a: '4s' },
  ]
  questions.push(...formulas)
  return questions.sort(() => Math.random() - 0.5)
}

function NumPad({ value, onChange, onSubmit, disabled }) {
  const [useKeyboard, setUseKeyboard] = useState(false)
  const handleNum = (n) => { if (disabled) return; onChange(prev => prev + n) }
  const handleDelete = () => { if (disabled) return; onChange(prev => prev.slice(0, -1)) }
  const handleClear = () => { if (disabled) return; onChange('') }

  return (
    <div className="tow-numpad">
      <div className="tow-input-toggle">
        <button
          className={`tow-toggle-btn ${!useKeyboard ? 'active' : ''}`}
          onClick={() => setUseKeyboard(false)}
          disabled={disabled}
        >
          🔢 Numpad
        </button>
        <button
          className={`tow-toggle-btn ${useKeyboard ? 'active' : ''}`}
          onClick={() => setUseKeyboard(true)}
          disabled={disabled}
        >
          ⌨️ Keyboard
        </button>
      </div>

      <div className="tow-numpad-display">
        {useKeyboard ? (
          <input
            className="tow-keyboard-input"
            value={value}
            onChange={e => onChange(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && !disabled && value) onSubmit() }}
            placeholder="Type your answer..."
            disabled={disabled}
            autoFocus
          />
        ) : (
          value || <span className="tow-numpad-placeholder">Your answer</span>
        )}
      </div>

      {!useKeyboard && (
        <>
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
        </>
      )}

      {useKeyboard && (
        <div className="tow-numpad-actions">
          <button className="tow-numpad-clear" onClick={handleClear} disabled={disabled} style={{ flex: 1 }}>Clear</button>
          <button className="tow-numpad-submit" onClick={onSubmit} disabled={disabled || !value} style={{ flex: 2 }}>✓ Submit</button>
        </div>
      )}
    </div>
  )
}

function TugAnimation({ ropePos }) {
  const knobLeft = ropePos + '%'
  return (
    <div className="tow-animation">
      <div className="tow-scene">
        <div className="tow-chars tow-chars-left" style={{ transform: `translateX(${(ropePos - 50) * 0.3}px)` }}>
          <span className="tow-char">🧑‍🎓</span>
          <span className="tow-char">👨‍🎓</span>
          <span className="tow-char">👩‍🎓</span>
        </div>
        <div className="tow-rope-container">
          <div className="tow-rope">
            <div className="tow-rope-line tow-rope-left" style={{ background: TEAM1_COLOR }} />
            <div className="tow-rope-knob" style={{ left: knobLeft }}>🔴</div>
            <div className="tow-rope-line tow-rope-right" style={{ background: TEAM2_COLOR }} />
          </div>
        </div>
        <div className="tow-chars tow-chars-right" style={{ transform: `translateX(${(ropePos - 50) * 0.3}px)` }}>
          <span className="tow-char">🤖</span>
          <span className="tow-char">🤖</span>
          <span className="tow-char">🤖</span>
        </div>
      </div>
    </div>
  )
}

function DifficultySelector({ onStart }) {
  const [difficulty, setDifficulty] = useState('Medium')
  const [botEnabled, setBotEnabled] = useState(false)

  return (
    <div className="tow2-setup">
      <div className="tow2-setup-card">
        <div className="tow2-setup-icon">🪢</div>
        <h2 className="tow2-setup-title">Tug of War Challenge</h2>
        <p className="tow2-setup-sub">Race against a friend or challenge the BOT!</p>

        <div className="tow2-setup-section">
          <label className="tow2-setup-label">Game Mode</label>
          <div className="tow2-mode-btns">
            <button
              className={`tow2-mode-btn ${!botEnabled ? 'active' : ''}`}
              onClick={() => setBotEnabled(false)}
            >
              👥 2 Players
            </button>
            <button
              className={`tow2-mode-btn ${botEnabled ? 'active' : ''}`}
              onClick={() => setBotEnabled(true)}
            >
              🤖 vs BOT
            </button>
          </div>
        </div>

        {botEnabled && (
          <div className="tow2-setup-section">
            <label className="tow2-setup-label">BOT Difficulty</label>
            <div className="tow2-diff-btns">
              {['Easy', 'Medium', 'Hard'].map(d => (
                <button
                  key={d}
                  className={`tow2-diff-btn tow2-diff-${d.toLowerCase()} ${difficulty === d ? 'active' : ''}`}
                  onClick={() => setDifficulty(d)}
                >
                  {d === 'Easy' ? '🐢 Easy' : d === 'Medium' ? '🦊 Medium' : '🚀 Hard'}
                </button>
              ))}
            </div>
          </div>
        )}

        <button
          className="tow2-setup-start"
          onClick={() => onStart(botEnabled, difficulty)}
        >
          Let's Play! 🎮
        </button>
      </div>
    </div>
  )
}

function Game({ botEnabled, difficulty }) {
  const questions = useRef(generateQuestions()).current
  const [q1idx, setQ1idx] = useState(0)
  const [q2idx, setQ2idx] = useState(1)
  const [scores, setScores] = useState([0, 0])
  const [answers, setAnswers] = useState(['', ''])
  const [feedback, setFeedback] = useState([null, null])
  const [timeLeft, setTimeLeft] = useState(60)
  const [running, setRunning] = useState(false)
  const [gameOver, setGameOver] = useState(false)

  const timerRef = useRef(null)
  const botRef = useRef(null)
  const feedbackRef = useRef([null, null])
  const runningRef = useRef(false)
  const gameOverRef = useRef(false)

  useEffect(() => { feedbackRef.current = feedback }, [feedback])
  useEffect(() => { runningRef.current = running }, [running])
  useEffect(() => { gameOverRef.current = gameOver }, [gameOver])

  const ropePos = scores[0] + scores[1] === 0
    ? 50
    : Math.round((scores[1] / (scores[0] + scores[1])) * 100)

  useEffect(() => {
    if (running && !gameOver) {
      timerRef.current = setInterval(() => {
        setTimeLeft(t => {
          if (t <= 1) {
            clearInterval(timerRef.current)
            setRunning(false)
            setGameOver(true)
            return 0
          }
          return t - 1
        })
      }, 1000)
    }
    return () => clearInterval(timerRef.current)
  }, [running, gameOver])

  const scheduleBotAnswer = (currentQ2idx) => {
    clearTimeout(botRef.current)
    if (!botEnabled) return
    const { speed, accuracy } = BOT_DIFFICULTY[difficulty]
    const delay = speed * (0.7 + Math.random() * 0.6)
    botRef.current = setTimeout(() => {
      if (!runningRef.current || gameOverRef.current) return
      if (feedbackRef.current[1] !== null) return
      const correct = Math.random() < accuracy
      setFeedback(f => { const n = [...f]; n[1] = correct ? 'correct' : 'wrong'; return n })
      if (correct) setScores(s => { const n = [...s]; n[1]++; return n })
      setTimeout(() => {
        setFeedback(f => { const n = [...f]; n[1] = null; return n })
        setQ2idx(i => {
          const next = (i + 2) % questions.length
          scheduleBotAnswer(next)
          return next
        })
      }, 1000)
    }, delay)
  }

  useEffect(() => {
    if (running && botEnabled) {
      scheduleBotAnswer(q2idx)
    }
    if (!running) {
      clearTimeout(botRef.current)
    }
    return () => clearTimeout(botRef.current)
  }, [running])

  const submitAnswer = (player) => {
    if (feedback[player] !== null || !running || gameOver) return
    const idx = player === 0 ? q1idx : q2idx
    const ans = answers[player].trim().toLowerCase().replace(/\s+/g, '')
    const correct = ans === questions[idx].a.toLowerCase().replace(/\s+/g, '')
    setFeedback(f => { const n = [...f]; n[player] = correct ? 'correct' : 'wrong'; return n })
    if (correct) setScores(s => { const n = [...s]; n[player]++; return n })
    setTimeout(() => {
      setFeedback(f => { const n = [...f]; n[player] = null; return n })
      setAnswers(a => { const n = [...a]; n[player] = ''; return n })
      if (player === 0) setQ1idx(i => (i + 2) % questions.length)
      else setQ2idx(i => (i + 2) % questions.length)
    }, 1000)
  }

  const mins = String(Math.floor(timeLeft / 60)).padStart(2, '0')
  const secs = String(timeLeft % 60).padStart(2, '0')

  let winner = null
  if (gameOver) {
    if (scores[0] > scores[1]) winner = '🎉 You win!'
    else if (scores[1] > scores[0]) winner = botEnabled ? '🤖 BOT wins!' : '🎉 Team 2 wins!'
    else winner = "🤝 It's a Tie!"
  }

  return (
    <div className="tow2-page">
      <div className="tow2-header">
        <div className="tow2-score-box" style={{ background: '#EFF6FF', borderColor: '#BFDBFE' }}>
          <div className="tow2-team-label" style={{ color: TEAM1_COLOR }}>Team 1</div>
          <div className="tow2-score-val" style={{ color: TEAM1_COLOR }}>{scores[0]}</div>
        </div>
        <div className="tow2-center">
          <div className="tow2-title">🪢 {botEnabled ? `vs 🤖 BOT (${difficulty})` : 'Tug of War'}</div>
          <div className={`tow2-timer ${timeLeft <= 10 ? 'tow2-timer-danger' : ''}`}>⏱ {mins}:{secs}</div>
          <div className="tow2-ctrl-btns">
            {!running && !gameOver && (
              <button className="tow2-start-btn" onClick={() => setRunning(true)}>▶ Start</button>
            )}
            {running && (
              <button className="tow2-pause-btn" onClick={() => setRunning(false)}>⏸ Pause</button>
            )}
          </div>
        </div>
        <div className="tow2-score-box" style={{ background: '#FEF2F2', borderColor: '#FECACA' }}>
          <div className="tow2-team-label" style={{ color: TEAM2_COLOR }}>{botEnabled ? '🤖 BOT' : 'Team 2'}</div>
          <div className="tow2-score-val" style={{ color: TEAM2_COLOR }}>{scores[1]}</div>
        </div>
      </div>

      <TugAnimation ropePos={ropePos} />

      {gameOver && (
        <div className="tow2-winner-banner">
          <span>{winner}</span>
          <button className="tow2-play-again" onClick={() => window.location.reload()}>Play Again</button>
        </div>
      )}

      <div className="tow2-game-area">
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
            onSubmit={() => submitAnswer(0)}
            disabled={!running || gameOver || feedback[0] !== null}
          />
        </div>

        <div className={`tow2-team-panel tow2-team2 ${feedback[1] === 'correct' ? 'flash-correct' : ''} ${feedback[1] === 'wrong' ? 'flash-wrong' : ''}`}>
          <div className="tow2-panel-header" style={{ background: TEAM2_COLOR }}>
            <span>{botEnabled ? '🤖 BOT' : '👥 TEAM 2'}</span>
            <span className="tow2-panel-score">{scores[1]} pts</span>
          </div>
          <div className="tow2-question">{questions[q2idx]?.q}</div>
          {feedback[1] && (
            <div className={`tow2-feedback ${feedback[1]}`}>
              {feedback[1] === 'correct' ? '✅ Correct! +1' : '❌ Wrong!'}
            </div>
          )}
          {botEnabled ? (
            <div className="tow2-bot-thinking">
              {running && !gameOver && feedback[1] === null && (
                <div className="tow2-bot-dots"><span /><span /><span /></div>
              )}
              {(!running || gameOver) && <p className="tow2-bot-wait">🤖 BOT is waiting...</p>}
            </div>
          ) : (
            <NumPad
              value={answers[1]}
              onChange={(fn) => setAnswers(a => { const n = [...a]; n[1] = typeof fn === 'function' ? fn(a[1]) : fn; return n })}
              onSubmit={() => submitAnswer(1)}
              disabled={!running || gameOver || feedback[1] !== null}
            />
          )}
        </div>
      </div>
    </div>
  )
}

export default function TugOfWar() {
  const [config, setConfig] = useState(null)
  const [key, setKey] = useState(0)

  const handleStart = (bot, diff) => {
    setConfig({ bot, diff })
    setKey(k => k + 1)
  }

  if (!config) {
    return <DifficultySelector onStart={handleStart} />
  }

  return <Game key={key} botEnabled={config.bot} difficulty={config.diff} />
}