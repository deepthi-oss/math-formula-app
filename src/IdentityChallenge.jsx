import { useState, useEffect, useRef } from 'react'

const identities = [
  { q: '(a + b)² = ?', answer: 'a²+2ab+b²', display: 'a² + 2ab + b²', hint: 'Identity 1 — Square of sum' },
  { q: '(a - b)² = ?', answer: 'a²-2ab+b²', display: 'a² - 2ab + b²', hint: 'Identity 2 — Square of difference' },
  { q: '(a + b)(a - b) = ?', answer: 'a²-b²', display: 'a² - b²', hint: 'Identity 3 — Difference of squares' },
  { q: '(x + a)(x + b) = ?', answer: 'x²+(a+b)x+ab', display: 'x² + (a+b)x + ab', hint: 'Identity 4 — Product of binomials' },
  { q: '(a + b + c)² = ?', answer: 'a²+b²+c²+2ab+2bc+2ca', display: 'a² + b² + c² + 2ab + 2bc + 2ca', hint: 'Identity 5 — Square of trinomial' },
  { q: '(a + b)³ = ?', answer: 'a³+b³+3ab(a+b)', display: 'a³ + b³ + 3ab(a + b)', hint: 'Identity 6 — Cube of sum' },
  { q: '(a - b)³ = ?', answer: 'a³-b³-3ab(a-b)', display: 'a³ - b³ - 3ab(a - b)', hint: 'Identity 7 — Cube of difference' },
  { q: 'a³ + b³ + c³ - 3abc = ?', answer: '(a+b+c)(a²+b²+c²-ab-bc-ca)', display: '(a + b + c)(a² + b² + c² - ab - bc - ca)', hint: 'Identity 8 — Sum of cubes' },
]

const WRITE_TIME = 30
const TYPE_TIME = 20

const BOT_DIFFICULTY = {
  Easy: { speed: 16000, accuracy: 0.4 },
  Medium: { speed: 8000, accuracy: 0.7 },
  Hard: { speed: 3000, accuracy: 0.95 },
}

function norm(s) {
  return s.toLowerCase().replace(/\s+/g, '')
    .replace(/[²]/g, '2').replace(/[³]/g, '3')
    .replace(/\^2/g, '2').replace(/\^3/g, '3')
    .replace(/×/g, '*')
}

function checkAnswer(input, ans) {
  return norm(input) === norm(ans)
}

