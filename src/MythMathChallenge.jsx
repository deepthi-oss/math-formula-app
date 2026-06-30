import { useRef, useEffect, useState } from 'react'

function norm(s) {
  return s.toLowerCase().replace(/\s+/g, '')
    .replace(/[²]/g, '2').replace(/[³]/g, '3')
    .replace(/\^2/g, '2').replace(/\^3/g, '3')
    .replace(/×/g, '*')
}

function Whiteboard({ label, correctAnswer }) {
  const canvasRef = useRef(null)
  const ctxRef = useRef(null)
  const drawingRef = useRef(false)
  const [color, setColor] = useState('#1a1a1a')
  const [penSize, setPenSize] = useState(3)
  const [typedAnswer, setTypedAnswer] = useState('')
  const [result, setResult] = useState(null)

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

  const end = () => {
    drawingRef.current = false
  }

  const clear = () => {
    const canvas = canvasRef.current
    ctxRef.current.fillStyle = '#ffffff'
    ctxRef.current.fillRect(0, 0, canvas.width, canvas.height)
    setTypedAnswer('')
    setResult(null)
  }

  const checkAnswer = () => {
    if (!correctAnswer || typedAnswer.trim() === '') return
    const isCorrect = norm(typedAnswer) === norm(correctAnswer)
    setResult(isCorrect ? 'correct' : 'wrong')
  }

  return (
    <div className="whiteboard-panel">
      <h3>{label}</h3>
      <div className="canvas-wrap">
        <canvas
          ref={canvasRef}
          width={420}
          height={280}
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

      <div className="answer-row">
        <input
          type="text"
          className="answer-box"
          placeholder="Type final answer..."
          value={typedAnswer}
          onChange={(e) => setTypedAnswer(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') checkAnswer() }}
        />
        <button className="check-btn" onClick={checkAnswer}>Check</button>
      </div>

      <div className="thumbs-row">
        <div className={`thumb thumb-up ${result === 'correct' ? 'active' : ''}`}>👍</div>
        <div className={`thumb thumb-down ${result === 'wrong' ? 'active' : ''}`}>👎</div>
      </div>
    </div>
  )
}

export default function MythMathChallenge({ allFormulas }) {
  const [selectedFormula, setSelectedFormula] = useState('')

  return (
    <div className="myth-math-page">
      <div className="question-picker">
        <label>Pick the active question: </label>
        <select value={selectedFormula} onChange={(e) => setSelectedFormula(e.target.value)}>
          <option value="">-- Select a formula --</option>
          {allFormulas.map((f, i) => (
            <option key={i} value={f}>{f}</option>
          ))}
        </select>
      </div>

      {selectedFormula && (
        <div className="active-question">
          Current question: <strong>{selectedFormula}</strong>
        </div>
      )}

      <div className="whiteboards-row">
        <Whiteboard label="TEAM 1" correctAnswer={selectedFormula} />
        <Whiteboard label="TEAM 2" correctAnswer={selectedFormula} />
      </div>
    </div>
  )
}