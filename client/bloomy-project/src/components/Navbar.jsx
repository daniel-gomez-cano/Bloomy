import React from 'react'

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        
        {/* Logo */}
        <div className="navbar-logo">
          <div className="logo-icon">🌱</div>
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
            ☀️
          </button>
          
          {/* CTA Button */}
          <button className="navbar-cta" onClick={() => console.log('Redirigir a registro')}>
            Empieza Ahora
          </button>
          
        </div>
        
        {/* Bottom border */}
        <div className="navbar-border"></div>
        
      </div>
    </nav>
  )
}

export default Navbar