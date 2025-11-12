import React from 'react'
import './Header.css'
import { Link, NavLink } from 'react-router-dom'
const Header = () => {
  return (
    <header className="header">
      <Link to="/" className="logo">Student Forum</Link>
      <nav>
        <ul>
          <li><NavLink to="/" end>Home</NavLink></li>
          <li><NavLink to="/about">About</NavLink></li>
          <li><NavLink to="/contact">Contact</NavLink></li>
        </ul>
      </nav>
    </header>
  )
}

export default Header