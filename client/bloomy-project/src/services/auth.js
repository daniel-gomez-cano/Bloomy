import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
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
