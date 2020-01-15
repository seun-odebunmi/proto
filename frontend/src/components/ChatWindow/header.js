import React from 'react'
import './Header.css'

function Header({ user }) {
  const { name } = user
  return (
    <header className="Header">
      <h2 className="Header__name">{name}</h2>
    </header>
  )
}

export default Header
