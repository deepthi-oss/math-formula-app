import { useRef, useEffect, useState, useCallback } from 'react'
import { formulaData, gradeRanges } from './formulaConfig'

const sectors = ['Arithmetic', 'Algebra', 'Geometry']

const BOT_DIFFICULTY = {
  Easy: { speed: 8000, accuracy: 0.4 },
  Medium: { speed: 4000, accuracy: 0.7 },
  Hard: { speed: 1500, accuracy: 0.95 },
}

function SetupScreen({ onStart }) {
  const [mode, setMode] = useState('2team')
  const [difficulty, setDifficulty] = useState('Medium')
  return (
    <div className="tow2-setup">
      <div className="tow2-setup-card">
        <div className="tow2-setup-icon">🎯</div>
        <h2 className="tow2-setup-title">Myth Math Challenge</h2>
        <p className="tow2-setup-sub">Write the answer — compete or practice with BOT!</p>
        <div className="tow2-setup-section">
          <label className="tow2-setup-label">Game Mode</label>
          <div className="tow2-mode-btns">
            <button className={`tow2-mode-btn ${mode === '2team' ? 'active' : ''}`} onClick={() => setMode('2team')}>👥 2 Teams</button>
            <button className={`tow2-mode-btn ${mode === 'bot' ? 'active' : ''}`} onClick={() => setMode('bot')}>🤖 vs BOT</button>
          </div>
        </div>
        {mode === 'bot' && (
          <div className="tow2-setup-section">
            <label className="tow2-setup-label">BOT Difficulty</label>
            <div className="tow2-diff-btns">
              {['Easy', 'Medium', 'Hard'].map(d => (
                <button key={d} className={`tow2-diff-btn tow2-diff-${d.toLowerCase()} ${difficulty === d ? 'active' : ''}`} onClick={() => setDifficulty(d)}>
                  {d === 'Easy' ? '🐢 Easy' : d === 'Medium' ? '🦊 Medium' : '🚀 Hard'}
                </button>
              ))}
            </div>
          </div>
        )}
        <button className="tow2-setup-start" onClick={() => onStart(mode === 'bot', difficulty)}>Let's Play! 🎮</button>
      </div>
    </div>
  )
}

function DrawBoard() {
  const canvasRef = useRef(null)
  const ctxRef = useRef(null)
  const drawingRef = useRef(false)
  const [color, setColor] = useState('#1a1a1a')
  const [penSize, setPenSize] = useState(3)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctxRef.current = ctx
  }, [])

  const getPos = (e) => {
    const canvas = canvasRef.current
    if (!canvas) return { x: 0, y: 0 }
    const r = canvas.getBoundingClientRect()
    const sx = canvas.width / r.width
    const sy = canvas.height / r.height
    if (e.touches) return { x: (e.touches[0].clientX - r.left) * sx, y: (e.touches[0].clientY - r.top) * sy }
    return { x: (e.clientX - r.left) * sx, y: (e.clientY - r.top) * sy }
  }

  const start = (e) => { e.preventDefault(); drawingRef.current = true; const pos = getPos(e); if (ctxRef.current) { ctxRef.current.beginPath(); ctxRef.current.moveTo(pos.x, pos.y) } }
  const move = (e) => { if (!drawingRef.current || !ctxRef.current) return; e.preventDefault(); const pos = getPos(e); ctxRef.current.lineWidth = penSize; ctxRef.current.strokeStyle = color; ctxRef.current.lineTo(pos.x, pos.y); ctxRef.current.stroke() }
  const end = () => { drawingRef.current = false }
  const clear = () => { if (!canvasRef.current || !ctxRef.current) return; ctxRef.current.fillStyle = '#ffffff'; ctxRef.current.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height) }

  return (
    <>
      <div className="canvas-wrap">
        <canvas ref={canvasRef} width={380} height={180} className="draw-canvas-big"
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
  )
}

