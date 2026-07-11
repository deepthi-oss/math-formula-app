import { useRef, useEffect, useState } from 'react'
import { formulaData, gradeRanges } from './formulaConfig'

const sectors = ['Arithmetic', 'Algebra', 'Geometry']

function Whiteboard({ team, question, onScoreChange, onCorrect }) {
  const canvasRef = useRef(null)
  const ctxRef = useRef(null)
  const drawingRef = useRef(false)
  const [color, setColor] = useState('#1a1a1a')
  const [penSize, setPenSize] = useState(3)
  const [answers, setAnswers] = useState({ sides: '', corners: '', angles: '' })
  const [results, setResults] = useState({ sides: null, corners: null, angles: null })

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
  }, [question])

  const getPos = (e) => {
    const canvas = canvasRef.current
    const r = canvas.getBoundingClientRect()
    const sx = canvas.width / r.width
    const sy = canvas.height / r.height
    if (e.touches) return { x: (e.touches[0].clientX - r.left) * sx, y: (e.touches[0].clientY - r.top) * sy }
    return { x: (e.clientX - r.left) * sx, y: (e.clientY - r.top) * sy }
  }

  const start = (e) => {
    e.preventDefault()
    drawingRef.current = true
    const pos = getPos(e)
    ctxRef.current.beginPath()
    ctxRef.current.moveTo(pos.x, pos.y)
  }

  const move = (e) => {
    if (!drawingRef.current) return
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
      onCorrect()
    }
  }

  const allCorrect = results.sides === 'correct' && results.corners === 'correct' && results.angles === 'correct'
  const anyWrong = results.sides === 'wrong' || results.corners === 'wrong' || results.angles === 'wrong'
  const checked = results.sides !== null

  return (
    <div className="whiteboard-panel">
      <h3>{team.name}</h3>
      <div className="canvas-wrap">
        <canvas
          ref={canvasRef}
          width={380}
          height={200}
          className="draw-canvas-big"
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
        <button className="tool-btn" onClick={clear}>Clear</button>
        <div className={`cdot ${color === '#1a1a1a' ? 'active' : ''}`} style={{ background: '#1a1a1a' }} onClick={() => setColor('#1a1a1a')} />
        <div className={`cdot ${color === '#185FA5' ? 'active' : ''}`} style={{ background: '#185FA5' }} onClick={() => setColor('#185FA5')} />
        <div className={`cdot ${color === '#993C1D' ? 'active' : ''}`} style={{ background: '#993C1D' }} onClick={() => setColor('#993C1D')} />
        <input type="range" min="1" max="8" value={penSize} onChange={(e) => setPenSize(parseInt(e.target.value))} className="pen-sz" />
      </div>

      {question && (
        <div className="geometry-fields">
          <div className="geo-field">
            <label>Sides:</label>
            <input type="text" value={answers.sides} onChange={(e) => setAnswers({ ...answers, sides: e.target.value })} className={`geo-input ${results.sides ? 'geo-' + results.sides : ''}`} placeholder="?" />
          </div>
          <div className="geo-field">
            <label>Corners:</label>
            <input type="text" value={answers.corners} onChange={(e) => setAnswers({ ...answers, corners: e.target.value })} className={`geo-input ${results.corners ? 'geo-' + results.corners : ''}`} placeholder="?" />
          </div>
          <div className="geo-field">
            <label>Angles:</label>
            <input type="text" value={answers.angles} onChange={(e) => setAnswers({ ...answers, angles: e.target.value })} className={`geo-input ${results.angles ? 'geo-' + results.angles : ''}`} placeholder="?" />
          </div>
          <button className="check-btn" onClick={checkAnswers}>Check</button>
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

export default function MythMathChallenge() {
  const [sector, setSector] = useState('Geometry')
  const [grade, setGrade] = useState(gradeRanges['Geometry'][0])
  const [selectedQuestion, setSelectedQuestion] = useState(null)
  const [timeLeft, setTimeLeft] = useState(60)
  const [timerActive, setTimerActive] = useState(false)
  const [teams, setTeams] = useState([
    { name: 'Team 1', score: 0 },
    { name: 'Team 2', score: 0 },
  ])
  const [newName, setNewName] = useState('')

  const list = formulaData[sector]?.[grade] || []

  useEffect(() => {
    if (!timerActive) return
    if (timeLeft <= 0) { setTimerActive(false); return }
    const interval = setInterval(() => {
      setTimeLeft(t => t - 1)
    }, 1000)
    return () => clearInterval(interval)
  }, [timerActive, timeLeft])

  const handleSector = (s) => {
    setSector(s)
    setGrade(gradeRanges[s][0])
    setSelectedQuestion(null)
    setTimeLeft(60)
    setTimerActive(false)
  }

  const handleGrade = (g) => {
    setGrade(g)
    setSelectedQuestion(null)
    setTimeLeft(60)
    setTimerActive(false)
  }

 const handleSelectQuestion = (name) => {
    const found = list.find(f => f.name === name)
    setSelectedQuestion(found || null)
    setTimeLeft(60)
    setTimerActive(true)
  }

  const addTeam = () => {
    const name = newName.trim() || `Team ${teams.length + 1}`
    setTeams([...teams, { name, score: 0 }])
    setNewName('')
  }

  const removeTeam = (i) => {
    setTeams(teams.filter((_, idx) => idx !== i))
  }

  const updateScore = (i, delta) => {
    setTeams(teams.map((t, idx) => idx === i ? { ...t, score: Math.max(0, t.score + delta) } : t))
  }

  const resetScores = () => {
    setTeams(teams.map(t => ({ ...t, score: 0 })))
  }

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

      <div className="add-team-row">
        <input
          className="team-name-input"
          placeholder="Enter team name..."
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') addTeam() }}
        />
        <button className="add-team-btn" onClick={addTeam}>+ Add Team</button>
        <button className="reset-btn" onClick={resetScores}>Reset Scores</button>
      </div>

      <div className="question-picker">
        <label>Pick the active question: </label>
        <select value={selectedQuestion ? selectedQuestion.name : ''} onChange={(e) => handleSelectQuestion(e.target.value)}>
          <option value="">-- Select a shape --</option>
          {list.map((f, i) => (
            <option key={i} value={f.name}>{f.name}</option>
          ))}
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
            <button
              className="timer-toggle-btn"
              onClick={() => setTimerActive(a => !a)}
              disabled={timeLeft === 0}
            >
              {timerActive ? '⏸ Pause' : '▶ Start'}
            </button>
          </div>
          {timeLeft === 0 && (
            <div style={{ textAlign: 'center', color: '#C62828', fontWeight: 700, fontSize: 18, marginBottom: 10 }}>
              ⏰ Time's up!
            </div>
          )}
        </>
      )}

      <div className="whiteboards-grid">
        {teams.map((team, i) => (
          <div key={i} className={`whiteboard-wrapper ${team.score === topScore && team.score > 0 ? 'is-leading' : ''}`}>
            <div className="whiteboard-header-row">
              <span className="whiteboard-rank">#{i + 1}</span>
              {team.score === topScore && team.score > 0 && <span className="leader-badge">👑 Leading</span>}
              <button className="remove-btn" onClick={() => removeTeam(i)}>✕ Remove</button>
            </div>
            <Whiteboard
              team={team}
              question={selectedQuestion}
              onScoreChange={(delta) => updateScore(i, delta)}
              onCorrect={() => setTimerActive(false)}
            />
          </div>
        ))}
      </div>
    </div>
  )
}