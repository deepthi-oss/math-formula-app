import { useNavigate } from 'react-router-dom'

export default function Home({ user }) {
  const navigate = useNavigate()

  return (
    <div className="home-page">
      <div className="home-bg-shapes">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
        <div className="shape shape-3"></div>
        <div className="shape shape-4"></div>
      </div>

      <div className="home-content">
        <div className="home-top-badge">
          {user?.role === 'teacher' ? '👩‍🏫 Welcome back, Teacher!' : `👋 Hello, ${user?.name || 'Student'}!`}
        </div>
        <h1 className="home-title">
          Learn Math<br />
          <span className="home-title-accent">The Fun Way!</span>
        </h1>
        <p className="home-tagline">
          Explore formulas, compete with friends, and master Math — one identity at a time.
        </p>

        <div className="home-feature-cards">
          <div className="home-feat-card feat-purple" onClick={() => navigate('/explore')}>
            <span className="feat-icon">📐</span>
            <span className="feat-label">Formula Explorer</span>
          </div>
          <div className="home-feat-card feat-blue" onClick={() => navigate('/challenge')}>
            <span className="feat-icon">⚡</span>
            <span className="feat-label">Identity Challenge</span>
          </div>
          <div className="home-feat-card feat-green" onClick={() => navigate('/myth')}>
            <span className="feat-icon">🎯</span>
            <span className="feat-label">Myth Math Challenge</span>
          </div>
          <div className="home-feat-card feat-orange" onClick={() => navigate('/tug')}>
            <span className="feat-icon">🪢</span>
            <span className="feat-label">Tug of War</span>
          </div>
        </div>
      </div>
    </div>
  )
}