function TeamBoard({ team, question, sector, onCorrect, onScoreChange }) {
  const [answer, setAnswer] = useState('')
  const [result, setResult] = useState(null) // null | 'correct' | 'wrong'
  const [geoAnswers, setGeoAnswers] = useState({ sides: '', corners: '', angles: '' })
  const [geoResults, setGeoResults] = useState({ sides: null, corners: null, angles: null })
  const inputRef = useRef(null)

  // Reset when question changes
  useEffect(() => {
    setAnswer('')
    setResult(null)
    setGeoAnswers({ sides: '', corners: '', angles: '' })
    setGeoResults({ sides: null, corners: null, angles: null })
    if (inputRef.current) inputRef.current.focus()
  }, [question])

  const handleCheck = useCallback(() => {
    if (!question) return
    if (sector === 'Geometry') {
      const sidesOk = geoAnswers.sides.trim() === String(question.sides || '')
      const cornersOk = geoAnswers.corners.trim() === String(question.corners || '')
      const anglesOk = geoAnswers.angles.trim() === String(question.angles || '')
      const newResults = {
        sides: sidesOk ? 'correct' : 'wrong',
        corners: cornersOk ? 'correct' : 'wrong',
        angles: anglesOk ? 'correct' : 'wrong',
      }
      setGeoResults(newResults)
      if (sidesOk && cornersOk && anglesOk) {
        onScoreChange(1)
        setTimeout(() => onCorrect(), 1500)
      }
    } else {
      if (!answer.trim()) return
      const userAns = answer.trim().toLowerCase().replace(/\s+/g, '')
      const correctAns = String(question.answer || '').toLowerCase().replace(/\s+/g, '')
      const correct = userAns === correctAns
      setResult(correct ? 'correct' : 'wrong')
      if (correct) {
        onScoreChange(1)
        setTimeout(() => onCorrect(), 1500)
      }
    }
  }, [question, sector, answer, geoAnswers, onScoreChange, onCorrect])

  const allGeoCorrect = geoResults.sides === 'correct' && geoResults.corners === 'correct' && geoResults.angles === 'correct'
  const anyGeoWrong = geoResults.sides === 'wrong' || geoResults.corners === 'wrong' || geoResults.angles === 'wrong'
  const geoChecked = geoResults.sides !== null

  return (
    <div className="whiteboard-panel">
      <h3 style={{ textAlign: 'center', marginBottom: 12, fontSize: 15, fontWeight: 900, color: '#6366F1', letterSpacing: 2, textTransform: 'uppercase' }}>{team.name}</h3>

      <DrawBoard key={question?.name || question?.question} />

      {question && sector !== 'Geometry' && (
        <>
          <div className="myth-answer-row" style={{ marginTop: 12 }}>
            <input
              ref={inputRef}
              type="text"
              className={`myth-answer-input ${result ? 'myth-answer-' + result : ''}`}
              placeholder="Type your answer here..."
              value={answer}
              onChange={e => { setAnswer(e.target.value); setResult(null) }}
              onKeyDown={e => { if (e.key === 'Enter') handleCheck() }}
            />
            <button
              className="check-btn"
              onClick={handleCheck}
              style={{ minWidth: 80 }}
            >
              ✓ Check
            </button>
          </div>
          <div className="thumbs-row">
            <div className={`thumb ${result === 'correct' ? 'active' : ''}`}>👍</div>
            <div className={`thumb ${result === 'wrong' ? 'active' : ''}`}>👎</div>
          </div>
          {result === 'correct' && <div style={{ textAlign: 'center', color: '#059669', fontWeight: 700, fontSize: 14 }}>✅ Correct! Moving to next...</div>}
          {result === 'wrong' && <div style={{ textAlign: 'center', color: '#DC2626', fontWeight: 700, fontSize: 14 }}>❌ Wrong! Try again.</div>}
        </>
      )}

      {question && sector === 'Geometry' && (
        <>
          <div className="geometry-fields" style={{ marginTop: 10 }}>
            <div className="geo-field">
              <label>Sides:</label>
              <input type="text" value={geoAnswers.sides}
                onChange={e => { setGeoAnswers(a => ({ ...a, sides: e.target.value })); setGeoResults(r => ({ ...r, sides: null })) }}
                className={`geo-input ${geoResults.sides ? 'geo-' + geoResults.sides : ''}`} placeholder="?" />
            </div>
            <div className="geo-field">
              <label>Corners:</label>
              <input type="text" value={geoAnswers.corners}
                onChange={e => { setGeoAnswers(a => ({ ...a, corners: e.target.value })); setGeoResults(r => ({ ...r, corners: null })) }}
                className={`geo-input ${geoResults.corners ? 'geo-' + geoResults.corners : ''}`} placeholder="?" />
            </div>
            <div className="geo-field">
              <label>Angles:</label>
              <input type="text" value={geoAnswers.angles}
                onChange={e => { setGeoAnswers(a => ({ ...a, angles: e.target.value })); setGeoResults(r => ({ ...r, angles: null })) }}
                className={`geo-input ${geoResults.angles ? 'geo-' + geoResults.angles : ''}`} placeholder="?" />
            </div>
            <button className="check-btn" onClick={handleCheck}>✓ Check</button>
          </div>
          <div className="thumbs-row">
            <div className={`thumb ${geoChecked && allGeoCorrect ? 'active' : ''}`}>👍</div>
            <div className={`thumb ${geoChecked && anyGeoWrong ? 'active' : ''}`}>👎</div>
          </div>
          {geoChecked && allGeoCorrect && <div style={{ textAlign: 'center', color: '#059669', fontWeight: 700, fontSize: 14 }}>✅ Correct! Moving to next...</div>}
        </>
      )}

      <div className="team-score-bar">
        <button className="score-btn minus" onClick={() => onScoreChange(-1)}>−</button>
        <span className="team-score-display">Score: {team.score}</span>
        <button className="score-btn plus" onClick={() => onScoreChange(1)}>+</button>
      </div>
    </div>
  )
}

