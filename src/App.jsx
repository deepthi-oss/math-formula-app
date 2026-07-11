import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom'
import Home from './Home'
import FormulaExplorer from './FormulaExplorer'
import IdentityChallenge from './IdentityChallenge'
import './App.css'

function NavBar() {
  const location = useLocation()
  if (location.pathname === '/') return null
  return (
    <nav className="navbar">
      <div className="nav-title">📐 Math Formula App</div>
      <div className="nav-links">
        <Link to="/explore" className={location.pathname === '/explore' ? 'active' : ''}>Formula Explorer</Link>
        <Link to="/challenge" className={location.pathname === '/challenge' ? 'active' : ''}>Identity Challenge</Link>
      </div>
    </nav>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/explore" element={<FormulaExplorer />} />
        <Route path="/challenge" element={<IdentityChallenge />} />
      </Routes>
    </BrowserRouter>
  )
}