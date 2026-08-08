import { useState } from 'react'
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom'
import Login from './Login'
import Home from './Home'
import FormulaExplorer from './FormulaExplorer'
import IdentityChallenge from './IdentityChallenge'
import TugOfWar from './TugOfWar'
import { logOut } from './firebase'
import './App.css'

function NavBar({ user, onLogout }) {
  const location = useLocation()
  if (location.pathname === '/') return null
  return (
    <nav className="navbar">
      <div className="nav-title">📐 Math Formula App</div>
      <div className="nav-links">
        <Link to="/explore" className={location.pathname === '/explore' ? 'active' : ''}>Formula Explorer</Link>
        <Link to="/challenge" className={location.pathname === '/challenge' ? 'active' : ''}>Identity Challenge</Link>
        <Link to="/tug" className={location.pathname === '/tug' ? 'active' : ''}>Tug of War</Link>
      </div>
      <div className="nav-user">
        {user?.photo && <img src={user.photo} alt={user.name} className="nav-avatar" />}
        <span className="nav-user-name">{user?.name}</span>
        <span className={`nav-role-badge ${user?.role === 'teacher' ? 'badge-teacher' : 'badge-student'}`}>
          {user?.role === 'teacher' ? '👩‍🏫 Teacher' : '🧑‍🎓 Student'}
        </span>
        <button className="nav-logout-btn" onClick={onLogout}>Logout</button>
      </div>
    </nav>
  )
}

function AppContent({ user, onLogout }) {
  const location = useLocation()
  return (
    <>
      <NavBar user={user} onLogout={onLogout} />
      <Routes>
        <Route path="/" element={<Home user={user} />} />
        <Route path="/explore" element={<FormulaExplorer user={user} />} />
        <Route path="/challenge" element={<IdentityChallenge />} />
        <Route path="/tug" element={<TugOfWar />} />
      </Routes>
    </>
  )
}

export default function App() {
  const [user, setUser] = useState(null)

  const handleLogin = (userData) => setUser(userData)

  const handleLogout = async () => {
    if (user?.role === 'teacher') await logOut()
    setUser(null)
  }

  if (!user) return <Login onLogin={handleLogin} />

  return (
    <BrowserRouter>
      <AppContent user={user} onLogout={handleLogout} />
    </BrowserRouter>
  )
}