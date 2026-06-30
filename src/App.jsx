import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom'
import FormulaExplorer from './FormulaExplorer'
import IdentityChallenge from './IdentityChallenge'
import './App.css'

function NavBar() {
  const location = useLocation()
  return (
    <nav className="navbar">
      <div className="nav-title">📐 Math Formula App</div>
      <div className="nav-links">
        <Link to="/" className={location.pathname === '/' ? 'active' : ''}>Formula Explorer</Link>
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
        <Route path="/" element={<FormulaExplorer />} />
        <Route path="/challenge" element={<IdentityChallenge />} />
      </Routes>
    </BrowserRouter>
  )
}