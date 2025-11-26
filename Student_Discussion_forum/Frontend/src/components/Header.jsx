import { Link, NavLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './Header.css'

const Header = () => {
  const { user, logout } = useAuth()

  return (
    <header className="app-header">
      <Link to="/" className="logo">Student Forum</Link>
      <nav>
        <NavLink to="/" end>Home</NavLink>
        <NavLink to="/about">About</NavLink>
        <NavLink to="/contact">Contact</NavLink>
        {user ? (
          <div className="user-pill">
            <span className="avatar" style={{ backgroundColor: user.avatarColor }}>{user.fullName[0]}</span>
            <span>{user.fullName}</span>
            <button type="button" onClick={logout}>Logout</button>
          </div>
        ) : (
          <>
            <NavLink to="/login">Login</NavLink>
            <NavLink to="/register" className="primary">Sign up</NavLink>
          </>
        )}
      </nav>
    </header>
  )
}

export default Header