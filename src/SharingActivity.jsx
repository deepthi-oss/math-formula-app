import { useState } from 'react'

// Ganita Prakash Gr 8, 7.5 "Sharing, but Not Equally". Two methods from the textbook, each with a new everyday context:
// 'deal'   — take turns: each round the first person takes m, the second takes n, until the pile is empty
// 'groups' — split the whole into (m + n) equal groups, find the group size, then each share
const ROUNDS = [
  { mode: 'deal', emoji: '🥭', thing: 'mangoes', total: 12, m: 3, n: 1, names: ['Asha', 'Rohan'] },
  { mode: 'deal', emoji: '✏️', thing: 'pencils', total: 20, m: 3, n: 2, names: ['Meera', 'Kabir'] },
  { mode: 'groups', emoji: '🔵', whole: '42 marbles', total: 42, m: 4, n: 3, names: ['Priya', 'Arjun'] },
  { mode: 'groups', whole: '₹600 of pocket money', total: 600, m: 2, n: 3, names: ['Diya', 'Vikram'], pre: '₹' },
  { mode: 'groups', whole: 'a 72 cm ribbon', total: 72, m: 5, n: 3, names: ['Sana', 'Aditya'], suf: ' cm' },
]

const amt = (round, v) => `${round.pre || ''}${v}${round.suf || ''}`
const shareA = rd => (rd.total / (rd.m + rd.n)) * rd.m
const shareB = rd => (rd.total / (rd.m + rd.n)) * rd.n

function DealRound({ round, onNext }) {
  const [guess, setGuess] = useState('')
  const [locked, setLocked] = useState(false)
  const [dealt, setDealt] = useState(0) // rounds dealt so far
  const [A, B] = round.names
  const per = round.m + round.n
  const totalRounds = round.total / per
  const left = round.total - dealt * per
  const done = dealt === totalRounds
  const finalA = round.m * totalRounds

  return (
    <>
      <p className="shr-instruction">
        {A} and {B} share <strong>{round.total} {round.thing}</strong> in the ratio <strong>{round.m} : {round.n}</strong>.
        They take turns: each round {A} takes {round.m} and {B} takes {round.n}.
      </p>

      {!locked ? (
        <div className="shr-predict">
          <label>First, guess: how many {round.thing} will {A} get?</label>
          <div className="shr-row">
            <input className="shr-input" inputMode="numeric" value={guess} onChange={e => setGuess(e.target.value)} placeholder="?" />
            <button className="shr-btn" disabled={guess.trim() === ''} onClick={() => setLocked(true)}>Lock My Guess</button>
          </div>
        </div>
      ) : (
        <p className="shr-guess-note">Your guess: {A} gets <strong>{guess}</strong>.</p>
      )}

      {locked && (
        <>
          <div className="shr-pile">
            <span className="shr-pile-label">Pile: {left} left</span>
            <div className="shr-emojis">{Array.from({ length: left }).map((_, i) => <span key={i}>{round.emoji}</span>)}</div>
          </div>
          <div className="shr-baskets">
            {[[A, round.m * dealt, 'a'], [B, round.n * dealt, 'b']].map(([name, count, side]) => (
              <div key={name} className={`shr-basket shr-basket-${side}`}>
                <span className="shr-basket-name">{name}</span>
                <div className="shr-emojis">{Array.from({ length: count }).map((_, i) => <span key={i}>{round.emoji}</span>)}</div>
                <span className="shr-basket-count">{count}</span>
              </div>
            ))}
          </div>
          {!done && (
            <button className="shr-btn" onClick={() => setDealt(d => d + 1)}>
              Deal Round {dealt + 1}: {A} +{round.m}, {B} +{round.n}
            </button>
          )}
        </>
      )}

      {done && (
        <div className="shr-insight">
          <p className={Number(guess) === finalA ? 'shr-right' : 'shr-wrong-text'}>
            {Number(guess) === finalA ? `✓ Your guess was right: ${A} got ${finalA}!` : `${A} got ${finalA}, not ${guess}.`}
          </p>
          <p>
            It took <strong>{totalRounds} rounds</strong>, because each round uses {round.m} + {round.n} = {per} {round.thing}{' '}
            and {round.total} ÷ {per} = {totalRounds}.
          </p>
          <p>
            {A} : {B} = {finalA} : {round.n * totalRounds} = <strong>{round.m} : {round.n}</strong> ✓ and {finalA} + {round.n * totalRounds} = {round.total} ✓
          </p>
          <button className="shr-next-btn" onClick={onNext}>Next →</button>
        </div>
      )}
    </>
  )
}

