import { useState, useRef, useEffect } from 'react'

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

function norm(s) {
  return s.toLowerCase().replace(/\s+/g, '')
    .replace(/[²]/g, '2').replace(/[³]/g, '3')
    .replace(/\^2/g, '2').replace(/\^3/g, '3')
    .replace(/×/g, '*')
}
function checkAnswer(input, ans) {
  return norm(input) === norm(ans)
}

function DrawCanvas({ playerNum, locked, color, penSize }) {
  const canvasRef = useRef(null)
  const ctxRef = useRef(null)
  const drawingRef = useRef(false)

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
      <button className="tool-btn" onClick={clear} disabled={locked}>Clear</button>
    </div>
  )
}

export default function IdentityChallenge() {
  const [round, setRound] = useState(0)
  const [scores, setScores] = useState([0, 0])
  const [phase, setPhase] = useState('write')
  const [timeLeft, setTimeLeft] = useState(WRITE_TIME)
  const [submitted, setSubmitted] = useState([false, false])
  const [results, setResults] = useState([null, null])
  const [type1, setType1] = useState('')
  const [type2, setType2] = useState('')
  const [showAnswer, setShowAnswer] = useState(false)

  const id = identities[round]

  useEffect(() => {
    if (phase === 'done') return
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
  }, [phase, round])

  const forceFinish = () => {
    setSubmitted(s => {
      const next = [...s]
      if (!next[0]) next[0] = true
      if (!next[1]) next[1] = true
      return next
    })
    setResults(r => [r[0] ?? 'wrong', r[1] ?? 'wrong'])
    setShowAnswer(true)
  }

  const submitAnswer = (playerIdx) => {
    if (submitted[playerIdx]) return
    const val = playerIdx === 0 ? type1 : type2
    const isOk = val.trim().length > 0 && checkAnswer(val, id.answer)
    setSubmitted(s => { const n = [...s]; n[playerIdx] = true; return n })
    setResults(r => { const n = [...r]; n[playerIdx] = isOk ? 'correct' : 'wrong'; return n })
    if (isOk) setScores(sc => { const n = [...sc]; n[playerIdx]++; return n })
  }

  useEffect(() => {
    if (submitted[0] && submitted[1]) setShowAnswer(true)
  }, [submitted])

  const nextRound = () => {
    if (round + 1 >= identities.length) {
      setPhase('done')
      return
    }
    setRound(r => r + 1)
    setPhase('write')
    setTimeLeft(WRITE_TIME)
    setSubmitted([false, false])
    setResults([null, null])
    setType1(''); setType2('')
    setShowAnswer(false)
  }

  const restart = () => {
    setRound(0)
    setScores([0, 0])
    setPhase('write')
    setTimeLeft(WRITE_TIME)
    setSubmitted([false, false])
    setResults([null, null])
    setType1(''); setType2('')
    setShowAnswer(false)
  }

  if (phase === 'done') {
    let title = "It's a tie!"
    if (scores[0] > scores[1]) title = 'Player 1 wins!'
    else if (scores[1] > scores[0]) title = 'Player 2 wins!'
    return (
      <div className="winner-screen">
        <h2>{title}</h2>
        <div className="final-scores">
          <div className="fc">Player 1: {scores[0]}</div>
          <div className="fc">Player 2: {scores[1]}</div>
        </div>
        <button className="next-btn" onClick={restart}>Play again</button>
      </div>
    )
  }

  return (
    <div className="arena">
      <div className="scores">
        <div>Player 1: {scores[0]}</div>
        <div>Player 2: {scores[1]}</div>
      </div>
      <div className="round-label">Round {round + 1} of {identities.length} — {phase === 'write' ? 'Writing' : 'Typing'} ({Math.ceil(timeLeft)}s)</div>
      <div className="formula-display">{id.q}</div>
      <div className="hint-badge">{id.hint}</div>

      <div className="players">
        <div className="player-side">
          <h3>Player 1</h3>
          <DrawCanvas playerNum={1} locked={phase !== 'write'} color="#1a1a1a" penSize={2} />
          {phase === 'type' && (
            <div className="phase2-box">
              <input
                className="type-input"
                value={type1}
                onChange={e => setType1(e.target.value)}
                disabled={submitted[0]}
                placeholder="Type your answer..."
              />
              <button className="submit-btn" onClick={() => submitAnswer(0)} disabled={submitted[0]}>Submit</button>
            </div>
          )}
          {results[0] && <div className={`result-banner rb-${results[0]}`}>{results[0] === 'correct' ? 'Correct! +1' : 'Wrong'}</div>}
        </div>

        <div className="player-side">
          <h3>Player 2</h3>
          <DrawCanvas playerNum={2} locked={phase !== 'write'} color="#1a1a1a" penSize={2} />
          {phase === 'type' && (
            <div className="phase2-box">
              <input
                className="type-input"
                value={type2}
                onChange={e => setType2(e.target.value)}
                disabled={submitted[1]}
                placeholder="Type your answer..."
              />
              <button className="submit-btn" onClick={() => submitAnswer(1)} disabled={submitted[1]}>Submit</button>
            </div>
          )}
          {results[1] && <div className={`result-banner rb-${results[1]}`}>{results[1] === 'correct' ? 'Correct! +1' : 'Wrong'}</div>}
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