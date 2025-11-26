import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import BloomyLogo from '../assets/BloomyLogo.svg'
import './login.css'
import GoogleLoginButton from '../components/GoogleLoginButton'

export default function Login() {
  const [form, setForm] = useState({ correo: '', contrasena: '' })
  const [errors, setErrors] = useState({})
  const [submitError, setSubmitError] = useState('')
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((f) => ({ ...f, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const newErrors = {}
    if (!form.correo.trim()) newErrors.correo = 'Ingresa un correo'
    if (!form.contrasena) newErrors.contrasena = 'Ingresa una contraseña'
    setErrors(newErrors)
    if (Object.keys(newErrors).length > 0) return
    try {
      setSubmitError('')
      await login({ correo: form.correo, contrasena: form.contrasena })
      navigate('/dashboard', { replace: true })
    } catch (err) {
      setSubmitError(err?.response?.data?.message || 'Error al iniciar sesión')
    }
  }

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="decorative-svg left-svg" aria-hidden>
          {/* Reutilizamos las mismas formas para mantener consistencia visual */}
          <svg width="264" height="251" viewBox="0 0 264 251" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path opacity="0.82" d="M132 171.483C132 251.976 99.3168 302 59 302C18.6832 302 -14 251.976 -14 171.483C-14 102.783 32.1052 16 59 16C85.8949 16 132 102.783 132 171.483Z" fill="var(--Corp)"/>
            <path d="M191 202.483C191 282.976 158.317 333 118 333C77.6832 333 45 282.976 45 202.483C45 133.783 91.1052 47 118 47C144.895 47 191 133.783 191 202.483Z" fill="var(--Bord)"/>
            <path opacity="0.64" d="M191 202.483C191 282.976 158.317 333 118 333C77.6832 333 45 282.976 45 202.483C45 133.783 91.1052 47 118 47C144.895 47 191 133.783 191 202.483Z" fill="var(--Bord)"/>
            <path opacity="0.82" d="M264 229.483C264 309.976 231.317 360 191 360C150.683 360 118 309.976 118 229.483C118 160.783 164.105 74 191 74C217.895 74 264 160.783 264 229.483Z" fill="var(--Corp)"/>
            <path opacity="0.84" d="M74 155.483C74 235.976 41.3168 286 1 286C-39.3168 286 -72 235.976 -72 155.483C-72 86.7829 -25.8948 0 1 0C27.8949 0 74 86.7829 74 155.483Z" fill="var(--Bord)"/>
          </svg>
        </div>
        <div className="decorative-svg right-svg" aria-hidden>
          <svg width="267" height="251" viewBox="0 0 267 251" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path opacity="0.82" d="M132 171.483C132 251.976 164.683 302 205 302C245.317 302 278 251.976 278 171.483C278 102.783 231.895 16 205 16C178.105 16 132 102.783 132 171.483Z" fill="var(--Corp)"/>
            <path d="M73 202.483C73 282.976 105.683 333 146 333C186.317 333 219 282.976 219 202.483C219 133.783 172.895 47 146 47C119.105 47 73 133.783 73 202.483Z" fill="var(--Bord)"/>
            <path opacity="0.64" d="M73 202.483C73 282.976 105.683 333 146 333C186.317 333 219 282.976 219 202.483C219 133.783 172.895 47 146 47C119.105 47 73 133.783 73 202.483Z" fill="var(--Bord)"/>
            <path opacity="0.82" d="M0 229.483C0 309.976 32.6832 360 73 360C113.317 360 146 309.976 146 229.483C146 160.783 99.8948 74 73 74C46.1051 74 0 160.783 0 229.483Z" fill="var(--Corp)"/>
            <path opacity="0.84" d="M190 155.483C190 235.976 222.683 286 263 286C303.317 286 336 235.976 336 155.483C336 86.7829 289.895 0 263 0C236.105 0 190 86.7829 190 155.483Z" fill="var(--Bord)"/>
          </svg>
        </div>

        <form className="login-form" onSubmit={handleSubmit} noValidate>
          <div className="login-logo">
            <a href="/" aria-label="Ir a inicio">
              <img src={BloomyLogo} className="login-logo-img" alt="Logo Bloomy" />
            </a>
          </div>
          <h1 className="login-title">Login</h1>

          <label htmlFor="correo">Ingrese correo</label>
          <input
            type="email"
            aria-label='Ingresa tu correo'
            id="correo"
            name="correo"
            placeholder="ejemplo@correo.com"
            value={form.correo}
            onChange={handleChange}
            className={errors.correo ? 'input-error' : ''}
          />
          {errors.correo && <p className="error-message">{errors.correo}</p>}

          <label htmlFor="contrasena">Ingrese contraseña</label>
          <input
            type="password"
            id="contrasena"
            name="contrasena"
            placeholder="••••••••"
            value={form.contrasena}
            onChange={handleChange}
            className={errors.contrasena ? 'input-error' : ''}
          />
          {errors.contrasena && <p className="error-message">{errors.contrasena}</p>}

          {submitError && <p className="error-message" role="alert">{submitError}</p>}
          <button type="submit" className="login-submit">Ingresar</button>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8, margin: '12px 0' }}>
            <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.15)' }} />
            <span style={{ color: 'rgba(255,255,255,0.7)' }}>o</span>
            <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.15)' }} />
          </div>

          <GoogleLoginButton onSuccess={() => navigate('/dashboard', { replace: true })} />

          <p className="login-switch">
            ¿No tienes cuenta? <Link to="/register">Regístrate</Link>
          </p>
          <p className="login-switch" style={{ marginTop: 6 }}>
            <Link to="/recuperar-contrasena">¿Olvidaste tu contraseña?</Link>
          </p>
        </form>
      </div>
    </div>
  )
}
