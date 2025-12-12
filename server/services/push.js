import webpush from 'web-push'

const VAPID_PUBLIC_KEY = process.env.VAPID_PUBLIC_KEY
const VAPID_PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY
const VAPID_SUBJECT = process.env.VAPID_SUBJECT || 'mailto:admin@bloomy.app'

export function configureWebPush() {
  if (VAPID_PUBLIC_KEY && VAPID_PRIVATE_KEY) {
    webpush.setVapidDetails(VAPID_SUBJECT, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY)
  } else {
    console.warn('VAPID keys missing. Push notifications disabled.')
  }
}

export async function sendPush(subscription, payload) {
  return webpush.sendNotification(subscription, JSON.stringify(payload))
}

export { VAPID_PUBLIC_KEY }