import { useState, useEffect } from 'react'
import MythMathChallenge from './MythMathChallenge'
import { formulaData, gradeRanges } from './formulaConfig'

const sectors = [
  { name: 'Arithmetic', icon: '🧮', color: '#F59E0B', bg: '#FFFBEB', border: '#FDE68A' },
  { name: 'Algebra', icon: '📊', color: '#6366F1', bg: '#EEF2FF', border: '#C7D2FE' },
  { name: 'Geometry', icon: '📐', color: '#10B981', bg: '#ECFDF5', border: '#A7F3D0' },
  { name: 'Myth Math Challenge', icon: '🏆', color: '#EC4899', bg: '#FDF2F8', border: '#FBCFE8' },
]

function ConceptGroup({ concept, items, icon, bg, color }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="formula-concept-group">
      <div
        className="formula-concept-heading"
        onClick={() => setOpen(o => !o)}
        style={{ cursor: 'pointer', userSelect: 'none' }}
      >
        <span className="formula-concept-icon">{icon}</span>
        <span style={{ flex: 1 }}>{concept}</span>
        <span className="formula-concept-count">{items.length} formulas</span>
        <span className="formula-concept-arrow">{open ? '▼' : '▶'}</span>
      </div>
      {open && (
        <ul className="formula-items" style={{ padding: '16px 20px' }}>
          {items.map((f, j) => (
            <li key={j} className="formula-item">
              <span className="formula-num" style={{ background: bg, color }}>
                {j + 1}
              </span>
              <span className="formula-text">{f}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
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
  const activeSector = sectors.find(s => s.name === sector)

  return (
    <div className="explorer-v2">

      <div className="explorer-hero">
        <div className="explorer-hero-text">
          <h1 className="explorer-heading">📚 Formula Explorer</h1>
          <p className="explorer-subheading">Pick a subject and discover the formulas you need!</p>
        </div>
      </div>

      <div className="sector-cards">
        {sectors.map(s => (
          <button
            key={s.name}
            className={`sector-card ${sector === s.name ? 'sector-card-active' : ''}`}
            style={sector === s.name ? { background: s.bg, borderColor: s.color, color: s.color } : {}}
            onClick={() => setSector(s.name)}
          >
            <span className="sector-card-icon">{s.icon}</span>
            <span className="sector-card-name">{s.name}</span>
          </button>
        ))}
      </div>

      {isMythMath ? (
        <MythMathChallenge />
      ) : (
        <>
          <div className="grade-section">
            <span className="grade-label">Select Grade:</span>
            <div className="grade-pills">
              {gradeRanges[sector].map(g => (
                <button
                  key={g}
                  className={`grade-pill ${grade === g ? 'grade-pill-active' : ''}`}
                  style={grade === g ? { background: activeSector?.color, borderColor: activeSector?.color } : {}}
                  onClick={() => setGrade(g)}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>

          <div className="formula-box" style={{ borderLeftColor: activeSector?.color }}>
            <div className="formula-box-header" style={{ background: activeSector?.bg }}>
              <span className="formula-box-icon">{activeSector?.icon}</span>
              <div>
                <h2 className="formula-box-title" style={{ color: activeSector?.color }}>
                  {sector} Formulas
                </h2>
                <p className="formula-box-sub">{grade}</p>
              </div>
              <span className="formula-count-badge" style={{ background: activeSector?.color }}>
                {list.length} formulas
              </span>
            </div>

            <div className="formula-box-body">
              {list.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">📭</div>
                  <p className="empty-title">No formulas added yet</p>
                  <p className="empty-sub">Formulas for this grade will appear here once added.</p>
                </div>
              ) : (
                <div className="formula-concepts">
  {list.map((item, i) => {
    if (item.concept) {
  return (
    <ConceptGroup
      key={i}
      concept={item.concept}
      items={item.items}
      icon={activeSector?.icon}
      bg={activeSector?.bg}
      color={activeSector?.color}
    />
  )
}
    return (
      <ul key={i} className="formula-items">
        <li className="formula-item">
          <span className="formula-num" style={{ background: activeSector?.bg, color: activeSector?.color }}>
            {i + 1}
          </span>
          <span className="formula-text">
            {typeof item === 'object'
              ? `${item.name} — sides: ${item.sides}, corners: ${item.corners}, angles: ${item.angles} (${item.note})`
              : item}
          </span>
        </li>
      </ul>
    )
  })}
</div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}