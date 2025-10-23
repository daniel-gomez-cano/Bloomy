import React, { useState, useRef, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import BloomyLogo from '../assets/BloomyLogo.svg'
import { useAuth } from '../hooks/useAuth'
import { createCheckoutSession } from '../services/stripe'
import ThemeToggle from './ThemeToggle'

const Navbar = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, logout } = useAuth()
  const [open, setOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const menuRef = useRef(null)
  const mobileRef = useRef(null)

  const isDashboard = location.pathname.startsWith('/dashboard')
  const isHome = location.pathname === '/' || location.pathname === ''
  const isConsejos = location.pathname.startsWith('/consejos')
  const isPremium = !!user?.isPremium

  const handleLogout = async () => {
    await logout()
    setOpen(false)
    setMobileOpen(false)
    navigate('/', { replace: true })
  }

  useEffect(() => {
    function onDocClick(e) {
      if (open && menuRef.current && !menuRef.current.contains(e.target)) setOpen(false)
      if (mobileOpen && mobileRef.current && !mobileRef.current.contains(e.target) && !e.target.closest('.mobile-toggle')) setMobileOpen(false)
    }
    function onEsc(e) {
      if (e.key === 'Escape') {
        setOpen(false)
        setMobileOpen(false)
      }
    }
    document.addEventListener('mousedown', onDocClick)
    document.addEventListener('keydown', onEsc)
    return () => {
      document.removeEventListener('mousedown', onDocClick)
      document.removeEventListener('keydown', onEsc)
    }
  }, [open, mobileOpen])

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo">
          <img src={BloomyLogo} alt="Bloomy Logo" className="logo-icon" />
          <h1 className="logo-text">Bloomy</h1>
        </div>

        <div className="navbar-menu">
          <div className="navbar-links">
            {isHome && (
              <a
                href="#como-funciona"
                className="navbar-link"
                onClick={(e) => {
                  e.preventDefault()
                  const el = document.getElementById('como-funciona')
                  if (el) el.scrollIntoView({ behavior: 'smooth' })
                  else window.location.hash = 'como-funciona'
                }}
              >
                ¿Cómo Funciona?
              </a>
            )}

            {/* En /consejos mostrar link para volver a Dashboard */}
            {isConsejos && (
              <button className="navbar-link" onClick={() => navigate('/dashboard')}>
                Dashboard
              </button>
            )}

            {/* Consejos visible solo en dashboard para usuarios premium, y no en la página de Consejos */}
            {isDashboard && isPremium && !isConsejos && (
              <button
                className="navbar-link"
                onClick={() => navigate('/consejos')}
              >
                Consejos
              </button>
            )}

            <a href="https://wa.me/3163197861" className="navbar-link" target="_blank" rel="noreferrer">
              Soporte
            </a>
          </div>

          <ThemeToggle />

          {/* CTA or profile depending on route */}
          {isHome && (
            <button className="navbar-cta" onClick={() => navigate('/dashboard')}>
              Dashboard
            </button>
          )}

          {(isDashboard || isConsejos) && (
            <div className="navbar-profile" ref={menuRef}>
              <button className="profile-btn" onClick={() => setOpen((v) => !v)} aria-haspopup="true" aria-expanded={open} aria-label="Perfil">
                <div className="profile-icon">{user?.nombre ? user.nombre.charAt(0).toUpperCase() : 'U'}</div>
              </button>

              {open && (
                <div className="profile-menu" role="menu">
                  <div className="profile-name">{user?.nombre || user?.correo}</div>
                  <div className="profile-status">{user?.isPremium ? 'Premium' : 'No Premium'}</div>
                  {!user?.isPremium && isDashboard && (
                    <button
                      className="logout-btn"
                      style={{ marginBottom: 8 }}
                      onClick={async () => {
                        try {
                          const data = await createCheckoutSession()
                          setOpen(false)
                          if (data?.url) window.location.href = data.url
                        } catch (e) {
                          console.error('Checkout error', e)
                        }
                      }}
                    >
                      Mejorar a Premium
                    </button>
                  )}
                  <button className="logout-btn" onClick={handleLogout}>Cerrar sesión</button>
                </div>
              )}
            </div>
          )}

          {/* Mobile toggle */}
          <button className="mobile-toggle" aria-label="Abrir menú" onClick={() => setMobileOpen(v => !v)}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 6h18M3 12h18M3 18h18" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>

          {mobileOpen && (
            <div className="mobile-menu" ref={mobileRef}>
              <div className="mobile-links">
                {isHome && (
                  <a
                    href="#como-funciona"
                    className="navbar-link"
                    onClick={(e) => {
                      e.preventDefault()
                      const el = document.getElementById('como-funciona')
                      if (el) el.scrollIntoView({ behavior: 'smooth' })
                      else window.location.hash = 'como-funciona'
                      setMobileOpen(false)
                    }}
                  >
                    ¿Cómo Funciona?
                  </a>
                )}

                {/* En /consejos en mobile, incluir 'Dashboard' para volver */}
                {isConsejos && (
                  <button
                    className="navbar-link"
                    onClick={() => { setMobileOpen(false); navigate('/dashboard') }}
                  >
                    Dashboard
                  </button>
                )}

                {/* Consejos en mobile: solo para premium dentro de dashboard y no en /consejos */}
                {isDashboard && isPremium && !isConsejos && (
                  <button
                    className="navbar-link"
                    onClick={() => { setMobileOpen(false); navigate('/consejos') }}
                  >
                    Consejos
                  </button>
                )}

                <a href="https://wa.me/3163197861" className="navbar-link">Soporte</a>
              </div>

              {isDashboard ? (
                <div className="mobile-profile">
                  <div className="profile-name">{user?.nombre || user?.correo}</div>
                  <div className="profile-status">{user?.isPremium ? 'Premium' : 'No Premium'}</div>
                  <button className="logout-btn" onClick={handleLogout}>Cerrar sesión</button>
                </div>
              ) : (
                // En Home mostrar CTA de Dashboard, en otras páginas se mantiene 'Empieza Ahora'
                isHome ? (
                  <button className="navbar-cta" onClick={() => { setMobileOpen(false); navigate('/dashboard') }}>Dashboard</button>
                ) : (
                  <button className="navbar-cta" onClick={() => { setMobileOpen(false); navigate('/register') }}>Empieza Ahora</button>
                )
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar