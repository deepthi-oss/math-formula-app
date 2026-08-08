import { useState } from 'react'
import { signInWithGoogle } from './firebase'

export default function Login({ onLogin }) {
  const [studentName, setStudentName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleTeacherLogin = async () => {
    setLoading(true)
    setError('')
    try {
      const result = await signInWithGoogle()
      onLogin({
        role: 'teacher',
        name: result.user.displayName,
        email: result.user.email,
        photo: result.user.photoURL,
      })
    } catch (err) {
      setError('Google login failed. Please try again.')
    }
    setLoading(false)
  }

  const handleStudentLogin = () => {
    if (!studentName.trim()) { setError('Please enter your name.'); return }
    onLogin({
      role: 'student',
      name: studentName.trim(),
      email: null,
      photo: null,
    })
  }

  return (
    <div className="login-page">
      <div className="login-bg-shapes">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
        <div className="shape shape-3"></div>
        <div className="shape shape-4"></div>
      </div>

      <div className="login-content">
        <div className="login-logo">📐</div>
        <h1 className="login-title">Math Formula App</h1>
        <p className="login-sub">Who are you today?</p>

        <div className="login-cards">
          {/* Teacher Card */}
          <div className="login-card login-card-teacher">
            <div className="login-card-icon">👩‍🏫</div>
            <h2 className="login-card-title">I'm a Teacher</h2>
            <p className="login-card-desc">Access formula editor, control games, and manage student activities</p>
            <button
              className="login-btn login-btn-teacher"
              onClick={handleTeacherLogin}
              disabled={loading}
            >
              {loading ? 'Signing in...' : '🔐 Sign in with Google'}
            </button>
          </div>

          {/* Student Card */}
          <div className="login-card login-card-student">
            <div className="login-card-icon">🧑‍🎓</div>
            <h2 className="login-card-title">I'm a Student</h2>
            <p className="login-card-desc">Explore formulas, play games, and challenge your friends!</p>
            <input
              className="login-student-input"
              placeholder="Enter your name..."
              value={studentName}
              onChange={e => setStudentName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleStudentLogin()}
            />
            <button
              className="login-btn login-btn-student"
              onClick={handleStudentLogin}
            >
              🚀 Let's Go!
            </button>
          </div>
        </div>

        {error && <p className="login-error">{error}</p>}
      </div>
    </div>
  )
}