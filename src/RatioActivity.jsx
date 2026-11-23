import { useState } from 'react'
import { TigerPicture } from './TigerStretchActivity'

const IMAGES = [
  { id: 'A', w: 60, h: 40 },
  { id: 'C', w: 30, h: 20 },
  { id: 'D', w: 90, h: 60 },
  { id: 'B', w: 40, h: 20 },
  { id: 'E', w: 60, h: 60 },
]
const DIVISORS = [2, 3, 5, 10]
const TILES = [40, 100, 60, 20]
const gcd = (a, b) => (b === 0 ? a : gcd(b, a % b))

function BuildStep({ onDone }) {
  const [slots, setSlots] = useState([])
  const [msg, setMsg] = useState('')
  const target = [60, 40]
  const done = slots.length === 2

  const tap = n => {
    if (done) return
    const want = target[slots.length]
    if (n === want) {
      setSlots(s => [...s, n])
      setMsg('')
    } else {
      setMsg(slots.length === 0
        ? `Width comes first. Look at the picture: how wide is A?`
        : `Now the height. How tall is A?`)
    }
  }

  return (
    <>
      <p className="rto-instruction">
        A <strong>ratio</strong> compares two amounts <strong>in order</strong>. Make the ratio of
        <strong> width to height</strong> for image A by tapping the numbers in the right order.
      </p>
      <div className="rto-pic-wrap">
        <TigerPicture w={60} h={40} />
        <span className="rto-size">width 60 mm, height 40 mm</span>
      </div>
      <div className="rto-ratio-big">
        <span className={`rto-slot ${slots[0] ? 'rto-slot-filled' : ''}`}>{slots[0] ?? '?'}</span>
        <span className="rto-colon">:</span>
        <span className={`rto-slot ${slots[1] ? 'rto-slot-filled' : ''}`}>{slots[1] ?? '?'}</span>
      </div>
      {!done && (
        <div className="rto-tiles">
          {TILES.map(n => (
            <button key={n} className="rto-tile" onClick={() => tap(n)}>{n}</button>
          ))}
        </div>
      )}
      {msg && <p className="rto-wrong">{msg}</p>}
      {done && (
        <div className="rto-insight">
          <p className="rto-right">✓ 60 : 40, read as "60 to 40".</p>
          <p>The two numbers are called the <strong>terms</strong> of the ratio. It means: for every 60 mm of width,
            there are 40 mm of height.</p>
          <button className="rto-next-btn" onClick={onDone}>Next: Make It Simpler →</button>
        </div>
      )}
    </>
  )
}

function ShrinkStep({ onDone }) {
  const [idx, setIdx] = useState(0)
  const [cur, setCur] = useState([IMAGES[0].w, IMAGES[0].h])
  const [history, setHistory] = useState([])
  const [msg, setMsg] = useState('')
  const [finished, setFinished] = useState(false)
  const [results, setResults] = useState([])

  const img = IMAGES[idx]
  const [a, b] = cur

  const divide = d => {
    if (finished) return
    if (a % d !== 0 || b % d !== 0) {
      const bad = a % d !== 0 ? a : b
      setMsg(`${bad} can't be divided by ${d} exactly. Both terms must be divided by the same number.`)
      return
    }
    setHistory(h => [...h, `÷ ${d}`])
    setCur([a / d, b / d])
    setMsg('')
  }

  const claimSimplest = () => {
    const g = gcd(a, b)
    if (g > 1) {
      setMsg(`Not yet! ${a} and ${b} can both still be divided by ${DIVISORS.find(d => a % d === 0 && b % d === 0) ?? g}.`)
      return
    }
    setFinished(true)
    setMsg('')
  }

  const nextImage = () => {
    const newResults = [...results, { ...img, s: [a, b] }]
    setResults(newResults)
    if (idx + 1 >= IMAGES.length) { onDone(newResults); return }
    const n = IMAGES[idx + 1]
    setIdx(idx + 1)
    setCur([n.w, n.h])
    setHistory([])
    setFinished(false)
  }

  return (
    <>
      <div className="rto-stepper">Image {img.id}: {idx + 1} of {IMAGES.length}</div>
      <p className="rto-instruction">
        Make the ratio as simple as possible. Divide <strong>both terms</strong> by the same number. When no number
        divides both any more, press <strong>"It's in simplest form!"</strong>
      </p>
      <div className="rto-pic-wrap">
        <TigerPicture w={img.w} h={img.h} />
        <span className="rto-size">Image {img.id}: {img.w} mm × {img.h} mm</span>
      </div>
      <div className="rto-ratio-big">
        <span className="rto-slot rto-slot-filled">{a}</span>
        <span className="rto-colon">:</span>
        <span className="rto-slot rto-slot-filled">{b}</span>
      </div>
      {history.length > 0 && (
        <p className="rto-trail">{img.w} : {img.h} {history.map((h, i) => <span key={i}> → {h}</span>)}</p>
      )}
      {!finished && (
        <>
          <div className="rto-tiles">
            {DIVISORS.map(d => (
              <button key={d} className="rto-tile" onClick={() => divide(d)}>÷ {d}</button>
            ))}
          </div>
          <button className="rto-claim-btn" onClick={claimSimplest}>It's in simplest form!</button>
        </>
      )}
      {msg && <p className="rto-wrong">{msg}</p>}
      {finished && (
        <div className="rto-insight">
          <p className="rto-right">✓ {img.w} : {img.h} in simplest form is {a} : {b}.</p>
          <button className="rto-next-btn" onClick={nextImage}>
            {idx + 1 >= IMAGES.length ? 'Compare Them All →' : 'Next Image →'}
          </button>
        </div>
      )}
    </>
  )
}