function BotBoard({ team, question, onCorrect, onScoreChange, botDifficulty, running }) {
  const [botAnswered, setBotAnswered] = useState(false)
  const [botResult, setBotResult] = useState(null)
  const botRef = useRef(null)

  useEffect(() => {
    setBotAnswered(false)
    setBotResult(null)
    clearTimeout(botRef.current)
  }, [question])

  useEffect(() => {
    if (!question || botAnswered || !running) return
    const { speed, accuracy } = BOT_DIFFICULTY[botDifficulty] || BOT_DIFFICULTY['Medium']
    const delay = speed * (0.7 + Math.random() * 0.6)
    botRef.current = setTimeout(() => {
      const correct = Math.random() < accuracy
      setBotAnswered(true)
      setBotResult(correct ? 'correct' : 'wrong')
      if (correct) {
        onScoreChange(1)
        setTimeout(() => onCorrect(), 1500)
      }
    }, delay)
    return () => clearTimeout(botRef.current)
  }, [question, running, botAnswered])

  return (
    <div className="whiteboard-panel">
      <h3 style={{ textAlign: 'center', marginBottom: 12, fontSize: 15, fontWeight: 900, color: '#EC4899', letterSpacing: 2, textTransform: 'uppercase' }}>🤖 BOT</h3>
      <div style={{ background: '#F8FAFF', border: '2px solid #E8EDFF', borderRadius: 12, height: 180, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
        <div style={{ fontSize: 48 }}>🤖</div>
        {question && !botAnswered && running && <div className="tow2-bot-dots"><span /><span /><span /></div>}
        {question && !running && <p style={{ color: '#9CA3AF', fontSize: 13, fontWeight: 600 }}>BOT waiting for start...</p>}
        {botAnswered && <p style={{ fontSize: 14, fontWeight: 800, color: botResult === 'correct' ? '#059669' : '#DC2626' }}>{botResult === 'correct' ? '✅ BOT got it right!' : '❌ BOT got it wrong!'}</p>}
        {!question && <p style={{ color: '#9CA3AF', fontSize: 13 }}>Waiting for question...</p>}
      </div>
      <div className="team-score-bar">
        <button className="score-btn minus" onClick={() => onScoreChange(-1)}>−</button>
        <span className="team-score-display">Score: {team.score}</span>
        <button className="score-btn plus" onClick={() => onScoreChange(1)}>+</button>
      </div>
    </div>
  )
}

function Game({ botEnabled, difficulty }) {
  const [sector, setSector] = useState('Arithmetic')
  const [grade, setGrade] = useState(gradeRanges['Arithmetic'][0])
  const [qIndex, setQIndex] = useState(0)
  const [teams, setTeams] = useState([
    { name: 'Team 1', score: 0 },
    { name: botEnabled ? '🤖 BOT' : 'Team 2', score: 0 },
  ])
  const [newName, setNewName] = useState('')
  const [timeLeft, setTimeLeft] = useState(60)
  const [running, setRunning] = useState(false)
  const [gameOver, setGameOver] = useState(false)
  const timerRef = useRef(null)

  const getList = () => {
    try {
      const rawList = formulaData[sector]?.[grade] || []
      const flat = rawList.flatMap(item => {
        if (!item) return []
        if (item.concept && Array.isArray(item.items)) {
          return item.items.map(q => {
            const str = String(q)
            const qPart = str.split('?')[0].replace('What is ', '').trim()
            const aPart = str.includes('= ') ? str.split('= ')[1]?.trim() : ''
            return { name: qPart + '?', question: qPart + '?', answer: aPart, display: str }
          })
        }
        if (item.name) return [item]
        return []
      })
      return flat.length > 0 ? flat : []
    } catch (e) { return [] }
  }

  const list = getList()
  const currentQuestion = list.length > 0 ? list[qIndex % list.length] : null

  useEffect(() => {
    if (running && !gameOver) {
      timerRef.current = setInterval(() => {
        setTimeLeft(t => {
          if (t <= 1) { clearInterval(timerRef.current); setRunning(false); setGameOver(true); return 0 }
          return t - 1
        })
      }, 1000)
    }
    return () => clearInterval(timerRef.current)
  }, [running, gameOver])

  const nextQuestion = useCallback(() => {
    setQIndex(i => (i + 1) % (list.length || 1))
  }, [list.length])

  const handleSector = (s) => { setSector(s); setGrade(gradeRanges[s][0]); setQIndex(0); setRunning(false); setGameOver(false); setTimeLeft(60); clearInterval(timerRef.current) }
  const handleGrade = (g) => { setGrade(g); setQIndex(0); setRunning(false); setGameOver(false); setTimeLeft(60); clearInterval(timerRef.current) }
  const updateScore = (i, delta) => setTeams(teams.map((t, idx) => idx === i ? { ...t, score: Math.max(0, t.score + delta) } : t))
  const addTeam = () => { if (botEnabled) return; const name = newName.trim() || `Team ${teams.length + 1}`; setTeams([...teams, { name, score: 0 }]); setNewName('') }
  const removeTeam = (i) => setTeams(teams.filter((_, idx) => idx !== i))
  const resetAll = () => { setTeams(teams.map(t => ({ ...t, score: 0 }))); setQIndex(0); setRunning(false); setGameOver(false); setTimeLeft(60); clearInterval(timerRef.current) }

  const mins = String(Math.floor(timeLeft / 60)).padStart(2, '0')
  const secs = String(timeLeft % 60).padStart(2, '0')
  const timerColor = timeLeft > 30 ? '#27500A' : timeLeft > 10 ? '#BA7517' : '#C62828'
  const timerPct = (timeLeft / 60) * 100
  const topScore = Math.max(...teams.map(t => t.score), 0)

  if (gameOver) {
    const winner = teams[0].score > teams[1].score ? teams[0].name : teams[1].score > teams[0].score ? teams[1].name : "It's a Tie!"
    return (
      <div className="winner-screen">
        <div style={{ fontSize: 48, marginBottom: 16 }}>🏆</div>
        <h2 style={{ fontSize: 28, fontWeight: 900, marginBottom: 8 }}>{winner === "It's a Tie!" ? winner : `${winner} wins!`}</h2>
        <div className="final-scores">
          {teams.map((t, i) => (
            <div key={i} className="fc">
              <div style={{ fontSize: 13, color: '#9CA3AF', marginBottom: 6 }}>{t.name}</div>
              <div style={{ fontSize: 32, fontWeight: 900, color: i === 0 ? '#6366F1' : '#EC4899' }}>{t.score}</div>
            </div>
          ))}
        </div>
        <button className="next-btn" onClick={resetAll}>Play Again</button>
      </div>
    )
  }

  return (
    <div className="myth-math-page">
      <div className="sector-tabs">
        {sectors.map(s => <button key={s} className={`sector-tab ${sector === s ? 'active' : ''}`} onClick={() => handleSector(s)}>{s}</button>)}
      </div>
      <div className="grade-tabs">
        {gradeRanges[sector].map(g => <button key={g} className={`grade-tab ${grade === g ? 'active' : ''}`} onClick={() => handleGrade(g)}>{g}</button>)}
      </div>

      {!botEnabled ? (
        <div className="add-team-row">
          <input className="team-name-input" placeholder="Enter team name..." value={newName} onChange={e => setNewName(e.target.value)} onKeyDown={e => e.key === 'Enter' && addTeam()} />
          <button className="add-team-btn" onClick={addTeam}>+ Add Team</button>
          <button className="reset-btn" onClick={resetAll}>Reset</button>
        </div>
      ) : (
        <div className="add-team-row" style={{ justifyContent: 'space-between' }}>
          <div style={{ background: '#EEF2FF', border: '2px solid #C7D2FE', borderRadius: 10, padding: '8px 16px', fontSize: 14, fontWeight: 700, color: '#4F46E5' }}>
            🤖 BOT Mode — {difficulty} difficulty
          </div>
          <button className="reset-btn" onClick={resetAll}>Reset</button>
        </div>
      )}

      {list.length === 0 && (
        <div style={{ textAlign: 'center', padding: 24, color: '#9CA3AF', fontSize: 14, background: '#F8FAFF', borderRadius: 12, margin: '12px 0' }}>
          No questions available for this grade yet. Please select another grade.
        </div>
      )}

      {currentQuestion && (
        <>
          <div className="active-question">
            {sector === 'Geometry'
              ? <><strong>{currentQuestion.name}</strong> — What are the properties?</>
              : <><strong>{String(currentQuestion.display || currentQuestion.question || '').split('=')[0].trim()}</strong></>
            }
          </div>
          <div className="timer-row">
            <div className="timer-circle" style={{ borderColor: timerColor, color: timerColor }}>
              <span className="timer-number" style={{ fontSize: 20 }}>{mins}:{secs}</span>
            </div>
            <div className="timer-bar">
              <div className="timer-fill" style={{ width: timerPct + '%', background: timerColor, transition: 'width 1s linear' }} />
            </div>
            <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
              {!running && !gameOver && <button className="tow2-start-btn" onClick={() => setRunning(true)}>▶ Start</button>}
              {running && <button className="tow2-pause-btn" onClick={() => { setRunning(false); clearInterval(timerRef.current) }}>⏸ Pause</button>}
              <button className="tow2-reset-btn" onClick={nextQuestion} title="Next question">⏭</button>
            </div>
          </div>
        </>
      )}

      {!botEnabled && list.length > 0 && (
        <div className="question-picker">
          <label>Jump to: </label>
          <select value={qIndex} onChange={e => setQIndex(parseInt(e.target.value))}>
            {list.map((f, i) => <option key={i} value={i}>{f.name || f.question || ''}</option>)}
          </select>
        </div>
      )}

      <div className="whiteboards-grid">
        {teams.map((team, i) => {
          const isBot = botEnabled && i === 1
          return (
            <div key={i} className={`whiteboard-wrapper ${team.score === topScore && team.score > 0 ? 'is-leading' : ''}`}>
              <div className="whiteboard-header-row">
                <span className="whiteboard-rank">#{i + 1}</span>
                {team.score === topScore && team.score > 0 && <span className="leader-badge">👑 Leading</span>}
                {!isBot && teams.length > 2 && <button className="remove-btn" onClick={() => removeTeam(i)}>✕</button>}
              </div>
              {isBot ? (
                <BotBoard
                  team={team}
                  question={currentQuestion}
                  onScoreChange={(delta) => updateScore(i, delta)}
                  onCorrect={nextQuestion}
                  botDifficulty={difficulty || 'Medium'}
                  running={running}
                />
              ) : (
                <TeamBoard
                  team={team}
                  question={currentQuestion}
                  sector={sector}
                  onScoreChange={(delta) => updateScore(i, delta)}
                  onCorrect={nextQuestion}
                />
              )}
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
  const handleStart = (bot, diff) => { setConfig({ bot, diff }); setKey(k => k + 1) }
  if (!config) return <SetupScreen onStart={handleStart} />
  return <Game key={key} botEnabled={config.bot} difficulty={config.diff || 'Medium'} />
}