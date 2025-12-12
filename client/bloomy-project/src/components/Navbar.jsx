import React, { useState, useRef, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import BloomyLogo from '../assets/BloomyLogo.svg'
import { useAuth } from '../hooks/useAuth'
import { createCheckoutSession } from '../services/stripe'
import { changePassword as changePasswordApi } from '../services/auth'
import ThemeToggle from './ThemeToggle'

const Navbar = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, logout } = useAuth()
  const [open, setOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const menuRef = useRef(null)
  const mobileRef = useRef(null)
  const [pwOpen, setPwOpen] = useState(false)
  const [pw1, setPw1] = useState('')
  const [pw2, setPw2] = useState('')
  const [pwError, setPwError] = useState('')
  const [pwOk, setPwOk] = useState('')
  const [pwLoading, setPwLoading] = useState(false)
  const [pushEnabled, setPushEnabled] = useState(false)
  const [pushEndpoint, setPushEndpoint] = useState('')

  const isDashboard = location.pathname.startsWith('/dashboard')
  const isHome = location.pathname === '/' || location.pathname === ''
  const isConsejos = location.pathname.startsWith('/consejos')
  const isChat = location.pathname.startsWith('/bloomy-ia')
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

  const submitPwChange = async () => {
    try {
      setPwError(''); setPwOk('')
      if (!pw1 || pw1.length < 6) { setPwError('La contraseña debe tener al menos 6 caracteres'); return }
      if (pw1 !== pw2) { setPwError('Las contraseñas no coinciden'); return }
      setPwLoading(true)
      await changePasswordApi(pw1)
      setPwLoading(false)
      setPwOk('Contraseña actualizada ✅')
      setPw1(''); setPw2('')
      setTimeout(() => setPwOpen(false), 1200)
    } catch (err) {
      setPwLoading(false)
      setPwError(err?.response?.data?.message || 'No se pudo cambiar la contraseña')
    }
  }

  async function ensureSW() {
    if ('serviceWorker' in navigator) {
      return await navigator.serviceWorker.ready
    }
    return null
  }

  async function enablePush() {
    try {
      const reg = await ensureSW()
      if (!reg) throw new Error('SW no disponible')
      const { getVapidPublicKey, subscribePush, notifyUser } = await import('../services/push')
      const publicKey = await getVapidPublicKey()
      if (!publicKey) throw new Error('VAPID key no disponible')
      const sub = await reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: urlBase64ToUint8Array(publicKey) })
      setPushEndpoint(sub.endpoint)
      await subscribePush(sub)
      setPushEnabled(true)
      // Fire confirmation notification from server already, but also provide local feedback
      try { await notifyUser({ title: '🔔 Notificaciones activadas', body: 'Recibirás alertas de Bloomy', url: '/dashboard' }) } catch {}
    } catch (e) {
      console.error('Enable push failed', e)
    }
  }

  async function disablePush() {
    try {
      const reg = await ensureSW()
      if (!reg) return
      const sub = await reg.pushManager.getSubscription()
      if (sub) {
        const { unsubscribePush } = await import('../services/push')
        await unsubscribePush(sub.endpoint)
        await sub.unsubscribe()
      }
      setPushEnabled(false)
      setPushEndpoint('')
    } catch (e) {
      console.error('Disable push failed', e)
    }
  }

  function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
    const rawData = window.atob(base64)
    const outputArray = new Uint8Array(rawData.length)
    for (let i = 0; i < rawData.length; ++i) outputArray[i] = rawData.charCodeAt(i)
    return outputArray
  }

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo">
          <a onClick={() => navigate('/')} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', textDecoration: 'none', color: 'inherit' }}   >
            <img src={BloomyLogo} alt="Logo de Bloomy" className="logo-icon" />
            <h1 className="logo-text">Bloomy</h1>
          </a>
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
            {(isConsejos || isChat) && (
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
          
            {isChat && (
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
          
          {/* Bloomy IA button - prominent, left of theme toggle */}
            {isDashboard && isPremium && !isChat && (
              <button
                className="navbar-ia-btn"
                onClick={() => navigate('/bloomy-ia')}
                aria-label="Abrir Bloomy IA"
              >
                <span className="ia-icon" aria-hidden="true">✦</span>
                <span className="ia-text">Bloomy IA</span>
              </button>
            )}

          <ThemeToggle />

          {/* CTA or profile depending on route */}
          {isHome && (
            <button className="navbar-cta" onClick={() => navigate('/dashboard')}>
              Entrar
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
                  <div className="profile-push">
                    <div className="profile-push-label">Habilitar notificaciones</div>
                    <label className="switch">
                      <input type="checkbox" checked={pushEnabled} onChange={async (e) => {
                        if (e.target.checked) {
                          await enablePush()
                        } else {
                          await disablePush()
                        }
                      }} />
                      <span className="slider round"></span>
                    </label>
                  </div>
                  <button
                    className="logout-btn"
                    style={{ marginBottom: 8 }}
                    onClick={async () => {
                      try {
                        const { notifyUser } = await import('../services/push')
                        await notifyUser({ title: '🔔 Notificación de prueba', body: 'Este es un mensaje de prueba de Bloomy.', url: '/dashboard' })
                      } catch (e) {
                        console.error('Test push failed', e)
                      }
                    }}
                  >
                    Enviar notificación de prueba
                  </button>
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
                  <button
                    className="logout-btn"
                    style={{ marginBottom: 8 }}
                    onClick={() => {
                      setPwOpen((v) => !v)
                      setPw1(''); setPw2(''); setPwError(''); setPwOk('')
                    }}
                  >
                    Cambiar contraseña
                  </button>

                  {pwOpen && (
                    <div className="profile-change">
                      <input
                        type="password"
                        placeholder="Nueva contraseña"
                        value={pw1}
                        onChange={(e)=>{ setPw1(e.target.value); setPwError(''); setPwOk('') }}
                        onKeyDown={async(e)=>{ if(e.key==='Enter'){ e.preventDefault(); await submitPwChange() } }}
                      />
                      <input
                        type="password"
                        placeholder="Confirmar contraseña"
                        value={pw2}
                        onChange={(e)=>{ setPw2(e.target.value); setPwError(''); setPwOk('') }}
                        onKeyDown={async(e)=>{ if(e.key==='Enter'){ e.preventDefault(); await submitPwChange() } }}
                      />
                      {pwError && <div className="profile-msg error">{pwError}</div>}
                      {pwOk && <div className="profile-msg ok">{pwOk}</div>}
                    </div>
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

                {isHome && (
                  <button
                    className="navbar-cta"
                    onClick={() => { setMobileOpen(false); navigate('/dashboard') }}
                  >
                    Entrar
                  </button>
                )}

                {/* En /consejos en mobile, incluir 'Dashboard' para volver */}
                {(isConsejos || isChat) && (
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
                {isDashboard && isPremium && !isChat && (
                  <button
                    className="navbar-ia-btn"
                    onClick={() => { setMobileOpen(false); navigate('/bloomy-ia') }}
                  >
                    <span className="ia-icon" aria-hidden="true">✦</span> Bloomy IA
                  </button>
                )}
                {/* Theme toggle in mobile */}
                <div style={{ padding: '8px 0' }}>
                  <ThemeToggle />
                </div>
                {isChat && (
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