function CompareStep({ results, onDone }) {
  const [picked, setPicked] = useState([])
  const [checked, setChecked] = useState(false)
  const others = results.filter(x => x.id !== 'A')
  const same = x => x.s[0] === 3 && x.s[1] === 2
  const correct = others.filter(same).map(x => x.id)
  const allRight = picked.length === correct.length && correct.every(id => picked.includes(id))

  const toggle = id => {
    if (checked && allRight) return
    setChecked(false)
    setPicked(p => (p.includes(id) ? p.filter(x => x !== id) : [...p, id]))
  }

  return (
    <>
      <p className="rto-instruction">
        Here are your simplest forms. Image A is <strong>3 : 2</strong>. Tap ALL the images that are
        <strong> proportional</strong> to A (the same shape).
      </p>
      <div className="rto-compare">
        {others.map(x => {
          let cls = picked.includes(x.id) ? 'rto-card-picked' : ''
          if (checked && allRight) cls = same(x) ? 'rto-card-good' : 'rto-card-bad'
          else if (checked && picked.includes(x.id) !== same(x)) cls = 'rto-card-wrong'
          return (
            <button key={x.id} className={`rto-card ${cls}`} onClick={() => toggle(x.id)}>
              <TigerPicture w={x.w} h={x.h} />
              <span className="rto-card-id">{x.id}</span>
              <span className="rto-size">{x.w} : {x.h} = <strong>{x.s[0]} : {x.s[1]}</strong></span>
            </button>
          )
        })}
      </div>
      {!(checked && allRight) && (
        <button className="rto-claim-btn" onClick={() => setChecked(true)} disabled={picked.length === 0}>Check</button>
      )}
      {checked && !allRight && (
        <p className="rto-wrong">Not quite. Compare each simplest form with 3 : 2. The red dashed ones need fixing.</p>
      )}
      {checked && allRight && (
        <div className="rto-insight">
          <p className="rto-right">✓ C and D both simplify to 3 : 2, just like A, so they look the same as A.</p>
          <p>B is 2 : 1 and E is 1 : 1. Those are different, so B and E look stretched.</p>
          <button className="rto-next-btn" onClick={onDone}>See the Rule →</button>
        </div>
      )}
    </>
  )
}

export default function RatioActivity() {
  const [stage, setStage] = useState('build')
  const [results, setResults] = useState([])

  return (
    <div className="rto-activity">
      {stage === 'build' && <BuildStep onDone={() => setStage('shrink')} />}
      {stage === 'shrink' && <ShrinkStep onDone={r => { setResults(r); setStage('compare') }} />}
      {stage === 'compare' && <CompareStep results={results} onDone={() => setStage('done')} />}
      {stage === 'done' && (
        <>
          <p className="rto-done-banner">
            🎉 To check if two ratios are <strong>proportional</strong>, write both in their <strong>simplest
            form</strong> (divide both terms by the same number until you can't any more). Same simplest form means
            proportional, so the pictures have the same shape.
          </p>
          <button className="rto-again-btn" onClick={() => setStage('build')}>🔄 Do It Again</button>
        </>
      )}
    </div>
  )
}
