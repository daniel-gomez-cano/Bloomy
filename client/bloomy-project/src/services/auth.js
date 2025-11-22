import axios from 'axios'

const api = axios.create({
  // Use relative path so Vite dev server can proxy /api -> backend (same-origin cookies)
  baseURL: import.meta.env.VITE_API_URL || '',
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
})

export async function registerUser({ nombre, correo, contrasena }) {
  const res = await api.post('/api/auth/register', { nombre, correo, contrasena })
  return res.data
}

export async function loginUser({ correo, contrasena }) {
  const res = await api.post('/api/auth/login', { correo, contrasena })
  return res.data
}

export async function me() {
  const res = await api.get('/api/auth/me')
  return res.data
}

export async function logoutUser() {
  const res = await api.post('/api/auth/logout')
  return res.data
}

// Email verification
export async function requestEmailVerification(correo) {
  const res = await api.post('/api/auth/email/request-code', { correo })
  return res.data
}

export async function verifyEmailVerification(correo, codigo) {
  const res = await api.post('/api/auth/email/verify-code', { correo, codigo })
  return res.data
}

export async function changePassword(contrasena) {
  const res = await api.post('/api/auth/change-password', { contrasena })
  return res.data
}

// Premium chat streaming service
export async function streamChat(messages, onToken, onDone, onError) {
  // Uses fetch directly to handle text/event-stream
  try {
    // API_BASE no existía -> usar ruta relativa para que Vite proxy /api al backend
    const response = await fetch(`/api/ai/chat`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages })
    })
    if (!response.ok) {
      const errText = await response.text()
      throw new Error(errText || 'Error en chat')
    }
    const reader = response.body.getReader()
    const decoder = new TextDecoder('utf-8')
    let buffer = ''
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      buffer += decoder.decode(value, { stream: true })
      const parts = buffer.split('\n\n')
      // Keep last partial
      buffer = parts.pop()
      for (const p of parts) {
        const line = p.trim()
        if (!line.startsWith('data:')) continue
        try {
          const payload = JSON.parse(line.slice(5).trim())
          if (payload.token && onToken) onToken(payload.token)
          if (payload.done && onDone) onDone()
          if (payload.error && onError) onError(payload.error)
        } catch {
          // ignore parse errors
        }
      }
    }
    if (onDone) onDone()
  } catch (err) {
    if (onError) onError(err.message)
  }
}

// Forgot password
export async function requestPasswordReset(correo) {
  const res = await api.post('/api/auth/password/request', { correo })
  return res.data
}

export async function verifyPasswordReset(correo, codigo) {
  const res = await api.post('/api/auth/password/verify', { correo, codigo })
  return res.data
}

export async function resetPassword(correo, codigo, contrasena) {
  const res = await api.post('/api/auth/password/reset', { correo, codigo, contrasena })
  return res.data
}

// Google login: send ID token obtained from Google Identity Services
export async function loginWithGoogle(credential) {
  const res = await api.post('/api/auth/google', { credential })
  return res.data
}
