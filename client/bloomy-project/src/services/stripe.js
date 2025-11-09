import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '',
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
})

export async function createCheckoutSession() {
  const res = await api.post('/api/stripe/create-checkout-session')
  return res.data
}

export async function confirmCheckoutSession(sessionId) {
  const res = await api.post('/api/stripe/confirm', { session_id: sessionId })
  return res.data
}
