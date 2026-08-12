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
      <div className="login-grid-header">
        <span className="login-grid-logo">📐 MATH FORMULA APP</span>
        <span className="login-grid-tag">// sandbox environment — select your role to continue</span>
      </div>

      <div className="login-grid-content">
        <div className="login-grid-card">
          <div className="login-grid-card-label">TEACHER LOGIN <span className="login-ref">FORM-01</span></div>
          <div className="login-grid-card-body">
            <div className="login-grid-field-label">ROLE</div>
            <div className="login-grid-role-display">👩‍🏫 Teacher — Full Access</div>
            <div className="login-grid-field-label" style={{ marginTop: 16 }}>AUTHENTICATION</div>
            <div className="login-grid-role-display" style={{ color: '#6B7280', fontSize: 13 }}>Google Account Required</div>
            <button
              className="login-grid-btn login-grid-btn-teacher"
              onClick={handleTeacherLogin}
              disabled={loading}
            >
              {loading ? 'SIGNING IN...' : '🔐 SIGN IN WITH GOOGLE'}
            </button>
          </div>
        </div>

        <div className="login-grid-card">
          <div className="login-grid-card-label">STUDENT LOGIN <span className="login-ref">FORM-02</span></div>
          <div className="login-grid-card-body">
            <div className="login-grid-field-label">NAME</div>
            <input
              className="login-grid-input"
              placeholder="e.g. Arjun, Priya..."
              value={studentName}
              onChange={e => setStudentName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleStudentLogin()}
            />
            <div className="login-grid-field-label" style={{ marginTop: 12 }}>ACCESS LEVEL</div>
            <div className="login-grid-role-display" style={{ color: '#6B7280', fontSize: 13 }}>Full access to all games & formulas</div>
            <button
              className="login-grid-btn login-grid-btn-student"
              onClick={handleStudentLogin}
            >
              🚀 LET'S GO
            </button>
          </div>
        </div>
      </div>

      <div className="login-grid-test-cases">
        <div className="login-grid-tc-label">ACCESS LEVELS <span className="login-ref">REF-01</span></div>
        <div className="login-grid-tc-list">
          <div className="login-grid-tc-item">01 &nbsp; Teacher login — Google account required, full edit access</div>
          <div className="login-grid-tc-item">02 &nbsp; Student login — name only, access to all games and formulas</div>
          <div className="login-grid-tc-item">03 &nbsp; Teacher can add and edit formulas across all grades</div>
          <div className="login-grid-tc-item">04 &nbsp; Student can play Identity Challenge, Tug of War, Myth Math</div>
          <div className="login-grid-tc-item">05 &nbsp; Both roles can explore Formula Explorer by sector and grade</div>
        </div>
      </div>

      {error && <div className="login-grid-error">{error}</div>}
    </div>
  )
}