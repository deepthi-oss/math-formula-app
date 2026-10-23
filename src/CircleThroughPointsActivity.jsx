import { useState } from 'react'

const A1 = { x: 110, y: 160 }
const B1 = { x: 210, y: 160 }
const STEP1_VALID = [
  { id: 'v1', x: 160, y: 80 },
  { id: 'v2', x: 160, y: 160 },
  { id: 'v3', x: 160, y: 240 },
]
const STEP1_INVALID = [
  { id: 'i1', x: 130, y: 90 },
  { id: 'i2', x: 200, y: 230 },
]

const A2 = { x: 90, y: 220 }
const B2 = { x: 230, y: 220 }
const C2 = { x: 160, y: 90 }
const STEP2_CORRECT = { id: 'c', x: 160, y: 174 }
const STEP2_WRONG = [
  { id: 'w1', x: 160, y: 130 },
  { id: 'w2', x: 130, y: 195 },
  { id: 'w3', x: 195, y: 174 },
]

const A3 = { x: 70, y: 160 }
const B3 = { x: 160, y: 160 }
const C3 = { x: 250, y: 160 }
const STEP3_WRONG = [
  { id: 'w1', x: 115, y: 100 },
  { id: 'w2', x: 205, y: 220 },
  { id: 'w3', x: 160, y: 80 },
]

const dist = (p, q) => Math.hypot(p.x - q.x, p.y - q.y)

