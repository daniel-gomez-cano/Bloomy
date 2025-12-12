self.addEventListener('push', function(event) {
  let data = {}
  try {
    data = event.data ? event.data.json() : {}
  } catch (_) {}
  console.log('[Bloomy SW] push event received', data)
  const title = data.title || 'Bloomy'
  const body = data.body || 'Tienes una nueva notificación.'
  const icon = '/bloomy-icon.png'
  const badge = '/bloomy-icon.png'
  const url = data.url || '/'
  event.waitUntil(
    self.registration.showNotification(title, {
      body,
      icon,
      badge,
      requireInteraction: true,
      data: { url },
    })
  )
})

self.addEventListener('notificationclick', function(event) {
  event.notification.close()
  const url = (event.notification && event.notification.data && event.notification.data.url) || '/'
  console.log('[Bloomy SW] notification click', url)
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(windowClients => {
      for (const client of windowClients) {
        if (client.url.includes(url) && 'focus' in client) {
          return client.focus()
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(url)
      }
    })
  )
})