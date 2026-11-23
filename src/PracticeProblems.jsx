import { useState } from 'react'

const LEVEL_LABEL = { knowledge: 'Knowledge', understanding: 'Understanding', application: 'Application' }
const KIND_LABEL = { quick: '⚡ One-word answer', word: '📖 Word problem' }

// lower-case, no spaces, "2 to 3" → "2:3", no trailing full stop
const normalize = s => s.toLowerCase().replace(/\s+/g, '').replace(/(\d)to(\d)/g, '$1:$2').replace(/\.$/, '')

function Answer({ q }) {
  if (q.type === 'number') return q.unit === '₹' ? `₹${q.answer}` : `${q.answer} ${q.unit || ''}`
  return q.answer
}

// One question at a time, endless. `makeQuestion(n)` returns a fresh question for question number n.
export function PracticeQuiz({ makeQuestion, intro }) {
  const [q, setQ] = useState(() => makeQuestion(1))
  const [count, setCount] = useState(1)
  const [score, setScore] = useState(0)
  const [chosen, setChosen] = useState(null)
  const [typed, setTyped] = useState('')
  const [tries, setTries] = useState(0)
  const [result, setResult] = useState(null) // null | 'right' | 'retry' | 'shown'

  const finished = result === 'right' || result === 'shown'

  const mark = ok => {
    if (ok) {
      setResult('right')
      if (tries === 0) setScore(s => s + 1)
    } else {
      setResult(tries === 0 ? 'retry' : 'shown')
    }
    setTries(t => t + 1)
  }

  const chooseOption = opt => {
    if (finished) return
    setChosen(opt)
    mark(opt === q.answer)
  }

  const checkTyped = () => {
    if (finished || typed.trim() === '') return
    if (q.type === 'word') mark(q.accept.includes(normalize(typed)))
    else mark(Number(typed.replace(/[₹,\s]/g, '')) === q.answer)
  }

  const next = () => {
    setQ(makeQuestion(count + 1))
    setCount(c => c + 1)
    setChosen(null)
    setTyped('')
    setTries(0)
    setResult(null)
  }

  return (
    <div className="pp-activity">
      {intro && <p className="pp-intro">{intro}</p>}
      <div className="pp-topbar">
        <span className="pp-qnum">Question {count}</span>
        <span className="pp-score">⭐ {score} right first time</span>
      </div>
      {q.kind && <span className={`pp-kind pp-kind-${q.kind}`}>{KIND_LABEL[q.kind]}</span>}

      <p className="pp-question">{q.text}</p>

      {q.type === 'mcq' ? (
        <div className="pp-options">
          {q.options.map(opt => {
            let cls = ''
            if (finished && opt === q.answer) cls = 'pp-opt-right'
            else if (opt === chosen && result !== 'right') cls = 'pp-opt-wrong'
            return (
              <button key={opt} className={`pp-opt ${cls}`} onClick={() => chooseOption(opt)} disabled={finished}>
                {opt}
              </button>
            )
          })}
        </div>
      ) : (
        <div className="pp-typed">
          {q.unit === '₹' && <span className="pp-unit">₹</span>}
          <input
            className="pp-input"
            inputMode={q.type === 'word' ? 'text' : 'decimal'}
            value={typed}
            disabled={finished}
            placeholder={q.placeholder || 'Your answer'}
            onChange={e => { setTyped(e.target.value); if (result === 'retry') setResult(null) }}
            onKeyDown={e => e.key === 'Enter' && checkTyped()}
          />
          {q.unit && q.unit !== '₹' && <span className="pp-unit">{q.unit}</span>}
          {!finished && <button className="pp-check-btn" onClick={checkTyped}>Check</button>}
        </div>
      )}

      {result === 'retry' && (
        <p className="pp-feedback-wrong">Not quite. Think again and have one more try!</p>
      )}
      {finished && (
        <div className={`pp-explain ${result === 'right' ? 'pp-explain-right' : 'pp-explain-shown'}`}>
          <p className="pp-explain-head">
            {result === 'right' ? '✓ Correct!' : <>The answer is <strong><Answer q={q} /></strong>.</>}
          </p>
          <p className="pp-working">{q.working}</p>
          <button className="pp-next-btn" onClick={next}>Next Question →</button>
        </div>
      )}
    </div>
  )
}

// A printable sheet of mixed questions with a hidden answer key. `makeSheet()` returns a fresh list.
export function HomeworkSheet({ makeSheet, title }) {
  const [sheet, setSheet] = useState(() => makeSheet())
  const [showKey, setShowKey] = useState(false)

  const fresh = () => { setSheet(makeSheet()); setShowKey(false) }

  return (
    <div className="pp-activity">
      <div className="pp-hw-actions">
        <button className="pp-check-btn" onClick={fresh}>🔄 New Homework Sheet</button>
        <button className="pp-hw-btn" onClick={() => setShowKey(k => !k)}>{showKey ? 'Hide' : 'Show'} Answer Key</button>
        <button className="pp-hw-btn" onClick={() => window.print()}>🖨️ Print</button>
      </div>

      <div className="pp-hw-sheet">
        <h4 className="pp-hw-title">{title}</h4>
        <p className="pp-hw-sub">Name: ____________________ &nbsp;&nbsp; Date: ____________</p>
        {[['quick', 'Section A: One-word answers'], ['word', 'Section B: Word problems']].map(([kind, heading]) => {
          const items = sheet.map((q, i) => ({ q, i })).filter(x => x.q.kind === kind)
          if (items.length === 0) return null
          return (
            <div key={kind}>
              <h5 className="pp-hw-section">{heading}</h5>
              <ol className="pp-hw-list" start={items[0].i + 1}>
                {items.map(({ q, i }) => (
                  <li key={i} className="pp-hw-item">
                    <span className="pp-hw-level">{LEVEL_LABEL[q.level]}</span>
                    <p className="pp-hw-q">{q.text}</p>
                    {q.type === 'mcq' && (
                      <div className="pp-hw-opts">
                        {q.options.map((opt, j) => <span key={j}>({'abcd'[j]}) {opt}</span>)}
                      </div>
                    )}
                    {q.type !== 'mcq' && !showKey && <p className="pp-hw-blank">Answer: ____________</p>}
                    {showKey && (
                      <p className="pp-hw-key">
                        <strong>Answer: <Answer q={q} /></strong> — {q.working}
                      </p>
                    )}
                  </li>
                ))}
              </ol>
            </div>
          )
        })}
      </div>
    </div>
  )
}
