import { useState, useEffect } from 'react'
import MythMathChallenge from './MythMathChallenge'
import { formulaData, gradeRanges } from './formulaConfig'

const sectors = ['Arithmetic', 'Algebra', 'Geometry', 'Myth Math Challenge']

export default function FormulaExplorer() {
  const [sector, setSector] = useState('Algebra')
  const [grade, setGrade] = useState(gradeRanges['Algebra'][0])

  useEffect(() => {
    if (gradeRanges[sector]) {
      setGrade(gradeRanges[sector][0])
    }
  }, [sector])

  const isMythMath = sector === 'Myth Math Challenge'
  const list = !isMythMath ? (formulaData[sector]?.[grade] || []) : []

  return (
    <div className="explorer-v2">
      <div className="sector-tabs">
        {sectors.map(s => (
          <button
            key={s}
            className={`sector-tab ${sector === s ? 'active' : ''}`}
            onClick={() => setSector(s)}
          >
            {s}
          </button>
        ))}
      </div>

      {isMythMath ? (
        <MythMathChallenge />
      ) : (
        <>
          <div className="grade-tabs">
            {gradeRanges[sector].map(g => (
              <button
                key={g}
                className={`grade-tab ${grade === g ? 'active' : ''}`}
                onClick={() => setGrade(g)}
              >
                {g}
              </button>
            ))}
          </div>

          <div className="formula-list-box">
            <h2>Important formulas in {sector.toLowerCase()} — {grade}</h2>
            {list.length === 0 ? (
              <p className="empty-note">No formulas added yet.</p>
            ) : (
              <ul>
                {list.map((f, i) => (
                  <li key={i}>
                    {typeof f === 'object'
                      ? `${f.name} — sides: ${f.sides}, corners: ${f.corners}, angles: ${f.angles} (${f.note})`
                      : f}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </>
      )}
    </div>
  )
}