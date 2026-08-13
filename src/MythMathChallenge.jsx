import { useRef, useEffect, useState } from 'react'
import { formulaData, gradeRanges } from './formulaConfig'

const sectors = ['Arithmetic', 'Algebra', 'Geometry']

const BOT_DIFFICULTY = {
  Easy: { speed: 15000, accuracy: 0.4 },
  Medium: { speed: 7000, accuracy: 0.7 },
  Hard: { speed: 3000, accuracy: 0.95 },
}

// ── Setup Screen ──────────────────────────────────────
function SetupScreen({ onStart }) {
  const [mode, setMode] = useState('2team')
  const [difficulty, setDifficulty] = useState('Medium')

  return (
    <div className="tow2-setup">
      <div className="tow2-setup-card">
        <div className="tow2-setup-icon">🎯</div>
        <h2 className="tow2-setup-title">Myth Math Challenge</h2>
        <p className="tow2-setup-sub">Write the properties of shapes — compete or practice with BOT!</p>

        <div className="tow2-setup-section">
          <label className="tow2-setup-label">Game Mode</label>
          <div className="tow2-mode-btns">
            <button className={`tow2-mode-btn ${mode === '2team' ? 'active' : ''}`} onClick={() => setMode('2team')}>
              👥 2 Teams
            </button>
            <button className={`tow2-mode-btn ${mode === 'bot' ? 'active' : ''}`} onClick={() => setMode('bot')}>
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

// ── Whiteboard ────────────────────────────────────────
function Whiteboard({ team, question, onScoreChange, onCorrect, isBot, botDifficulty }) {
  const canvasRef = useRef(null)
  const ctxRef = useRef(null)
  const drawingRef = useRef(false)
  const [color, setColor] = useState('#1a1a1a')
  const [penSize, setPenSize] = useState(3)
  const [answers, setAnswers] = useState({ sides: '', corners: '', angles: '' })
  const [results, setResults] = useState({ sides: null, corners: null, angles: null })
  const [botAnswered, setBotAnswered] = useState(false)
  const botRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctxRef.current = ctx
  }, [])

  useEffect(() => {
    setAnswers({ sides: '', corners: '', angles: '' })
    setResults({ sides: null, corners: null, angles: null })
    setBotAnswered(false)
    clearTimeout(botRef.current)
  }, [question])

  // BOT auto-answer
  useEffect(() => {
    if (!isBot || !question || botAnswered) return
    const { speed, accuracy } = BOT_DIFFICULTY[botDifficulty]
    const delay = speed * (0.6 + Math.random() * 0.8)
    botRef.current = setTimeout(() => {
      const correct = Math.random() < accuracy
      setBotAnswered(true)
      if (correct) {
        setResults({ sides: 'correct', corners: 'correct', angles: 'correct' })
        onScoreChange(1)
        onCorrect()
      } else {
        setResults({ sides: 'wrong', corners: 'wrong', angles: 'wrong' })
      }
    }, delay)
    return () => clearTimeout(botRef.current)
  }, [question, isBot, botAnswered])

  const getPos = (e) => {
    const canvas = canvasRef.current
    const r = canvas.getBoundingClientRect()
    const sx = canvas.width / r.width
    const sy = canvas.height / r.height
    if (e.touches) return { x: (e.touches[0].clientX - r.left) * sx, y: (e.touches[0].clientY - r.top) * sy }
    return { x: (e.clientX - r.left) * sx, y: (e.clientY - r.top) * sy }
  }

  const start = (e) => { if (isBot) return; e.preventDefault(); drawingRef.current = true; const pos = getPos(e); ctxRef.current.beginPath(); ctxRef.current.moveTo(pos.x, pos.y) }
  const move = (e) => { if (!drawingRef.current || isBot) return; e.preventDefault(); const pos = getPos(e); ctxRef.current.lineWidth = penSize; ctxRef.current.strokeStyle = color; ctxRef.current.lineTo(pos.x, pos.y); ctxRef.current.stroke() }
  const end = () => { drawingRef.current = false }

  const clear = () => {
    if (isBot) return
    const canvas = canvasRef.current
    ctxRef.current.fillStyle = '#ffffff'
    ctxRef.current.fillRect(0, 0, canvas.width, canvas.height)
    setAnswers({ sides: '', corners: '', angles: '' })
    setResults({ sides: null, corners: null, angles: null })
  }

  const checkAnswers = () => {
    if (!question) return
    const sidesOk = answers.sides.trim() === question.sides
    const cornersOk = answers.corners.trim() === question.corners
    const anglesOk = answers.angles.trim() === question.angles
    setResults({
      sides: sidesOk ? 'correct' : 'wrong',
      corners: cornersOk ? 'correct' : 'wrong',
      angles: anglesOk ? 'correct' : 'wrong',
    })
    if (sidesOk && cornersOk && anglesOk) {
      onScoreChange(1)
      setTimeout(() => onCorrect(), 0)
    }
  }

  const allCorrect = results.sides === 'correct' && results.corners === 'correct' && results.angles === 'correct'
  const anyWrong = results.sides === 'wrong' || results.corners === 'wrong' || results.angles === 'wrong'
  const checked = results.sides !== null

  return (
    <div className="whiteboard-panel">
      <h3>{isBot ? '🤖 BOT' : team.name}</h3>

      {isBot ? (
        <div style={{ background: '#F8FAFF', border: '2px solid #E8EDFF', borderRadius: 12, height: 200, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
          <div style={{ fontSize: 48 }}>🤖</div>
          {question && !botAnswered && (
            <div className="tow2-bot-dots"><span /><span /><span /></div>
          )}
          {botAnswered && (
            <p style={{ fontSize: 13, fontWeight: 700, color: allCorrect ? '#059669' : '#DC2626' }}>
              {allCorrect ? '✅ BOT answered correctly!' : '❌ BOT got it wrong!'}
            </p>
          )}
          {!question && <p style={{ color: '#9CA3AF', fontSize: 13 }}>Waiting for question...</p>}
        </div>
      ) : (
        <>
          <div className="canvas-wrap">
            <canvas ref={canvasRef} width={380} height={200} className="draw-canvas-big"
              onMouseDown={start} onMouseMove={move} onMouseUp={end} onMouseLeave={end}
              onTouchStart={start} onTouchMove={move} onTouchEnd={end} />
          </div>
          <div className="canvas-tools">
            <button className="tool-btn" onClick={clear}>Clear</button>
            <div className={`cdot ${color === '#1a1a1a' ? 'active' : ''}`} style={{ background: '#1a1a1a' }} onClick={() => setColor('#1a1a1a')} />
            <div className={`cdot ${color === '#185FA5' ? 'active' : ''}`} style={{ background: '#185FA5' }} onClick={() => setColor('#185FA5')} />
            <div className={`cdot ${color === '#993C1D' ? 'active' : ''}`} style={{ background: '#993C1D' }} onClick={() => setColor('#993C1D')} />
            <input type="range" min="1" max="8" value={penSize} onChange={e => setPenSize(parseInt(e.target.value))} className="pen-sz" />
          </div>
        </>
      )}

      {question && !isBot && (
        <div className="geometry-fields">
          <div className="geo-field">
            <label>Sides:</label>
            <input type="text" value={answers.sides}
              onChange={e => { setAnswers({ ...answers, sides: e.target.value }); setResults(r => ({ ...r, sides: null })) }}
              className={`geo-input ${results.sides ? 'geo-' + results.sides : ''}`} placeholder="?" />
          </div>
          <div className="geo-field">
            <label>Corners:</label>
            <input type="text" value={answers.corners}
              onChange={e => { setAnswers({ ...answers, corners: e.target.value }); setResults(r => ({ ...r, corners: null })) }}
              className={`geo-input ${results.corners ? 'geo-' + results.corners : ''}`} placeholder="?" />
          </div>
          <div className="geo-field">
            <label>Angles:</label>
            <input type="text" value={answers.angles}
              onChange={e => { setAnswers({ ...answers, angles: e.target.value }); setResults(r => ({ ...r, angles: null })) }}
              className={`geo-input ${results.angles ? 'geo-' + results.angles : ''}`} placeholder="?" />
          </div>
          <button className="check-btn" onClick={checkAnswers}>Check</button>
        </div>
      )}

      {question && isBot && checked && (
        <div className="geometry-fields" style={{ opacity: 0.6 }}>
          <div className="geo-field"><label>Sides:</label><input className={`geo-input geo-${results.sides}`} value={allCorrect ? question.sides : '?'} readOnly /></div>
          <div className="geo-field"><label>Corners:</label><input className={`geo-input geo-${results.corners}`} value={allCorrect ? question.corners : '?'} readOnly /></div>
          <div className="geo-field"><label>Angles:</label><input className={`geo-input geo-${results.angles}`} value={allCorrect ? question.angles : '?'} readOnly /></div>
        </div>
      )}

      <div className="thumbs-row">
        <div className={`thumb ${checked && allCorrect ? 'active' : ''}`}>👍</div>
        <div className={`thumb ${checked && anyWrong ? 'active' : ''}`}>👎</div>
      </div>

      <div className="team-score-bar">
        <button className="score-btn minus" onClick={() => onScoreChange(-1)}>−</button>
        <span className="team-score-display">Score: {team.score}</span>
        <button className="score-btn plus" onClick={() => onScoreChange(1)}>+</button>
      </div>
    </div>
  )
}

// ── Main Game ─────────────────────────────────────────
function Game({ botEnabled, difficulty }) {
  const [sector, setSector] = useState('Geometry')
  const [grade, setGrade] = useState(gradeRanges['Geometry'][0])
  const [selectedQuestion, setSelectedQuestion] = useState(null)
  const [timeLeft, setTimeLeft] = useState(60)
  const [timerActive, setTimerActive] = useState(false)
  const [teams, setTeams] = useState([
    { name: 'Team 1', score: 0 },
    { name: botEnabled ? '🤖 BOT' : 'Team 2', score: 0 },
  ])
  const [newName, setNewName] = useState('')

  const rawList = formulaData[sector]?.[grade] || []
  const list = rawList.flatMap(item => item.concept ? item.items.map(q => ({ name: q.split('?')[0].replace('What is ', '').trim() + '?', question: q, answer: q.split('= ')[1] })) : [item])

  useEffect(() => {
    if (!timerActive) return
    if (timeLeft <= 0) { setTimerActive(false); return }
    const interval = setInterval(() => setTimeLeft(t => t - 1), 1000)
    return () => clearInterval(interval)
  }, [timerActive, timeLeft])

  const handleSector = (s) => { setSector(s); setGrade(gradeRanges[s][0]); setSelectedQuestion(null); setTimeLeft(60); setTimerActive(false) }
  const handleGrade = (g) => { setGrade(g); setSelectedQuestion(null); setTimeLeft(60); setTimerActive(false) }
  const handleSelectQuestion = (name) => { const found = list.find(f => f.name === name); setSelectedQuestion(found || null); setTimeLeft(60); setTimerActive(true) }
  const addTeam = () => { if (botEnabled) return; const name = newName.trim() || `Team ${teams.length + 1}`; setTeams([...teams, { name, score: 0 }]); setNewName('') }
  const removeTeam = (i) => setTeams(teams.filter((_, idx) => idx !== i))
  const updateScore = (i, delta) => setTeams(teams.map((t, idx) => idx === i ? { ...t, score: Math.max(0, t.score + delta) } : t))
  const resetScores = () => setTeams(teams.map(t => ({ ...t, score: 0 })))

  const timerColor = timeLeft > 30 ? '#27500A' : timeLeft > 10 ? '#BA7517' : '#C62828'
  const timerPct = (timeLeft / 60) * 100
  const topScore = Math.max(...teams.map(t => t.score), 0)

  return (
    <div className="myth-math-page">
      <div className="sector-tabs">
        {sectors.map(s => (
          <button key={s} className={`sector-tab ${sector === s ? 'active' : ''}`} onClick={() => handleSector(s)}>{s}</button>
        ))}
      </div>

      <div className="grade-tabs">
        {gradeRanges[sector].map(g => (
          <button key={g} className={`grade-tab ${grade === g ? 'active' : ''}`} onClick={() => handleGrade(g)}>{g}</button>
        ))}
      </div>

      {!botEnabled && (
        <div className="add-team-row">
          <input className="team-name-input" placeholder="Enter team name..." value={newName}
            onChange={e => setNewName(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && addTeam()} />
          <button className="add-team-btn" onClick={addTeam}>+ Add Team</button>
          <button className="reset-btn" onClick={resetScores}>Reset Scores</button>
        </div>
      )}

      {botEnabled && (
        <div className="add-team-row">
          <div style={{ background: '#EEF2FF', border: '2px solid #C7D2FE', borderRadius: 10, padding: '8px 16px', fontSize: 14, fontWeight: 700, color: '#4F46E5' }}>
            🤖 BOT Mode — {difficulty} difficulty
          </div>
          <button className="reset-btn" onClick={resetScores}>Reset Scores</button>
        </div>
      )}

      <div className="question-picker">
        <label>Pick the active question: </label>
        <select value={selectedQuestion ? selectedQuestion.name : ''} onChange={e => handleSelectQuestion(e.target.value)}>
          <option value="">-- Select a shape --</option>
          {list.map((f, i) => <option key={i} value={f.name}>{f.name}</option>)}
        </select>
      </div>

      {selectedQuestion && (
        <>
          <div className="active-question">
            What are the properties of: <strong>{selectedQuestion.name}</strong>?
          </div>
          <div className="timer-row">
            <div className="timer-circle" style={{ borderColor: timerColor, color: timerColor }}>
              <span className="timer-number">{timeLeft}</span>
              <span className="timer-sec">sec</span>
            </div>
            <div className="timer-bar">
              <div className="timer-fill" style={{ width: timerPct + '%', background: timerColor, transition: 'width 1s linear' }} />
            </div>
            <button className="timer-toggle-btn" onClick={() => setTimerActive(a => !a)} disabled={timeLeft === 0}>
              {timerActive ? '⏸ Pause' : '▶ Resume'}
            </button>
          </div>
          {timeLeft === 0 && (
            <div style={{ textAlign: 'center', color: '#C62828', fontWeight: 700, fontSize: 18, marginBottom: 10 }}>⏰ Time's up!</div>
          )}
        </>
      )}

      <div className="whiteboards-grid">
        {teams.map((team, i) => {
          const isBot = botEnabled && i === 1
          return (
            <div key={i} className={`whiteboard-wrapper ${team.score === topScore && team.score > 0 ? 'is-leading' : ''}`}>
              <div className="whiteboard-header-row">
                <span className="whiteboard-rank">#{i + 1}</span>
                {team.score === topScore && team.score > 0 && <span className="leader-badge">👑 Leading</span>}
                {!isBot && <button className="remove-btn" onClick={() => removeTeam(i)}>✕ Remove</button>}
              </div>
              <Whiteboard
                team={team}
                question={selectedQuestion}
                onScoreChange={(delta) => updateScore(i, delta)}
                onCorrect={() => setTimerActive(false)}
                isBot={isBot}
                botDifficulty={difficulty}
              />
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default function MythMathChallenge() {
  const [config, setConfig] = useState(null)
  const [key, setKey] = useState(0)

  const handleStart = (bot, diff) => {
    setConfig({ bot, diff })
    setKey(k => k + 1)
  }

  if (!config) return <SetupScreen onStart={handleStart} />
  return <Game key={key} botEnabled={config.bot} difficulty={config.diff} />
}