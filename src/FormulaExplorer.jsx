import { useState } from 'react'

const formulas = {
  algebra: [
    { id: 'quad', label: 'Quadratic Formula', grade: '9-10', f: 'x = (−b ± √(b²−4ac)) / 2a', desc: 'Find roots of ax²+bx+c=0' },
    { id: 'slope', label: 'Slope of a Line', grade: '6-8', f: 'm = (y₂ − y₁) / (x₂ − x₁)', desc: 'Rise over run between two points' },
    { id: 'id1', label: 'Identity 1', grade: 'all', f: '(a + b)² = a² + 2ab + b²', desc: 'Square of sum' },
    { id: 'id2', label: 'Identity 2', grade: 'all', f: '(a − b)² = a² − 2ab + b²', desc: 'Square of difference' },
    { id: 'id3', label: 'Identity 3', grade: 'all', f: '(a + b)(a − b) = a² − b²', desc: 'Difference of squares' },
  ],
  geometry: [
    { id: 'pyth', label: 'Pythagorean Theorem', grade: '6-8', f: 'a² + b² = c²', desc: 'Right triangle sides' },
    { id: 'circle', label: 'Circle Area', grade: '6-8', f: 'A = π r²', desc: 'Area enclosed by a circle' },
  ],
  trigonometry: [
    { id: 'sohcahtoa', label: 'SOH CAH TOA', grade: '9-10', f: 'sin=O/H  cos=A/H  tan=O/A', desc: 'Basic trig ratios' },
  ],
}

export default function FormulaExplorer() {
  const [topic, setTopic] = useState('algebra')
  const [selected, setSelected] = useState(null)

  const topics = Object.keys(formulas)

  return (
    <div className="explorer">
      <div className="sidebar">
        <h3>Topics</h3>
        {topics.map(t => (
          <button
            key={t}
            className={`topic-btn ${topic === t ? 'active' : ''}`}
            onClick={() => { setTopic(t); setSelected(null) }}
          >
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      <div className="content">
        <div className="formula-grid">
          {formulas[topic].map(f => (
            <div
              key={f.id}
              className={`formula-card ${selected?.id === f.id ? 'selected' : ''}`}
              onClick={() => setSelected(f)}
            >
              <div className="label">{f.grade} • {topic}</div>
              <div className="formula">{f.f}</div>
              <div className="desc">{f.desc}</div>
            </div>
          ))}
        </div>

        {selected && (
          <div className="detail-panel">
            <h2>{selected.label}</h2>
            <div className="formula-big">{selected.f}</div>
            <p className="desc">{selected.desc}</p>
          </div>
        )}
      </div>
    </div>
  )
}