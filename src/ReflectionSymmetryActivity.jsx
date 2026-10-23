import { useState } from 'react'

const SHAPES = [
  {
    id: 'square',
    name: 'Square',
    points: '90,90 230,90 230,230 90,230',
    lines: [
      { id: 'v', correct: true, x1: 160, y1: 70, x2: 160, y2: 250 },
      { id: 'h', correct: true, x1: 70, y1: 160, x2: 250, y2: 160 },
      { id: 'd1', correct: true, x1: 90, y1: 90, x2: 230, y2: 230 },
      { id: 'd2', correct: true, x1: 230, y1: 90, x2: 90, y2: 230 },
    ],
    insight: 'A square has 4 lines of symmetry — vertical, horizontal, and both diagonals.',
  },
  {
    id: 'rectangle',
    name: 'Rectangle',
    points: '60,100 260,100 260,220 60,220',
    lines: [
      { id: 'v', correct: true, x1: 160, y1: 80, x2: 160, y2: 240 },
      { id: 'h', correct: true, x1: 40, y1: 160, x2: 280, y2: 160 },
      { id: 'd1', correct: false, x1: 60, y1: 100, x2: 260, y2: 220 },
      { id: 'd2', correct: false, x1: 260, y1: 100, x2: 60, y2: 220 },
    ],
    insight: "A rectangle has only 2 lines of symmetry — the diagonals don't work unless it's a square!",
  },
  {
    id: 'isosceles',
    name: 'Isosceles Triangle',
    points: '160,70 80,250 240,250',
    lines: [
      { id: 'v', correct: true, x1: 160, y1: 70, x2: 160, y2: 250 },
      { id: 'h', correct: false, x1: 80, y1: 160, x2: 240, y2: 160 },
      { id: 'skew', correct: false, x1: 80, y1: 250, x2: 220, y2: 80 },
    ],
    insight: 'An isosceles triangle has exactly 1 line of symmetry — straight down the middle from its apex.',
  },
  {
    id: 'equilateral',
    name: 'Equilateral Triangle',
    points: '160,65 242,205 78,205',
    lines: [
      { id: 'a', correct: true, x1: 160, y1: 65, x2: 160, y2: 205 },
      { id: 'b', correct: true, x1: 242, y1: 205, x2: 119, y2: 135 },
      { id: 'c', correct: true, x1: 78, y1: 205, x2: 201, y2: 135 },
      { id: 'h', correct: false, x1: 70, y1: 160, x2: 250, y2: 160 },
    ],
    insight: 'An equilateral triangle has 3 lines of symmetry — one through each vertex and the midpoint opposite it.',
  },
  {
    id: 'irregular',
    name: 'Irregular Shape',
    points: '100,90 240,110 220,240 90,200',
    lines: [
      { id: 'v', correct: false, x1: 160, y1: 70, x2: 160, y2: 260 },
      { id: 'h', correct: false, x1: 70, y1: 150, x2: 260, y2: 150 },
      { id: 'd', correct: false, x1: 100, y1: 90, x2: 220, y2: 240 },
    ],
    insight: "This shape has no lines of symmetry at all — no fold makes the two halves match.",
  },
]

export default function ReflectionSymmetryActivity() {
  const [shapeIndex, setShapeIndex] = useState(0)
  const [found, setFound] = useState(() => new Set())
  const [wrongId, setWrongId] = useState(null)
  const [noSymConfirmed, setNoSymConfirmed] = useState(false)

  const done = shapeIndex >= SHAPES.length
  const shape = SHAPES[shapeIndex] || SHAPES[0]
  const correctIds = shape.lines.filter(l => l.correct).map(l => l.id)
  const isZero = correctIds.length === 0
  const solved = isZero ? noSymConfirmed : found.size === correctIds.length

  const restart = () => {
    setShapeIndex(0)
    setFound(new Set())
    setWrongId(null)
    setNoSymConfirmed(false)
  }

  const nextShape = () => {
    setShapeIndex(i => i + 1)
    setFound(new Set())
    setWrongId(null)
    setNoSymConfirmed(false)
  }

  const flashWrong = id => {
    setWrongId(id)
    setTimeout(() => setWrongId(null), 450)
  }

  const clickLine = line => {
    if (solved || found.has(line.id)) return
    if (line.correct) {
      const next = new Set(found)
      next.add(line.id)
      setFound(next)
      setWrongId(null)
    } else {
      flashWrong(line.id)
    }
  }

  const clickNoSymmetry = () => {
    if (solved) return
    if (isZero) {
      setNoSymConfirmed(true)
    } else {
      flashWrong('no-symmetry')
    }
  }

  if (done) {
    return (
      <div className="rs-activity">
        <p className="rs-done-banner">🎉 You found every line of symmetry in all {SHAPES.length} shapes!</p>
        <button className="rs-new-btn" onClick={restart}>🔄 New Round</button>
      </div>
    )
  }

  return (
    <div className="rs-activity">
      <div className="rs-stepper">Shape {shapeIndex + 1} / {SHAPES.length}: <strong>{shape.name}</strong></div>
      <p className="rs-instruction">
        Click every line that is a true line of symmetry (folding the shape along it makes the two
        halves match exactly) — or tap "No lines of symmetry" if there are none.
      </p>
      {!isZero && <div className="rs-progress">Found: {found.size} / {correctIds.length}</div>}

      <svg viewBox="0 0 320 320" className="rs-svg">
        <polygon points={shape.points} className="rs-shape" />
        {shape.lines.map(line => {
          const cls = `rs-hit ${found.has(line.id) ? 'rs-found' : ''} ${wrongId === line.id ? 'rs-wrong' : ''}`
          return (
            <g key={line.id} className={cls} onClick={() => clickLine(line)}>
              <line x1={line.x1} y1={line.y1} x2={line.x2} y2={line.y2} stroke="transparent" strokeWidth="16" />
              <line x1={line.x1} y1={line.y1} x2={line.x2} y2={line.y2} className="rs-line" strokeDasharray="6 5" />
            </g>
          )
        })}
      </svg>

      <button
        className={`rs-no-sym-btn ${noSymConfirmed ? 'rs-no-sym-confirmed' : ''} ${wrongId === 'no-symmetry' ? 'rs-no-sym-wrong' : ''}`}
        onClick={clickNoSymmetry}
        disabled={solved && !isZero}
      >
        ⊘ This shape has no lines of symmetry
      </button>

      {solved && (
        <div className="rs-insight">
          <p>{shape.insight}</p>
          <button className="rs-next-btn" onClick={nextShape}>
            {shapeIndex + 1 >= SHAPES.length ? 'Finish →' : 'Next Shape →'}
          </button>
        </div>
      )}
    </div>
  )
}
