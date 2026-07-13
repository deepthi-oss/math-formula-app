import { useState } from 'react'
import { formulaData, gradeRanges } from './formulaConfig'

const sectors = ['Arithmetic', 'Algebra', 'Geometry']

const TEAM_COLORS = [
  { bg: '#EEF2FF', border: '#C7D2FE', text: '#4F46E5', accent: '#6366F1', light: '#E0E7FF' },
  { bg: '#FDF2F8', border: '#FBCFE8', text: '#DB2777', accent: '#EC4899', light: '#FCE7F3' },
  { bg: '#ECFDF5', border: '#A7F3D0', text: '#059669', accent: '#10B981', light: '#D1FAE5' },
  { bg: '#FFFBEB', border: '#FDE68A', text: '#D97706', accent: '#F59E0B', light: '#FEF3C7' },
  { bg: '#FEF2F2', border: '#FECACA', text: '#DC2626', accent: '#EF4444', light: '#FEE2E2' },
]

function QuestionCard({ question, onAnswer }) {
  const [input, setInput] = useState('')
  const [answered, setAnswered] = useState(false)

  const handleSubmit = (teamIdx) => {
    if (!input.trim() || answered) return
    const correct = input.trim().toLowerCase().replace(/\s+/g, '') ===
      (question.answer || '').toLowerCase().replace(/\s+/g, '')
    setAnswered(true)
    onAnswer(teamIdx, correct)
    setTimeout(() => {
      setInput('')
      setAnswered(false)
    }, 1500)
  }

  if (!question) return (
    <div className="tow-no-question">
      <div className="tow-no-q-icon">❓</div>
      <p>Select a sector, grade and question above to start!</p>
    </div>
  )

  return (
    <div className="tow-question-card">
      <div className="tow-q-label">Current Question</div>
      <div className="tow-q-text">{question.question}</div>
      {question.type === 'mcq' && (
        <div className="tow-mcq-options">
          {question.options.map((opt, i) => (
            <button
              key={i}
              className="tow-mcq-btn"
              disabled={answered}
              onClick={() => {
                setInput(opt)
                const correct = opt === question.answer
                setAnswered(true)
                setTimeout(() => setAnswered(false), 1500)
              }}
            >
              {String.fromCharCode(65 + i)}. {opt}
            </button>
          ))}
        </div>
      )}
      {question.type === 'text' && (
        <div className="tow-text-input-row">
          <input
            className="tow-text-input"
            placeholder="Type your answer..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSubmit(0)}
            disabled={answered}
          />
        </div>
      )}
      {answered && <div className="tow-answered-badge">✅ Answer recorded!</div>}
    </div>
  )
}

function TugBar({ teams, totalCorrect }) {
  const total = teams.reduce((sum, t) => sum + t.score, 0) || 1
  return (
    <div className="tow-bar-section">
      <div className="tow-bar-labels">
        {teams.map((t, i) => (
          <div key={i} className="tow-bar-team-label" style={{ color: TEAM_COLORS[i % TEAM_COLORS.length].accent }}>
            <span className="tow-bar-team-name">{t.name}</span>
            <span className="tow-bar-team-score">{t.score} pts</span>
          </div>
        ))}
      </div>
      <div className="tow-bar-track">
        {teams.map((t, i) => {
          const pct = (t.score / total) * 100
          return (
            <div
              key={i}
              className="tow-bar-fill"
              style={{
                width: pct + '%',
                background: TEAM_COLORS[i % TEAM_COLORS.length].accent,
                transition: 'width 0.6s ease',
              }}
            />
          )
        })}
        <div className="tow-rope-knot">🪢</div>
      </div>
      <div className="tow-bar-team-names">
        {teams.map((t, i) => (
          <span key={i} style={{ color: TEAM_COLORS[i % TEAM_COLORS.length].accent, fontWeight: 700, fontSize: 12 }}>
            {t.name}
          </span>
        ))}
      </div>
    </div>
  )
}

