import axios from 'axios'

export async function getVapidPublicKey() {
  const { data } = await axios.get('/api/notifications/vapid-public-key', { withCredentials: true })
  return data?.publicKey
}

export async function subscribePush(subscription) {
  await axios.post('/api/notifications/subscribe', { subscription }, { withCredentials: true })
}

export async function unsubscribePush(endpoint) {
  await axios.post('/api/notifications/unsubscribe', { endpoint }, { withCredentials: true })
}

export async function notifyUser(payload) {
  await axios.post('/api/notifications/notify', payload, { withCredentials: true })
}