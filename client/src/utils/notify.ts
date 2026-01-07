export function notificationsGranted() {
  try {
    return typeof Notification !== 'undefined' && Notification.permission === 'granted'
  } catch {
    return false
  }
}

export function notify(title: string, body: string, opts?: { tag?: string }) {
  try {
    if (!notificationsGranted()) return

    const tag = opts?.tag ?? 'lrcom'

    // Direct Notification API is most reliable for desktop notifications.
    // Always use it as the primary method (works without VAPID/SW/push).
    // eslint-disable-next-line no-new
    new Notification(title, { body, tag, icon: './web-app-manifest-192x192.png', badge: './web-app-manifest-192x192.png' })
  } catch {
    // ignore
  }
}

export function vibrate(pattern: number | number[]) {
  try {
    if (navigator.vibrate) navigator.vibrate(pattern)
  } catch {
    // ignore
  }
}
