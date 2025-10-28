import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '',
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
})

export async function generateAIReport({ lat, lng, extras }) {
  const res = await api.post('/api/ai/report', { lat, lng, extras })
  return res.data
}
