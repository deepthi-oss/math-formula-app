import { useState } from 'react'

const PX_PER_MM = 1.6
const ORIGINAL = { id: 'A', w: 60, h: 40 }

// Easy → complex. 'eye' rounds hide measurements until the reveal; 'measure' rounds show them.
const ROUNDS = [
  {
    title: 'Use your eyes',
    mode: 'eye',
    prompt: 'One of these is the same tiger photo as A, just made bigger. The other one got stretched. Tap the one that looks the SAME as A.',
    options: [{ id: 'P', w: 120, h: 80 }, { id: 'Q', w: 120, h: 40 }],
  },
  {
    title: 'Use your eyes',
    mode: 'eye',
    prompt: 'Some of these were resized properly, some got stretched or squashed. Tap ALL the pictures that look the SAME as A.',
    options: [{ id: 'P', w: 30, h: 20 }, { id: 'Q', w: 80, h: 40 }, { id: 'R', w: 40, h: 50 }],
  },
  {
    title: 'Just like your textbook',
    mode: 'measure',
    prompt: 'These are the images B, C, D and E from your textbook. Tap ALL the ones that look the same as A. The sizes are written under each picture.',
    options: [{ id: 'B', w: 40, h: 20 }, { id: 'C', w: 30, h: 20 }, { id: 'D', w: 90, h: 60 }, { id: 'E', w: 60, h: 60 }],
  },
  {
    title: 'Your eyes can be fooled!',
    mode: 'measure',
    prompt: 'These all look nearly alike. Don\'t trust your eyes. Work it out: new width ÷ 60 and new height ÷ 40. If you get the same number both times, the shape is the same. Tap ALL the correct ones.',
    options: [{ id: 'P', w: 75, h: 50 }, { id: 'Q', w: 75, h: 45 }, { id: 'R', w: 84, h: 56 }, { id: 'S', w: 72, h: 50 }],
  },
  {
    title: 'Harder: smaller copies',
    mode: 'measure',
    prompt: 'Now the numbers are less friendly. In A, the width is 1.5 times the height (60 = 1.5 × 40). Check each picture the same way. Tap ALL the ones that look the same as A.',
    options: [{ id: 'P', w: 48, h: 32 }, { id: 'Q', w: 50, h: 30 }, { id: 'R', w: 36, h: 24 }, { id: 'S', w: 40, h: 28 }, { id: 'T', w: 54, h: 36 }],
  },
]

const MISSING = {
  w: 105,
  choices: [85, 80, 70, 65],
  answer: 70,
}

const isSame = o => Math.abs(o.w / ORIGINAL.w - o.h / ORIGINAL.h) < 0.001
const fmt = n => (Number.isInteger(n) ? String(n) : String(Math.round(n * 1000) / 1000))