function SetupScreen({ onStart }) {
  const [mode, setMode] = useState('2player')
  const [difficulty, setDifficulty] = useState('Medium')

  return (
    <div className="tow2-setup">
      <div className="tow2-setup-card">
        <div className="tow2-setup-icon">⚡</div>
        <h2 className="tow2-setup-title">Identity Challenge</h2>
        <p className="tow2-setup-sub">Race to complete all 8 algebraic identities!</p>

        <div className="tow2-setup-section">
          <label className="tow2-setup-label">Game Mode</label>
          <div className="tow2-mode-btns">
            <button
              className={`tow2-mode-btn ${mode === '2player' ? 'active' : ''}`}
              onClick={() => setMode('2player')}
            >
              👥 2 Players
            </button>
            <button
              className={`tow2-mode-btn ${mode === 'bot' ? 'active' : ''}`}
              onClick={() => setMode('bot')}
            >
              🤖 vs BOT
            </button>
          </div>
        </div>

        {mode === 'bot' && (
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

        <button className="tow2-setup-start" onClick={() => onStart(mode === 'bot', difficulty)}>
          Let's Play! 🎮
        </button>
      </div>
    </div>
  )
}

function DrawCanvas({ locked }) {
  const canvasRef = useRef(null)
  const ctxRef = useRef(null)
  const drawingRef = useRef(false)
  const [color, setColor] = useState('#1a1a1a')
  const [penSize, setPenSize] = useState(2)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctxRef.current = ctx
  }, [])

  const getPos = (e) => {
    const canvas = canvasRef.current
    const r = canvas.getBoundingClientRect()
    const sx = canvas.width / r.width
    const sy = canvas.height / r.height
    if (e.touches) return { x: (e.touches[0].clientX - r.left) * sx, y: (e.touches[0].clientY - r.top) * sy }
    return { x: (e.clientX - r.left) * sx, y: (e.clientY - r.top) * sy }
  }

  const start = (e) => {
    if (locked) return
    e.preventDefault()
    drawingRef.current = true
    const pos = getPos(e)
    ctxRef.current.beginPath()
    ctxRef.current.moveTo(pos.x, pos.y)
  }
  const move = (e) => {
    if (!drawingRef.current || locked) return
    e.preventDefault()
    const pos = getPos(e)
    ctxRef.current.lineWidth = penSize
    ctxRef.current.strokeStyle = color
    ctxRef.current.lineTo(pos.x, pos.y)
    ctxRef.current.stroke()
  }
  const end = () => { drawingRef.current = false }
  const clear = () => {
    const canvas = canvasRef.current
    ctxRef.current.fillStyle = '#ffffff'
    ctxRef.current.fillRect(0, 0, canvas.width, canvas.height)
  }

  return (
    <div>
      <div className="canvas-wrap">
        <canvas
          ref={canvasRef}
          width={300}
          height={140}
          className="draw-canvas"
          onMouseDown={start}
          onMouseMove={move}
          onMouseUp={end}
          onMouseLeave={end}
          onTouchStart={start}
          onTouchMove={move}
          onTouchEnd={end}
        />
      </div>
      <div className="canvas-tools">
        <button className="tool-btn" onClick={clear} disabled={locked}>Clear</button>
        <div className={`cdot ${color === '#1a1a1a' ? 'active' : ''}`} style={{ background: '#1a1a1a' }} onClick={() => !locked && setColor('#1a1a1a')} />
        <div className={`cdot ${color === '#185FA5' ? 'active' : ''}`} style={{ background: '#185FA5' }} onClick={() => !locked && setColor('#185FA5')} />
        <div className={`cdot ${color === '#993C1D' ? 'active' : ''}`} style={{ background: '#993C1D' }} onClick={() => !locked && setColor('#993C1D')} />
        <input type="range" min="1" max="7" value={penSize} onChange={e => setPenSize(parseInt(e.target.value))} className="pen-sz" />
      </div>
    </div>
  )
}

