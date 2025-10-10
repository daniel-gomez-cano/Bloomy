import React from 'react'
import { useNavigate } from 'react-router-dom'
import BloomyLogo from '../assets/BloomyLogo.svg' // Asegúrate de tener un logo en esta ruta

const Navbar = () => {
  const navigate = useNavigate()
  return (
    <nav className="navbar">
      <div className="navbar-container">
        
        {/* Logo */}
        <div className="navbar-logo">
          <img src={BloomyLogo} alt="Bloomy Logo" className="logo-icon" />
          <h1 className="logo-text">Bloomy</h1>
        </div>
        
        {/* Navigation Items */}
        <div className="navbar-menu">
          
          <div className="navbar-links">
            <a href="#consejos" className="navbar-link">
              Consejos
            </a>
            <a href="#soporte" className="navbar-link">
              Soporte
            </a>
          </div>
          
          {/* Theme Toggle */}
          <button className="theme-toggle" aria-label="Toggle theme">
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M14 18.6667C16.5774 18.6667 18.6667 16.5773 18.6667 14C18.6667 11.4227 16.5774 9.33334 14 9.33334C11.4227 9.33334 9.33337 11.4227 9.33337 14C9.33337 16.5773 11.4227 18.6667 14 18.6667Z" stroke="white" stroke-linejoin="round"/>
              <path d="M23.3333 14H24.5M3.5 14H4.66667M14 23.3333V24.5M14 3.5V4.66667M20.5998 20.5998L21.4247 21.4247M6.57533 6.57533L7.40017 7.40017M7.40017 20.5998L6.57533 21.4247M21.4247 6.57533L20.5998 7.40017" stroke="white" stroke-linecap="round"/>
            </svg>
          </button>
          
          {/* CTA Button */}
          <button className="navbar-cta" onClick={() => navigate('/register')}>
            Empieza Ahora
          </button>
          
        </div>
        
        {/* Bottom border 
        <div className="navbar-border"></div>*/}
        
      </div>
    </nav>
  )
}

export default Navbar