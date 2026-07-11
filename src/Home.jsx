import { useNavigate } from 'react-router-dom'

export default function Home() {
  const navigate = useNavigate()

  return (
    <div className="home-page">
      <div className="home-card">
        <div className="home-emoji">📐🔢✏️</div>
        <h1 className="home-title">Math Formula App</h1>
        <p className="home-tagline">
          Learn formulas, explore concepts, and challenge your friends — all in one place!
        </p>
        <div className="home-badges">
          <span>🧮 Arithmetic</span>
          <span>📊 Algebra</span>
          <span>📐 Geometry</span>
          <span>🏆 Challenges</span>
        </div>
        <button className="home-btn" onClick={() => navigate('/explore')}>
          🚀 Get Started
        </button>
      </div>
    </div>
  )
}