function TigerPicture({ w, h }) {
  return (
    <svg
      width={w * PX_PER_MM}
      height={h * PX_PER_MM}
      viewBox="0 0 150 100"
      preserveAspectRatio="none"
      className="tst-pic"
    >
      <rect x="0" y="0" width="150" height="100" fill="#BFE3F5" />
      <rect x="0" y="72" width="150" height="28" fill="#86C26B" />
      <circle cx="128" cy="18" r="9" fill="#FCD34D" />
      {/* ears */}
      <circle cx="50" cy="28" r="11" fill="#F08A24" stroke="#5B2C0A" strokeWidth="1.5" />
      <circle cx="100" cy="28" r="11" fill="#F08A24" stroke="#5B2C0A" strokeWidth="1.5" />
      <circle cx="50" cy="28" r="5" fill="#FDE7C8" />
      <circle cx="100" cy="28" r="5" fill="#FDE7C8" />
      {/* head */}
      <ellipse cx="75" cy="55" rx="34" ry="30" fill="#F08A24" stroke="#5B2C0A" strokeWidth="1.5" />
      {/* forehead + cheek stripes */}
      <path d="M68 27 L71 40 L74 27 Z M76 27 L79 40 L82 27 Z" fill="#2B1A10" />
      <path d="M41 48 L54 51 L41 54 Z M42 60 L54 60 L43 65 Z" fill="#2B1A10" />
      <path d="M109 48 L96 51 L109 54 Z M108 60 L96 60 L107 65 Z" fill="#2B1A10" />
      {/* muzzle */}
      <ellipse cx="65" cy="68" rx="11" ry="9" fill="#FFF6EA" />
      <ellipse cx="85" cy="68" rx="11" ry="9" fill="#FFF6EA" />
      {/* eyes */}
      <ellipse cx="62" cy="48" rx="5" ry="6" fill="#fff" />
      <ellipse cx="88" cy="48" rx="5" ry="6" fill="#fff" />
      <circle cx="62" cy="49" r="3" fill="#14532D" />
      <circle cx="88" cy="49" r="3" fill="#14532D" />
      {/* nose + mouth */}
      <path d="M69 60 L81 60 L75 66 Z" fill="#7F1D1D" />
      <path d="M75 66 L75 70 M75 70 Q70 75 66 72 M75 70 Q80 75 84 72" stroke="#2B1A10" strokeWidth="1.5" fill="none" />
      {/* whiskers */}
      <path d="M58 67 L40 64 M58 70 L40 72 M92 67 L110 64 M92 70 L110 72" stroke="#2B1A10" strokeWidth="1" />
      <rect x="0" y="0" width="150" height="100" fill="none" stroke="#374151" strokeWidth="3" />
    </svg>
  )
}

function WhyLine({ o }) {
  const wf = o.w / ORIGINAL.w, hf = o.h / ORIGINAL.h
  const same = isSame(o)
  return (
    <p className={same ? 'tst-why tst-why-good' : 'tst-why tst-why-bad'}>
      <strong>{o.id}:</strong> width {o.w} ÷ 60 = <strong>{fmt(wf)}</strong>, height {o.h} ÷ 40 = <strong>{fmt(hf)}</strong>
      {same ? ' → same number, so same shape ✓' : ' → different numbers, so it is stretched ✗'}
    </p>
  )
}

function IdentifyRound({ round, onNext }) {
  const [picked, setPicked] = useState([])
  const [checked, setChecked] = useState(false)
  const [tries, setTries] = useState(0)
  const [revealed, setRevealed] = useState(false)

  const correctIds = round.options.filter(isSame).map(o => o.id)
  const allRight =
    picked.length === correctIds.length && correctIds.every(id => picked.includes(id))
  const showSizes = round.mode === 'measure' || revealed

  const toggle = id => {
    if (revealed) return
    setChecked(false)
    setPicked(p => (p.includes(id) ? p.filter(x => x !== id) : [...p, id]))
  }

  const check = () => {
    setChecked(true)
    setTries(t => t + 1)
    if (allRight) setRevealed(true)
  }

  const cardState = o => {
    const chosen = picked.includes(o.id)
    if (revealed) return isSame(o) ? 'tst-card-good' : 'tst-card-bad'
    if (checked && chosen !== isSame(o)) return 'tst-card-wrong'
    return chosen ? 'tst-card-picked' : ''
  }

  return (
    <>
      <p className="tst-instruction">{round.prompt}</p>

      <div className="tst-original">
        <TigerPicture w={ORIGINAL.w} h={ORIGINAL.h} />
        <span className="tst-card-label">Original A</span>
        <span className="tst-size">60 mm × 40 mm</span>
      </div>

      <div className="tst-cards">
        {round.options.map(o => (
          <button key={o.id} className={`tst-card ${cardState(o)}`} onClick={() => toggle(o.id)}>
            <TigerPicture w={o.w} h={o.h} />
            <span className="tst-card-label">{o.id}</span>
            {showSizes && <span className="tst-size">{o.w} mm × {o.h} mm</span>}
          </button>
        ))}
      </div>

      {!revealed && (
        <button className="tst-btn" onClick={check} disabled={picked.length === 0}>Check My Answer</button>
      )}
      {checked && !revealed && (
        <div className="tst-retry">
          <p className="tst-feedback-wrong">
            Not quite. The pictures with a red dashed border are wrong, either picked by mistake or missed. Look again
            {round.mode === 'measure' ? ' and use the sizes.' : '. Look at the tiger\'s face and eyes.'}
          </p>
          {tries >= 2 && (
            <button className="tst-link-btn" onClick={() => setRevealed(true)}>Show me why</button>
          )}
        </div>
      )}

      {revealed && (
        <div className="tst-insight">
          <p className={allRight ? 'tst-feedback-correct' : 'tst-feedback-wrong'}>
            {allRight ? '✓ Well spotted!' : 'Here is the answer:'} The same-shape ones are{' '}
            {correctIds.join(', ')}.
          </p>
          {round.options.map(o => <WhyLine key={o.id} o={o} />)}
          <button className="tst-next-btn" onClick={onNext}>Next →</button>
        </div>
      )}
    </>
  )
}

