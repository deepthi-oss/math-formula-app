import { useState, useEffect } from 'react'
import { generateAP, nthTerm, sumOfN } from './apShared'

const TOTAL_ROUNDS = 5
const ROUND_TIME = 15
const POINTS = 10

function generateQuestion() {
  const ap = generateAP({ aMin: 1, aMax: 9, dMin: 1, dMax: 6, n: Math.floor(Math.random() * 5) + 3 })
  const type = Math.random() < 0.5 ? 'nth' : 'sum'
  const answer = type === 'nth' ? nthTerm(ap.a, ap.d, ap.n) : sumOfN(ap.a, ap.d, ap.n)
  return { ...ap, type, answer }
}

export default function APScoredGameActivity() {
  const [roundNum, setRoundNum] = useState(1)
  const [question, setQuestion] = useState(() => generateQuestion())
  const [timeLeft, setTimeLeft] = useState(ROUND_TIME)
  const [input, setInput] = useState('')
  const [phase, setPhase] = useState('question')
  const [lastCorrect, setLastCorrect] = useState(false)
  const [score, setScore] = useState(0)

  useEffect(() => {
    if (phase !== 'question') return
    if (timeLeft <= 0) {
      setPhase('result')
      setLastCorrect(false)
      return
    }
    const t = setTimeout(() => setTimeLeft(tl => tl - 1), 1000)
    return () => clearTimeout(t)
  }, [phase, timeLeft])

  const checkAnswer = () => {
    if (phase !== 'question') return
    const val = parseFloat(input)
    const correct = !Number.isNaN(val) && val === question.answer
    if (correct) setScore(s => s + POINTS)
    setLastCorrect(correct)
    setPhase('result')
  }

  const nextRound = () => {
    if (roundNum >= TOTAL_ROUNDS) {
      setPhase('gameover')
      return
    }
    setRoundNum(r => r + 1)
    setQuestion(generateQuestion())
    setTimeLeft(ROUND_TIME)
    setInput('')
    setPhase('question')
  }

  const playAgain = () => {
    setRoundNum(1)
    setScore(0)
    setQuestion(generateQuestion())
    setTimeLeft(ROUND_TIME)
    setInput('')
    setPhase('question')
  }

  if (phase === 'gameover') {
    return (
      <div className="game-activity">
        <div className="game-over-card">
          <div className="game-over-icon">🏆</div>
          <h3>Game Over!</h3>
          <p className="game-final-score">Score: {score} / {TOTAL_ROUNDS * POINTS}</p>
          <button className="game-playagain-btn" onClick={playAgain}>🔄 Play Again</button>
        </div>
      </div>
    )
  }

  const questionText = question.type === 'nth'
    ? `What is the ${question.n}th term of this AP?`
    : `What is the sum of the first ${question.n} terms of this AP?`

  return (
    <div className="game-activity">
      <div className="game-topbar">
        <span className="game-round-badge">Round {roundNum}/{TOTAL_ROUNDS}</span>
        <span className="game-score-badge">Score: {score}</span>
        <span className={`game-timer-badge ${timeLeft <= 5 ? 'game-timer-low' : ''}`}>⏱ {timeLeft}s</span>
      </div>

      <div className="game-question-card">
        <p className="game-ap-def">a = {question.a}, d = {question.d}</p>
        <p className="game-question-text">{questionText}</p>

        {phase === 'question' && (
          <div className="game-answer-row">
            <input
              type="number"
              className="game-answer-input"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && checkAnswer()}
              placeholder="Your answer"
              autoFocus
            />
            <button className="game-check-btn" onClick={checkAnswer}>Check</button>
          </div>
        )}

        {phase === 'result' && (
          <div className="game-result">
            <p className={`game-result-banner ${lastCorrect ? 'game-result-correct' : 'game-result-wrong'}`}>
              {lastCorrect ? `✓ Correct! +${POINTS} points` : `✗ Not quite. Correct answer: ${question.answer}`}
            </p>
            <p className="game-formula-recap">
              {question.type === 'nth'
                ? `aₙ = a + (n−1)d = ${question.a} + (${question.n}−1)×${question.d} = ${question.answer}`
                : `Sₙ = n/2 [2a+(n−1)d] = ${question.n}/2 × [${2 * question.a}+(${question.n}-1)×${question.d}] = ${question.answer}`}
            </p>
            <button className="game-next-btn" onClick={nextRound}>
              {roundNum >= TOTAL_ROUNDS ? 'See Final Score →' : 'Next Round →'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