export default function TugOfWar() {
  const [sector, setSector] = useState('Geometry')
  const [grade, setGrade] = useState(gradeRanges['Geometry'][0])
  const [teams, setTeams] = useState([
    { name: 'Team 1', score: 0 },
    { name: 'Team 2', score: 0 },
  ])
  const [newName, setNewName] = useState('')
  const [selectedQ, setSelectedQ] = useState(null)
  const [history, setHistory] = useState([])
  const [winner, setWinner] = useState(null)

  const list = formulaData[sector]?.[grade] || []

  const questions = list.map((f, i) => {
    if (typeof f === 'object') {
      return {
        id: i,
        type: 'text',
        question: `What are the sides of a ${f.name}?`,
        answer: f.sides,
        display: f.name,
      }
    }
    return {
      id: i,
      type: 'text',
      question: f.split('=')[0]?.trim() + ' = ?',
      answer: f.split('=')[1]?.trim() || f,
      display: f,
    }
  })

  const addTeam = () => {
    const name = newName.trim() || `Team ${teams.length + 1}`
    setTeams([...teams, { name, score: 0 }])
    setNewName('')
  }

  const removeTeam = (i) => setTeams(teams.filter((_, idx) => idx !== i))

  const awardPoint = (teamIdx) => {
    const updated = teams.map((t, i) => i === teamIdx ? { ...t, score: t.score + 1 } : t)
    setTeams(updated)
    setHistory(h => [...h, { team: teams[teamIdx].name, q: selectedQ?.display || '?' }])
  }

  const declareWinner = () => {
    const max = Math.max(...teams.map(t => t.score))
    const winners = teams.filter(t => t.score === max)
    setWinner(winners.length === 1 ? winners[0].name : 'TIE')
  }

  const reset = () => {
    setTeams(teams.map(t => ({ ...t, score: 0 })))
    setHistory([])
    setWinner(null)
    setSelectedQ(null)
  }

  const totalScore = teams.reduce((s, t) => s + t.score, 0)

  return (
    <div className="tow-page">
      <div className="tow-hero">
        <div className="tow-hero-left">
          <div className="tow-hero-title">🪢 Tug of War Challenge</div>
          <div className="tow-hero-sub">Answer correctly to pull the rope to your side — most points wins!</div>
        </div>
        <div className="tow-hero-btns">
          <button className="tow-winner-btn" onClick={declareWinner}>🏆 Declare Winner</button>
          <button className="tow-reset-btn" onClick={reset}>🔄 Reset</button>
        </div>
      </div>

      {winner && (
        <div className="tow-winner-banner">
          {winner === 'TIE' ? "🤝 It's a tie! Both teams are equally strong!" : `🎉 ${winner} wins the Tug of War!`}
          <button className="tow-play-again-btn" onClick={reset}>Play Again</button>
        </div>
      )}

      <TugBar teams={teams} totalCorrect={totalScore} />

      <div className="tow-controls">
        <div className="tow-selectors">
          <div className="tow-sector-tabs">
            {sectors.map(s => (
              <button key={s} className={`tow-sector-tab ${sector === s ? 'active' : ''}`}
                onClick={() => { setSector(s); setGrade(gradeRanges[s][0]); setSelectedQ(null) }}>
                {s}
              </button>
            ))}
          </div>
          <div className="tow-grade-row">
            {gradeRanges[sector].map(g => (
              <button key={g} className={`tow-grade-btn ${grade === g ? 'active' : ''}`}
                onClick={() => { setGrade(g); setSelectedQ(null) }}>
                {g}
              </button>
            ))}
          </div>
          <div className="tow-q-picker">
            <label>Pick question:</label>
            <select value={selectedQ?.id ?? ''} onChange={e => {
              const q = questions.find(q => q.id === parseInt(e.target.value))
              setSelectedQ(q || null)
            }}>
              <option value="">-- Select a question --</option>
              {questions.map((q, i) => (
                <option key={i} value={q.id}>{q.display}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="tow-question-area">
          {selectedQ ? (
            <div className="tow-question-card">
              <div className="tow-q-label">📋 Current Question</div>
              <div className="tow-q-text">{selectedQ.question}</div>
              <div className="tow-q-answer-hint">Answer: <strong>{selectedQ.answer}</strong></div>
            </div>
          ) : (
            <div className="tow-no-question">
              <div className="tow-no-q-icon">❓</div>
              <p>Select a question above to begin!</p>
            </div>
          )}
        </div>
      </div>

      <div className="tow-teams-section">
        <div className="tow-teams-header">
          <div className="tow-add-team-row">
            <input className="tow-team-input" placeholder="Team name..." value={newName}
              onChange={e => setNewName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && addTeam()} />
            <button className="tow-add-btn" onClick={addTeam}>+ Add Team</button>
          </div>
        </div>

        <div className="tow-teams-grid">
          {teams.map((team, i) => {
            const color = TEAM_COLORS[i % TEAM_COLORS.length]
            const isLeading = team.score === Math.max(...teams.map(t => t.score)) && team.score > 0
            return (
              <div key={i} className="tow-team-card" style={{ borderColor: isLeading ? color.accent : color.border, background: color.bg }}>
                <div className="tow-team-card-header" style={{ borderBottomColor: color.border }}>
                  <span className="tow-team-emoji">{['🔵','🔴','🟢','🟡','🟠'][i % 5]}</span>
                  <span className="tow-team-card-name" style={{ color: color.text }}>{team.name}</span>
                  {isLeading && <span className="tow-leading-badge">👑 Leading</span>}
                  <button className="tow-remove-btn" onClick={() => removeTeam(i)}>✕</button>
                </div>
                <div className="tow-team-card-body">
                  <div className="tow-team-score-big" style={{ color: color.accent }}>{team.score}</div>
                  <div className="tow-team-score-label">points</div>
                  <button
                    className="tow-award-btn"
                    style={{ background: color.accent }}
                    onClick={() => awardPoint(i)}
                    disabled={!selectedQ}
                  >
                    ✅ Award Point
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {history.length > 0 && (
        <div className="tow-history">
          <h3 className="tow-history-title">📝 Score History</h3>
          <div className="tow-history-list">
            {history.slice().reverse().map((h, i) => (
              <div key={i} className="tow-history-item">
                <span className="tow-history-team">{h.team}</span>
                <span className="tow-history-q">answered: {h.q}</span>
                <span className="tow-history-pts">+1</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}