import { useState } from 'react'
import { generateAP, randInt } from './apShared'

const PALETTE = ['#F59E0B', '#6366F1', '#10B981', '#EC4899', '#8B5CF6', '#F43F5E']

function buildChips(ap) {
  const terms = Array.from({ length: ap.n }, (_, i) => ap.a + i * ap.d)
  const chips = terms.map((value, i) => ({ id: i, value }))
  const middleId = ap.n % 2 === 1 ? Math.floor(ap.n / 2) : null
  return { chips: [...chips].sort(() => Math.random() - 0.5), middleId, terms }
}

export default function APPairingActivity() {
  const [ap, setAp] = useState(() => generateAP({ aMin: 1, aMax: 9, dMin: 1, dMax: 6, n: randInt(4, 7) }))
  const [{ chips, middleId, terms }, setBoard] = useState(() => buildChips(ap))
  const [selected, setSelected] = useState([])
  const [solvedColors, setSolvedColors] = useState({})
  const [wrongFlash, setWrongFlash] = useState([])
  const [pairsFound, setPairsFound] = useState(() => (ap.n % 2 === 1 ? 1 : 0))

  const pairSum = terms[0] + terms[terms.length - 1]
  const totalPairs = Math.floor(ap.n / 2) + (middleId !== null ? 1 : 0)
  const allDone = pairsFound >= totalPairs

  const newChallenge = () => {
    const next = generateAP({ aMin: 1, aMax: 9, dMin: 1, dMax: 6, n: randInt(4, 7) })
    const board = buildChips(next)
    setAp(next)
    setBoard(board)
    setSelected([])
    setSolvedColors(board.middleId !== null ? { [board.middleId]: '#9CA3AF' } : {})
    setWrongFlash([])
    setPairsFound(board.middleId !== null ? 1 : 0)
  }

  const tapChip = chip => {
    if (solvedColors[chip.id] || chip.id === middleId) return
    if (selected.includes(chip.id)) return

    const next = [...selected, chip.id]
    if (next.length < 2) {
      setSelected(next)
      return
    }

    const [id1, id2] = next
    const v1 = chips.find(c => c.id === id1).value
    const v2 = chips.find(c => c.id === id2).value

    if (v1 + v2 === pairSum) {
      const color = PALETTE[pairsFound % PALETTE.length]
      setSolvedColors(sc => ({ ...sc, [id1]: color, [id2]: color }))
      setPairsFound(p => p + 1)
      setSelected([])
    } else {
      setWrongFlash(next)
      setTimeout(() => { setWrongFlash([]); setSelected([]) }, 500)
    }
  }

  return (
    <div className="pair-activity">
      <p className="pair-rule">
        Tap two chips whose values add up to the same total: <strong>first + last = {terms[0]} + {terms[terms.length - 1]} = {pairSum}</strong>
      </p>

      <div className="pair-progress">Pairs found: {pairsFound} / {totalPairs}</div>

      <div className="pair-chips-row">
        {chips.map(chip => {
          const isMiddle = chip.id === middleId
          const solvedColor = solvedColors[chip.id]
          const isSelected = selected.includes(chip.id)
          const isWrong = wrongFlash.includes(chip.id)
          return (
            <button
              key={chip.id}
              className={`pair-chip ${isSelected ? 'pair-chip-selected' : ''} ${isWrong ? 'pair-chip-wrong' : ''} ${isMiddle ? 'pair-chip-middle' : ''}`}
              style={solvedColor ? { borderColor: solvedColor, background: solvedColor + '22', color: solvedColor } : {}}
              onClick={() => tapChip(chip)}
              disabled={!!solvedColor || isMiddle}
            >
              {chip.value}
              {isMiddle && <span className="pair-middle-tag">middle</span>}
            </button>
          )
        })}
      </div>

      {allDone && (
        <div className="pair-done-banner">
          🎉 All pairs matched! {Math.floor(ap.n / 2)} pairs × {pairSum}
          {middleId !== null ? ` + middle term (${terms[Math.floor(ap.n / 2)]})` : ''} = {terms.reduce((s, t) => s + t, 0)}
        </div>
      )}

      <button className="pair-new-btn" onClick={newChallenge}>🔄 New Challenge</button>
    </div>
  )
}