function MissingRound({ onNext }) {
  const [pick, setPick] = useState(null)
  const [solved, setSolved] = useState(false)

  const choose = h => {
    if (solved) return
    setPick(h)
    if (h === MISSING.answer) setSolved(true)
  }

  const trap = pick === 85
    ? 'You added 45 mm to the height because the width went up by 45 mm (60 → 105). Adding the same amount does NOT keep the shape. Look how stretched out of shape the tiger is!'
    : 'Look at the tiger. Does it look the same as A? Try another height.'

  return (
    <>
      <p className="tst-instruction">
        Picture F must look exactly like A, but its width is <strong>105 mm</strong>. What should its height be?
        Tap a height and see how the tiger turns out.
      </p>

      <div className="tst-cards">
        <div className="tst-original">
          <TigerPicture w={ORIGINAL.w} h={ORIGINAL.h} />
          <span className="tst-card-label">Original A</span>
          <span className="tst-size">60 mm × 40 mm</span>
        </div>
        {pick !== null && (
          <div className={`tst-original ${pick === MISSING.answer ? 'tst-card-good' : 'tst-card-bad'}`}>
            <TigerPicture w={MISSING.w} h={pick} />
            <span className="tst-card-label">F</span>
            <span className="tst-size">105 mm × {pick} mm</span>
          </div>
        )}
      </div>

      <div className="tst-choices">
        {MISSING.choices.map(h => (
          <button
            key={h}
            className={`tst-choice-btn ${pick === h ? (h === MISSING.answer ? 'tst-choice-good' : 'tst-choice-bad') : ''}`}
            onClick={() => choose(h)}
          >
            {h} mm
          </button>
        ))}
      </div>

      {pick !== null && !solved && <p className="tst-feedback-wrong">{trap}</p>}

      {solved && (
        <div className="tst-insight">
          <p className="tst-feedback-correct">✓ Yes, 70 mm!</p>
          <p className="tst-why tst-why-good">
            The width was multiplied by 105 ÷ 60 = <strong>1.75</strong>. So the height must be multiplied by 1.75 too:
            40 × 1.75 = <strong>70 mm</strong>.
          </p>
          <button className="tst-next-btn" onClick={onNext}>See the Rule →</button>
        </div>
      )}
    </>
  )
}

export default function TigerStretchActivity() {
  const [step, setStep] = useState(0)
  const total = ROUNDS.length + 1

  if (step >= total) {
    return (
      <div className="tst-activity">
        <p className="tst-done-banner">
          🎉 A picture keeps its shape only when its width and its height are <strong>multiplied by the same
          number</strong>. Then the new sizes are <strong>proportional</strong> to the old ones. Adding the same amount
          to both sides, or multiplying them by different numbers, makes it look stretched or squashed.
        </p>
        <button className="tst-new-btn" onClick={() => setStep(0)}>🔄 Go Through It Again</button>
      </div>
    )
  }

  const round = ROUNDS[step]
  return (
    <div className="tst-activity">
      <div className="tst-stepper">
        Example {step + 1} of {total}: {round ? round.title : 'Find the missing height'}
      </div>
      {round
        ? <IdentifyRound key={step} round={round} onNext={() => setStep(s => s + 1)} />
        : <MissingRound key={step} onNext={() => setStep(s => s + 1)} />}
    </div>
  )
}