function Game({ botEnabled, difficulty }) {
  const [round, setRound] = useState(0)
  const [scores, setScores] = useState([0, 0])
  const [phase, setPhase] = useState('write')
  const [timeLeft, setTimeLeft] = useState(WRITE_TIME)
  const [started, setStarted] = useState(false)
  const [submitted, setSubmitted] = useState([false, false])
  const [results, setResults] = useState([null, null])
  const [type1, setType1] = useState('')
  const [type2, setType2] = useState('')
  const [showAnswer, setShowAnswer] = useState(false)

  const id = identities[round]
  const botRef = useRef(null)
  const submittedRef = useRef([false, false])

  useEffect(() => { submittedRef.current = submitted }, [submitted])

  // Timer — only runs when started
  useEffect(() => {
    if (phase === 'done' || !started) return
    const interval = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 0.1) {
          clearInterval(interval)
          if (phase === 'write') {
            setPhase('type')
            return TYPE_TIME
          } else {
            forceFinish()
            return 0
          }
        }
        return t - 0.1
      })
    }, 100)
    return () => clearInterval(interval)
  }, [phase, round, started])

  // BOT logic
  useEffect(() => {
    if (!botEnabled || phase !== 'type' || submitted[1] || !started) return
    const { speed, accuracy } = BOT_DIFFICULTY[difficulty]
    const delay = speed * (0.5 + Math.random() * 0.8)
    botRef.current = setTimeout(() => {
      if (submittedRef.current[1]) return
      const correct = Math.random() < accuracy
      setSubmitted(s => { const n = [...s]; n[1] = true; return n })
      setResults(r => { const n = [...r]; n[1] = correct ? 'correct' : 'wrong'; return n })
      if (correct) setScores(sc => { const n = [...sc]; n[1]++; return n })
    }, delay)
    return () => clearTimeout(botRef.current)
  }, [phase, round, botEnabled, started])

  const forceFinish = () => {
    setSubmitted([true, true])
    setResults(r => [r[0] ?? 'wrong', r[1] ?? 'wrong'])
    setShowAnswer(true)
  }

  const submitAnswer = (p) => {
    if (submitted[p]) return
    const val = p === 0 ? type1 : type2
    const isOk = val.trim().length > 0 && checkAnswer(val, id.answer)
    setSubmitted(s => { const n = [...s]; n[p] = true; return n })
    setResults(r => { const n = [...r]; n[p] = isOk ? 'correct' : 'wrong'; return n })
    if (isOk) setScores(sc => { const n = [...sc]; n[p]++; return n })
  }

  useEffect(() => {
    if (submitted[0] && submitted[1]) setShowAnswer(true)
  }, [submitted])

  const nextRound = () => {
    if (round + 1 >= identities.length) { setPhase('done'); return }
    setRound(r => r + 1)
    setPhase('write')
    setTimeLeft(WRITE_TIME)
    setStarted(false)
    setSubmitted([false, false])
    setResults([null, null])
    setType1(''); setType2('')
    setShowAnswer(false)
    clearTimeout(botRef.current)
  }

  const restart = () => window.location.reload()

  if (phase === 'done') {
    let title = "It's a tie!"
    if (scores[0] > scores[1]) title = 'Player 1 wins! 🎉'
    else if (scores[1] > scores[0]) title = botEnabled ? 'BOT wins! 🤖' : 'Player 2 wins! 🎉'
    return (
      <div className="winner-screen">
        <div style={{ fontSize: 48, marginBottom: 16 }}>🏆</div>
        <h2 style={{ fontSize: 28, fontWeight: 900, marginBottom: 8 }}>{title}</h2>
        <div className="final-scores">
          <div className="fc">
            <div style={{ fontSize: 13, color: '#9CA3AF', marginBottom: 6 }}>Player 1</div>
            <div style={{ fontSize: 32, fontWeight: 900, color: '#6366F1' }}>{scores[0]}</div>
          </div>
          <div className="fc">
            <div style={{ fontSize: 13, color: '#9CA3AF', marginBottom: 6 }}>{botEnabled ? '🤖 BOT' : 'Player 2'}</div>
            <div style={{ fontSize: 32, fontWeight: 900, color: '#EC4899' }}>{scores[1]}</div>
          </div>
        </div>
        <button className="next-btn" onClick={restart}>Play Again</button>
      </div>
    )
  }

  const timerPct = phase === 'write'
    ? (timeLeft / WRITE_TIME) * 100
    : (timeLeft / TYPE_TIME) * 100
  const timerColor = timeLeft > 15 ? '#10B981' : timeLeft > 5 ? '#F59E0B' : '#EF4444'

  return (
    <div className="arena">
      <div className="arena-hero">
        <div className="arena-hero-title">⚡ Identity Challenge {botEnabled ? `· 🤖 BOT (${difficulty})` : ''}</div>
        <div className="arena-hero-sub">Write your answer, then type it to auto-check!</div>
      </div>

      <div className="scores">
        <div className="score-p1">
          <div className="score-avatar score-avatar-p1">P1</div>
          <div className="score-info">
            <span className="score-name">Player 1</span>
            <span className="score-val">{scores[0]}</span>
          </div>
        </div>
        <div className="score-p2">
          <div className="score-info" style={{ textAlign: 'right' }}>
            <span className="score-name">{botEnabled ? '🤖 BOT' : 'Player 2'}</span>
            <span className="score-val">{scores[1]}</span>
          </div>
          <div className="score-avatar score-avatar-p2">{botEnabled ? '🤖' : 'P2'}</div>
        </div>
      </div>

      <div className="round-label">
        Round {round + 1} of {identities.length} — {phase === 'write' ? '✏️ Writing' : '⌨️ Typing'} ({Math.ceil(timeLeft)}s)
      </div>

      {/* Timer bar + Start/Pause button */}
      <div style={{ margin: '0 40px 8px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ flex: 1, height: 8, background: '#F3F4F6', borderRadius: 4, overflow: 'hidden' }}>
          <div style={{ height: 8, borderRadius: 4, width: timerPct + '%', background: timerColor, transition: 'width 0.1s linear' }} />
        </div>
        {!started && phase !== 'done' && (
          <button className="tow2-start-btn" style={{ padding: '6px 18px', fontSize: 13 }} onClick={() => setStarted(true)}>
            ▶ Start
          </button>
        )}
        {started && (
          <button className="tow2-pause-btn" style={{ padding: '6px 18px', fontSize: 13 }} onClick={() => setStarted(false)}>
            ⏸ Pause
          </button>
        )}
      </div>

      <div className="formula-display">{id.q}</div>
      <div className="hint-badge">{id.hint}</div>

      <div className="players">
        <div className="player-side">
          <div className="player-header-badge p1">
            <div className="player-badge-dot"></div>
            <span className="player-badge-name">PLAYER 1</span>
            <span className="player-badge-hint">Tab to submit</span>
          </div>
          <DrawCanvas locked={phase !== 'write'} />
          {phase === 'type' && (
            <div className="phase2-box">
              <input
                className="type-input"
                value={type1}
                onChange={e => setType1(e.target.value)}
                onKeyDown={e => { if (e.key === 'Tab') { e.preventDefault(); submitAnswer(0) } }}
                disabled={submitted[0]}
                placeholder="Type your answer..."
              />
              <button className="submit-btn" onClick={() => submitAnswer(0)} disabled={submitted[0]}>Submit</button>
            </div>
          )}
          {results[0] && (
            <div className={`result-banner ${results[0] === 'correct' ? 'rb-ok' : 'rb-bad'}`}>
              {results[0] === 'correct' ? '✅ Correct! +1' : 'Wrong answer'}
            </div>
          )}
        </div>

        <div className="player-side">
          <div className="player-header-badge p2">
            <div className="player-badge-dot"></div>
            <span className="player-badge-name">{botEnabled ? '🤖 BOT' : 'PLAYER 2'}</span>
            <span className="player-badge-hint">{botEnabled ? `${difficulty} difficulty` : 'Enter to submit'}</span>
          </div>

          {botEnabled ? (
            <div style={{ padding: '20px', textAlign: 'center' }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>🤖</div>
              {phase === 'write' && <p style={{ color: '#6B7280', fontSize: 14 }}>BOT is writing...</p>}
              {phase === 'type' && !submitted[1] && started && (
                <div className="tow2-bot-dots"><span /><span /><span /></div>
              )}
              {phase === 'type' && !started && (
                <p style={{ color: '#9CA3AF', fontSize: 13 }}>BOT waiting for timer to start...</p>
              )}
              {submitted[1] && results[1] && (
                <div className={`result-banner ${results[1] === 'correct' ? 'rb-ok' : 'rb-bad'}`}>
                  {results[1] === 'correct' ? '✅ BOT got it right!' : '❌ BOT got it wrong!'}
                </div>
              )}
            </div>
          ) : (
            <>
              <DrawCanvas locked={phase !== 'write'} />
              {phase === 'type' && (
                <div className="phase2-box">
                  <input
                    className="type-input"
                    value={type2}
                    onChange={e => setType2(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); submitAnswer(1) } }}
                    disabled={submitted[1]}
                    placeholder="Type your answer..."
                  />
                  <button className="submit-btn" onClick={() => submitAnswer(1)} disabled={submitted[1]}>Submit</button>
                </div>
              )}
              {results[1] && (
                <div className={`result-banner ${results[1] === 'correct' ? 'rb-ok' : 'rb-bad'}`}>
                  {results[1] === 'correct' ? '✅ Correct! +1' : 'Wrong answer'}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {showAnswer && (
        <div className="answer-reveal">
          Correct answer: <span>{id.display}</span>
          <button className="next-btn" onClick={nextRound}>Next identity</button>
        </div>
      )}
    </div>
  )
}

export default function IdentityChallenge() {
  const [config, setConfig] = useState(null)
  const [key, setKey] = useState(0)

  const handleStart = (bot, diff) => {
    setConfig({ bot, diff })
    setKey(k => k + 1)
  }

  if (!config) return <SetupScreen onStart={handleStart} />
  return <Game key={key} botEnabled={config.bot} difficulty={config.diff} />
}