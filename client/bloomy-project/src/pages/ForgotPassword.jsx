import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './register.css'

import BloomyLogo from '../assets/BloomyLogo.svg'
import { requestPasswordReset, verifyPasswordReset, resetPassword } from '../services/auth'

export default function ForgotPassword() {
  const [correo, setCorreo] = useState('')
  const [codigo, setCodigo] = useState('')
  const [pw1, setPw1] = useState('')
  const [pw2, setPw2] = useState('')

  const [sent, setSent] = useState(false)
  const [verified, setVerified] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  const navigate = useNavigate()

  const sendCode = async () => {
    setError(''); setMessage('')
    if (!correo.trim()) { setError('Ingresa un correo'); return }
    try {
      setLoading(true)
      await requestPasswordReset(correo)
      setLoading(false)
      setSent(true)
      setMessage('Código enviado. Revisa tu correo.')
    } catch (err) {
      setLoading(false)
      setError(err?.response?.data?.message || 'No se pudo enviar el código')
    }
  }

  const verifyCode = async () => {
    setError(''); setMessage('')
    if (!codigo.trim()) { setError('Ingresa el código'); return }
    try {
      setLoading(true)
      await verifyPasswordReset(correo, codigo)
      setLoading(false)
      setVerified(true)
      setMessage('Código verificado ✅')
    } catch (err) {
      setLoading(false)
      setError(err?.response?.data?.message || 'Código inválido')
    }
  }

  const submitReset = async () => {
    setError(''); setMessage('')
    if (!pw1 || pw1.length < 6) { setError('La contraseña debe tener al menos 6 caracteres'); return }
    if (pw1 !== pw2) { setError('Las contraseñas no coinciden'); return }
    try {
      setLoading(true)
      await resetPassword(correo, codigo, pw1)
      setLoading(false)
      setMessage('Contraseña actualizada ✅')
      setTimeout(() => navigate('/login', { replace: true }), 1200)
    } catch (err) {
      setLoading(false)
      setError(err?.response?.data?.message || 'No se pudo restablecer la contraseña')
    }
  }

  return (
    <div className="register-page">
      <div className="register-container">
        <div className="decorative-svg left-svg" aria-hidden>
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

        <form className="register-form" onSubmit={(e)=> e.preventDefault()} noValidate>
          <div style={{ textAlign: 'center', marginBottom: 10 }}>
            <img src={BloomyLogo} alt="Bloomy Logo" style={{ width: 56, height: 56 }} />
          </div>
          <h1 className="register-title">Restablecer contraseña</h1>

          <label htmlFor="correo">Correo</label>
          <div className="inline-row">
            <input
              type="email"
              id="correo"
              name="correo"
              placeholder="ejemplo@correo.com"
              value={correo}
              onChange={(e)=> setCorreo(e.target.value)}
              disabled={verified}
            />
            <button type="button" className="verify-btn" onClick={sendCode} disabled={loading || verified}>
              {loading ? 'Enviando…' : sent ? 'Reenviar' : 'Enviar código'}
            </button>
          </div>

          {sent && !verified && (
            <>
              <label htmlFor="codigo">Código de verificación</label>
              <div className="inline-row">
                <input
                  type="text"
                  id="codigo"
                  name="codigo"
                  placeholder="Ingresa el código"
                  value={codigo}
                  onChange={(e)=> setCodigo(e.target.value)}
                />
                <button type="button" className="verify-btn" onClick={verifyCode} disabled={loading}>Verificar</button>
              </div>
            </>
          )}

          {verified && (
            <>
              <label htmlFor="pw1">Nueva contraseña</label>
              <input type="password" id="pw1" placeholder="••••••••" value={pw1} onChange={(e)=> setPw1(e.target.value)} />
              <label htmlFor="pw2">Confirmar contraseña</label>
              <input type="password" id="pw2" placeholder="••••••••" value={pw2} onChange={(e)=> setPw2(e.target.value)} />
              <button type="button" className="register-submit" onClick={submitReset} disabled={loading}>
                Actualizar contraseña
              </button>
            </>
          )}

          {error && <p className="error-message" role="alert">{error}</p>}
          {message && <p className="status-message">{message}</p>}

          <p className="register-switch">Volver a  <Link to="/login"> Iniciar sesión</Link></p>
        </form>
      </div>
    </div>
  )
}
