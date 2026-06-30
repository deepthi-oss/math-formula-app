import { useState, useEffect } from 'react'
import MythMathChallenge from './MythMathChallenge'

const sectors = ['Arithmetic', 'Algebra', 'Geometry', 'Myth Math Challenge']

const gradeRanges = {
  Arithmetic: ['Class 1','Class 2','Class 3','Class 4','Class 5','Class 6','Class 7','Class 8','Class 9','Class 10','Class 11','Class 12'],
  Algebra: ['Class 6','Class 7','Class 8','Class 9','Class 10','Class 11','Class 12'],
  Geometry: ['Class 3','Class 4','Class 5','Class 6','Class 7','Class 8','Class 9','Class 10','Class 11','Class 12'],
}

const formulaData = {
  Arithmetic: {},
  Algebra: {},
  Geometry: {
    'Class 3': [
      'Circle — 0 sides, 0 corners, 0 angles (no straight edges or vertices)',
      'Oval — 0 sides, 0 corners, 0 angles (like a circle, a closed curve with no straight edges)',
      'Square — 4 sides, 4 corners, 4 angles (each 90°, total 360°)',
      'Rectangle — 4 sides, 4 corners, 4 angles (each 90°, total 360°)',
      'Pentagon — 5 sides, 5 corners, 5 angles (regular pentagon: each 108°, total 540°)',
      'Hexagon — 6 sides, 6 corners, 6 angles (regular hexagon: each 120°, total 720°)',
      'Octagon — 8 sides, 8 corners, 8 angles (regular octagon: each 135°, total 1080°)',
      'Nonagon — 9 sides, 9 corners, 9 angles (regular nonagon: each 140°, total 1260°)',
      'Decagon — 10 sides, 10 corners, 10 angles (regular decagon: each 144°, total 1440°)',
      'Parallelogram — 4 sides, 4 corners, 4 angles (opposite angles equal; adjacent angles sum to 180°)',
      'Rhombus — 4 sides, 4 corners, 4 angles (opposite angles equal; adjacent angles sum to 180°)',
      '3D Shapes — for solids, we describe faces, edges, and vertices instead of sides:',
      'Cone — 2 faces (1 flat circular base + 1 curved surface), 1 edge, 1 vertex (the apex)',
      'Cube — 6 faces, 12 edges, 8 vertices (corners); all face angles are 90°',
      'Cuboid — 6 faces, 12 edges, 8 vertices (corners); all face angles are 90°',
      'Cylinder — 3 faces (2 flat circular ends + 1 curved surface), 2 edges, 0 vertices',
      'Sphere — 1 face (curved surface), 0 edges, 0 vertices',
      'Prism — varies by type (e.g., triangular prism: 5 faces, 9 edges, 6 vertices; pentagonal prism: 7 faces, 15 edges, 10 vertices)',
    ],
  },
}

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
        <MythMathChallenge allFormulas={Object.values(formulaData).flatMap(g => Object.values(g).flat())} />
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
                  <li key={i}>{f}</li>
                ))}
              </ul>
            )}
          </div>
        </>
      )}
    </div>
  )
}