export default function CircleThroughPointsActivity() {
  const [phase, setPhase] = useState('step1') // step1 | step1-reveal | step2 | step2-reveal | step3 | step3-reveal | done

  // step 1
  const [found1, setFound1] = useState(() => new Set())
  const [wrong1, setWrong1] = useState(null)

  // step 2
  const [found2, setFound2] = useState(false)
  const [wrong2, setWrong2] = useState(null)

  // step 3
  const [triedWrong3, setTriedWrong3] = useState(() => new Set())
  const [wrong3, setWrong3] = useState(null)
  const [confirmed3, setConfirmed3] = useState(false)

  const flash = (setter, id) => {
    setter(id)
    setTimeout(() => setter(null), 450)
  }

  const clickStep1 = pt => {
    if (found1.has(pt.id)) return
    if (STEP1_VALID.some(v => v.id === pt.id)) {
      const next = new Set(found1)
      next.add(pt.id)
      setFound1(next)
      if (next.size === STEP1_VALID.length) setTimeout(() => setPhase('step1-reveal'), 300)
    } else {
      flash(setWrong1, pt.id)
    }
  }

  const clickStep2 = pt => {
    if (found2) return
    if (pt.id === STEP2_CORRECT.id) {
      setFound2(true)
      setTimeout(() => setPhase('step2-reveal'), 300)
    } else {
      flash(setWrong2, pt.id)
    }
  }

  const clickStep3Wrong = pt => {
    if (confirmed3) return
    const next = new Set(triedWrong3)
    next.add(pt.id)
    setTriedWrong3(next)
    flash(setWrong3, pt.id)
  }

  const confirmNoCircle = () => {
    if (confirmed3) return
    setConfirmed3(true)
    setTimeout(() => setPhase('step3-reveal'), 300)
  }

  const restart = () => {
    setPhase('step1')
    setFound1(new Set())
    setWrong1(null)
    setFound2(false)
    setWrong2(null)
    setTriedWrong3(new Set())
    setWrong3(null)
    setConfirmed3(false)
  }

  if (phase === 'done') {
    return (
      <div className="ctp-activity">
        <p className="ctp-done-banner">
          🎉 You've worked out all three cases: endless circles through 2 points, exactly 1 circle through 3 points
          in a triangle, and 0 circles through 3 points in a straight line!
        </p>
        <button className="ctp-new-btn" onClick={restart}>🔄 Go Through It Again</button>
      </div>
    )
  }

  return (
    <div className="ctp-activity">
      {(phase === 'step1' || phase === 'step1-reveal') && (
        <>
          <div className="ctp-stepper">Part 1 of 3: Two Points</div>
          <p className="ctp-instruction">
            A and B are two fixed points. A circle's center has to be the <strong>same distance</strong> from A as
            it is from B. Click every spot below where a circle's center could go.
          </p>
          <div className="ctp-progress">Found: {found1.size} / {STEP1_VALID.length}</div>
          <svg viewBox="0 0 320 320" className="ctp-svg">
            {phase === 'step1-reveal' && <line x1={160} y1={30} x2={160} y2={290} className="ctp-bisector" />}
            {phase === 'step1-reveal' && STEP1_VALID.map(v => (
              <circle key={v.id} cx={v.x} cy={v.y} r={dist(v, A1)} className="ctp-example-circle" />
            ))}
            <circle cx={A1.x} cy={A1.y} r="5" className="ctp-point" />
            <text x={A1.x - 16} y={A1.y + 5} className="ctp-label">A</text>
            <circle cx={B1.x} cy={B1.y} r="5" className="ctp-point" />
            <text x={B1.x + 10} y={B1.y + 5} className="ctp-label">B</text>
            {[...STEP1_VALID, ...STEP1_INVALID].map(pt => (
              <g
                key={pt.id}
                className={`ctp-hit ${found1.has(pt.id) ? 'ctp-found' : ''} ${wrong1 === pt.id ? 'ctp-wrong' : ''}`}
                onClick={() => clickStep1(pt)}
              >
                <circle cx={pt.x} cy={pt.y} r="16" fill="transparent" />
                <circle cx={pt.x} cy={pt.y} r="7" className="ctp-candidate" />
              </g>
            ))}
          </svg>
          {phase === 'step1-reveal' && (
            <div className="ctp-insight">
              <p>
                ✓ Every point you found is the same distance from A and from B — and so are endless other points
                along that same dashed line. That means <strong>endless different circles</strong> can pass through
                any two points.
              </p>
              <button className="ctp-next-btn" onClick={() => setPhase('step2')}>Next: Three Points →</button>
            </div>
          )}
        </>
      )}

      {(phase === 'step2' || phase === 'step2-reveal') && (
        <>
          <div className="ctp-stepper">Part 2 of 3: Three Points (Not in a Line)</div>
          <p className="ctp-instruction">
            Here are three points, A, B and C — they do <strong>not</strong> sit in a straight line. Only one spot
            is the same distance from all three. Click it to find the center of the one circle that passes through
            all three points.
          </p>
          <svg viewBox="0 0 320 320" className="ctp-svg">
            {phase === 'step2-reveal' && (
              <>
                <line x1={160} y1={30} x2={160} y2={290} className="ctp-bisector" />
                <line x1={78} y1={218} x2={312} y2={92} className="ctp-bisector" />
                <circle cx={STEP2_CORRECT.x} cy={STEP2_CORRECT.y} r={dist(STEP2_CORRECT, A2)} className="ctp-example-circle" />
              </>
            )}
            <circle cx={A2.x} cy={A2.y} r="5" className="ctp-point" />
            <text x={A2.x - 16} y={A2.y + 5} className="ctp-label">A</text>
            <circle cx={B2.x} cy={B2.y} r="5" className="ctp-point" />
            <text x={B2.x + 10} y={B2.y + 5} className="ctp-label">B</text>
            <circle cx={C2.x} cy={C2.y} r="5" className="ctp-point" />
            <text x={C2.x - 4} y={C2.y - 12} className="ctp-label">C</text>
            {[STEP2_CORRECT, ...STEP2_WRONG].map(pt => (
              <g
                key={pt.id}
                className={`ctp-hit ${found2 && pt.id === STEP2_CORRECT.id ? 'ctp-found' : ''} ${wrong2 === pt.id ? 'ctp-wrong' : ''}`}
                onClick={() => clickStep2(pt)}
              >
                <circle cx={pt.x} cy={pt.y} r="16" fill="transparent" />
                <circle cx={pt.x} cy={pt.y} r="7" className="ctp-candidate" />
              </g>
            ))}
          </svg>
          {phase === 'step2-reveal' && (
            <div className="ctp-insight">
              <p>
                ✓ That's the only spot the same distance from A, B and C. So there's exactly{' '}
                <strong>one circle</strong> through any three points that aren't in a straight line.
              </p>
              <button className="ctp-next-btn" onClick={() => setPhase('step3')}>Next: Three Points in a Line →</button>
            </div>
          )}
        </>
      )}

      {(phase === 'step3' || phase === 'step3-reveal') && (
        <>
          <div className="ctp-stepper">Part 3 of 3: Three Points in a Straight Line</div>
          <p className="ctp-instruction">
            This time A, B and C all sit in a straight line. Try tapping a few spots — can you find one that's the
            same distance from all three? If you don't think it's possible, tap the button below.
          </p>
          <svg viewBox="0 0 320 320" className="ctp-svg">
            {phase === 'step3-reveal' && (
              <>
                <line x1={115} y1={30} x2={115} y2={290} className="ctp-bisector" />
                <line x1={205} y1={30} x2={205} y2={290} className="ctp-bisector" />
              </>
            )}
            <circle cx={A3.x} cy={A3.y} r="5" className="ctp-point" />
            <text x={A3.x - 16} y={A3.y + 5} className="ctp-label">A</text>
            <circle cx={B3.x} cy={B3.y} r="5" className="ctp-point" />
            <text x={B3.x - 5} y={B3.y - 12} className="ctp-label">B</text>
            <circle cx={C3.x} cy={C3.y} r="5" className="ctp-point" />
            <text x={C3.x + 10} y={C3.y + 5} className="ctp-label">C</text>
            {STEP3_WRONG.map(pt => (
              <g
                key={pt.id}
                className={`ctp-hit ${triedWrong3.has(pt.id) ? 'ctp-tried' : ''} ${wrong3 === pt.id ? 'ctp-wrong' : ''}`}
                onClick={() => clickStep3Wrong(pt)}
              >
                <circle cx={pt.x} cy={pt.y} r="16" fill="transparent" />
                <circle cx={pt.x} cy={pt.y} r="7" className="ctp-candidate" />
              </g>
            ))}
          </svg>
          <button className="ctp-no-circle-btn" onClick={confirmNoCircle} disabled={confirmed3}>
            ⊘ No circle is possible through A, B and C
          </button>
          {phase === 'step3-reveal' && (
            <div className="ctp-insight">
              <p>
                ✓ Right! When three points sit in a straight line, their two "equal-distance" lines never meet —
                they stay side by side forever. With no single center, <strong>no circle</strong> can pass through
                all three.
              </p>
              <button className="ctp-next-btn" onClick={() => setPhase('done')}>Finish →</button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