function GroupRound({ round, onNext }) {
  const [A, B] = round.names
  const groups = round.m + round.n
  const size = round.total / groups
  const [step, setStep] = useState(1) // 1 = how many groups, 2 = group size, 3 = shares, 4 = done
  const [msg, setMsg] = useState('')
  const [sizeIn, setSizeIn] = useState('')
  const [aIn, setAIn] = useState('')
  const [bIn, setBIn] = useState('')

  const groupChoices = [...new Set([groups, round.m * round.n, round.m, 2])].sort((x, y) => x - y)

  const pickGroups = g => {
    if (g === groups) { setStep(2); setMsg('') }
    else setMsg(`${A} gets ${round.m} groups and ${B} gets ${round.n} groups. How many groups is that altogether?`)
  }
  const checkSize = () => {
    if (Number(sizeIn.replace(/[₹\s]|cm/g, '')) === size) { setStep(3); setMsg('') }
    else setMsg(`Share the whole equally into ${groups} groups: ${amt(round, round.total)} ÷ ${groups} = ?`)
  }
  const checkShares = () => {
    const a = Number(aIn.replace(/[₹\s]|cm/g, '')), b = Number(bIn.replace(/[₹\s]|cm/g, ''))
    if (a === shareA(round) && b === shareB(round)) { setStep(4); setMsg('') }
    else setMsg(`${A} has ${round.m} groups of ${amt(round, size)} and ${B} has ${round.n} groups of ${amt(round, size)}. Multiply!`)
  }

  return (
    <>
      <p className="shr-instruction">
        {A} and {B} share <strong>{round.whole}</strong> in the ratio
        <strong> {round.m} : {round.n}</strong>. Use the groups method.
      </p>

      <div className="shr-whole">The whole: {amt(round, round.total)}</div>
      {step >= 2 && (
        <div className="shr-bar">
          {Array.from({ length: groups }).map((_, i) => (
            <div key={i} className={`shr-block ${i < round.m ? 'shr-block-a' : 'shr-block-b'}`}>
              {step >= 3 ? amt(round, size) : '?'}
              {step >= 3 && round.emoji && size <= 8 && (
                <span className="shr-block-emojis">{round.emoji.repeat(size)}</span>
              )}
            </div>
          ))}
        </div>
      )}
      {step >= 2 && (
        <div className="shr-bar-legend">
          <span className="shr-legend-a">{A}: {round.m} groups</span>
          <span className="shr-legend-b">{B}: {round.n} groups</span>
        </div>
      )}

      {step === 1 && (
        <div className="shr-predict">
          <label>Step 1: Into how many equal groups should we split the whole?</label>
          <div className="shr-row">
            {groupChoices.map(g => <button key={g} className="shr-choice" onClick={() => pickGroups(g)}>{g}</button>)}
          </div>
        </div>
      )}
      {step === 2 && (
        <div className="shr-predict">
          <label>Step 2: How big is each group? ({amt(round, round.total)} ÷ {groups})</label>
          <div className="shr-row">
            <input className="shr-input" inputMode="numeric" value={sizeIn} onChange={e => setSizeIn(e.target.value)} placeholder="?" />
            <button className="shr-btn" onClick={checkSize}>Check</button>
          </div>
        </div>
      )}
      {step === 3 && (
        <div className="shr-predict">
          <label>Step 3: How much does each person get?</label>
          <div className="shr-row">
            <span className="shr-legend-a">{A}</span>
            <input className="shr-input" inputMode="numeric" value={aIn} onChange={e => setAIn(e.target.value)} placeholder="?" />
            <span className="shr-legend-b">{B}</span>
            <input className="shr-input" inputMode="numeric" value={bIn} onChange={e => setBIn(e.target.value)} placeholder="?" />
            <button className="shr-btn" onClick={checkShares}>Check</button>
          </div>
        </div>
      )}
      {msg && <p className="shr-wrong">{msg}</p>}

      {step === 4 && (
        <div className="shr-insight">
          <p className="shr-right">
            ✓ {A} gets {round.m} × {amt(round, size)} = {amt(round, shareA(round))}, {B} gets {round.n} × {amt(round, size)} = {amt(round, shareB(round))}.
          </p>
          <p>Check: {amt(round, shareA(round))} + {amt(round, shareB(round))} = {amt(round, round.total)} ✓</p>
          <button className="shr-next-btn" onClick={onNext}>Next →</button>
        </div>
      )}
    </>
  )
}

export default function SharingActivity() {
  const [idx, setIdx] = useState(0)

  if (idx >= ROUNDS.length) {
    return (
      <div className="shr-activity">
        <div className="shr-done-banner">
          <p>🎉 To share a whole <strong>x</strong> in the ratio <strong>m : n</strong>:</p>
          <ol>
            <li>Split it into <strong>m + n</strong> equal groups.</li>
            <li>Each group is <strong>x ÷ (m + n)</strong>.</li>
            <li>The shares are <strong>m × group</strong> and <strong>n × group</strong>. They always add up to x.</li>
          </ol>
        </div>
        <button className="shr-again-btn" onClick={() => setIdx(0)}>🔄 Do It Again</button>
      </div>
    )
  }

  const round = ROUNDS[idx]
  const Round = round.mode === 'deal' ? DealRound : GroupRound
  return (
    <div className="shr-activity">
      <div className="shr-stepper">
        Round {idx + 1} of {ROUNDS.length}: {round.mode === 'deal' ? 'Take turns' : 'Groups method'} {round.emoji || (round.pre ? '💰' : '🎀')}
      </div>
      <Round key={idx} round={round} onNext={() => setIdx(i => i + 1)} />
    </div>
  )
}
