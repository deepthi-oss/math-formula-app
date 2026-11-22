import { useState } from 'react'

const PX_PER_MM = 3
const ANCHOR = { x: 50, y: 40 }
const BASE_W = 60, BASE_H = 40
const BASE_RATIO = BASE_W / BASE_H

const W_MIN = 20, W_MAX = 140
const H_MIN = 15, H_MAX = 95

function TigerBox({ widthMM, heightMM }) {
  const w = widthMM * PX_PER_MM
  const h = heightMM * PX_PER_MM
  const stripeCount = 5
  return (
    <svg viewBox="0 0 400 320" className="tst-svg">
      <rect x={ANCHOR.x} y={ANCHOR.y} width={w} height={h} className="tst-box" />
      {Array.from({ length: stripeCount }).map((_, i) => (
        <rect
          key={i}
          x={ANCHOR.x + (w / (stripeCount + 1)) * (i + 1) - Math.max(2, w * 0.02)}
          y={ANCHOR.y}
          width={Math.max(4, w * 0.045)}
          height={h}
          className="tst-stripe"
        />
      ))}
      <rect x={ANCHOR.x} y={ANCHOR.y} width={w} height={h} className="tst-box-outline" />
    </svg>
  )
}

export default function TigerStretchActivity() {
  const [widthMM, setWidthMM] = useState(BASE_W)
  const [heightMM, setHeightMM] = useState(BASE_H)
  const [phase, setPhase] = useState('grow') // 'grow' | 'grow-done' | 'distort' | 'done'

  const ratio = widthMM / heightMM
  const isProportional = Math.abs(ratio - BASE_RATIO) < 0.08
  const scaleFactor = ((widthMM / BASE_W) + (heightMM / BASE_H)) / 2
  const isBigEnough = widthMM >= 108 && widthMM <= 132 && heightMM >= 72 && heightMM <= 88

  const growSuccess = isProportional && isBigEnough
  const distortSuccess = !isProportional

  const resetSliders = () => {
    setWidthMM(BASE_W)
    setHeightMM(BASE_H)
  }

  const startDistortChallenge = () => {
    resetSliders()
    setPhase('distort')
  }

  const finish = () => setPhase('done')

  if (phase === 'done') {
    return (
      <div className="tst-activity">
        <p className="tst-done-banner">
          🎉 When width and height change by the <strong>same factor</strong>, the picture still looks like the same
          tiger — just bigger or smaller. That's called <strong>proportional</strong>. Change them by
          <strong> different</strong> factors, and it looks stretched or squished instead.
        </p>
        <button className="tst-new-btn" onClick={() => { resetSliders(); setPhase('grow') }}>🔄 Try It Again</button>
      </div>
    )
  }

  return (
    <div className="tst-activity">
      <div className="tst-stepper">{phase === 'grow' ? 'Challenge 1 of 2' : 'Challenge 2 of 2'}</div>
      <p className="tst-instruction">
        {phase === 'grow'
          ? "This photo starts at 60mm × 40mm, just like Image A. Drag the sliders to make it about TWICE as big — but keep it looking like the exact same tiger, not stretched or squished!"
          : 'Now do the opposite on purpose — move the sliders so the tiger looks stretched or squished, any size you like.'}
      </p>

      <TigerBox widthMM={widthMM} heightMM={heightMM} />

      <div className={`tst-status ${isProportional ? 'tst-status-good' : 'tst-status-bad'}`}>
        {isProportional ? '✓ Looks like the same tiger!' : '✗ Looks stretched or squished!'}
      </div>

      <div className="tst-sliders">
        <label className="tst-slider-row">
          <span>Width: {Math.round(widthMM)}mm</span>
          <input
            type="range"
            min={W_MIN}
            max={W_MAX}
            value={widthMM}
            onChange={e => setWidthMM(Number(e.target.value))}
            className="tst-slider"
          />
        </label>
        <label className="tst-slider-row">
          <span>Height: {Math.round(heightMM)}mm</span>
          <input
            type="range"
            min={H_MIN}
            max={H_MAX}
            value={heightMM}
            onChange={e => setHeightMM(Number(e.target.value))}
            className="tst-slider"
          />
        </label>
      </div>

      {phase === 'grow' && (
        <p className="tst-goal-note">
          🎯 Goal: land around 120mm × 80mm (about {scaleFactor.toFixed(1)}× bigger right now) while staying proportional.
        </p>
      )}

      {phase === 'grow' && growSuccess && (
        <div className="tst-insight">
          <p className="tst-feedback-correct">
            ✓ You made it {scaleFactor.toFixed(1)}× bigger and it still looks right — because width and height both
            scaled by the same amount!
          </p>
          <button className="tst-next-btn" onClick={startDistortChallenge}>Challenge 2 →</button>
        </div>
      )}

      {phase === 'distort' && distortSuccess && (
        <div className="tst-insight">
          <p className="tst-feedback-correct">✓ Yep — now the width and height grew by different amounts, and it looks wrong!</p>
          <button className="tst-next-btn" onClick={finish}>See the Rule →</button>
        </div>
      )}
    </div>
  )
}
