import React, { useState, useRef, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import BloomyLogo from '../assets/BloomyLogo.svg'
import { useAuth } from '../hooks/useAuth'
import { createCheckoutSession } from '../services/stripe'

const Navbar = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, logout } = useAuth()
  const [open, setOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const menuRef = useRef(null)
  const mobileRef = useRef(null)

  const isDashboard = location.pathname.startsWith('/dashboard')

  // Nav label and href differ between home and dashboard
  const navLink = isDashboard
    ? { label: 'Consejos', href: '/consejos' }
    : { label: '\u00bfC\u00f3mo funciona?', href: '#como-funciona' }

  const handleLogout = async () => {
    await logout()
    setOpen(false)
    setMobileOpen(false)
    navigate('/', { replace: true })
  }

  // Close dropdown on click outside or on Escape
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
        
        {/* Logo */}
        <div className="navbar-logo">
          <img src={BloomyLogo} alt="Bloomy Logo" className="logo-icon" />
          <h1 className="logo-text">Bloomy</h1>
        </div>
        
        {/* Navigation Items */}
      <div className="navbar-menu">
          
          <div className="navbar-links">
              <a
                href={navLink.href}
                className="navbar-link"
                onClick={(e) => {
                  // If on Home, smooth-scroll to the split section; if on Dashboard, navigate to /consejos
                  if (!isDashboard) {
                    e.preventDefault()
                    const el = document.getElementById('como-funciona')
                    if (el) el.scrollIntoView({ behavior: 'smooth' })
                    else window.location.hash = 'como-funciona'
                  } else {
                    e.preventDefault()
                    navigate(navLink.href)
                  }
                }}
              >
                {navLink.label}
              </a>
              <a href="https://wa.me/3163197861" className="navbar-link" target='_blank' rel="noreferrer">
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
          
          {/* CTA Button or Profile */}
          {isDashboard ? (
            <div className="navbar-profile" ref={menuRef}>
              <button className="profile-btn" onClick={() => setOpen((v) => !v)} aria-haspopup="true" aria-expanded={open} aria-label="Perfil">
                {/* simple circle icon */}
                <div className="profile-icon">{user?.nombre ? user.nombre.charAt(0).toUpperCase() : 'U'}</div>
              </button>
              {open && (
                <div className="profile-menu" role="menu">
                  <div className="profile-name">{user?.nombre || user?.correo}</div>
                  <div className="profile-status">{user?.isPremium ? 'Premium' : 'No Premium'}</div>
                  {!user?.isPremium && (
                    <button
                      className="logout-btn" // reutilizo estilos de botón para enlace
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
          ) : (
            <>
              <button className="navbar-cta" onClick={() => navigate('/dashboard')}>
                Empieza Ahora
              </button>
            </>
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
                <a
                  href={navLink.href}
                  className="navbar-link"
                  onClick={(e) => {
                    e.preventDefault()
                    if (!isDashboard) {
                      const el = document.getElementById('como-funciona')
                      if (el) el.scrollIntoView({ behavior: 'smooth' })
                      else window.location.hash = 'como-funciona'
                      setMobileOpen(false)
                    } else {
                      setMobileOpen(false)
                      navigate('/consejos')
                    }
                  }}
                >
                  {navLink.label}
                </a>
                <a href="https://wa.me/3163197861" className="navbar-link">Soporte</a>
              </div>
              {isDashboard ? (
                <div className="mobile-profile">
                  <div className="profile-name">{user?.nombre || user?.correo}</div>
                  <div className="profile-status">{user?.isPremium ? 'Premium' : 'No Premium'}</div>
                  <button className="logout-btn" onClick={handleLogout}>Cerrar sesión</button>
                </div>
              ) : (
                <button className="navbar-cta" onClick={() => { setMobileOpen(false); navigate('/register') }}>Empieza Ahora</button>
              )}
            </div>
          )}
          
        </div>
        
        {/* Bottom border 
        <div className="navbar-border"></div>*/}
        
      </div>
    </nav>
  )
}

export default Navbar