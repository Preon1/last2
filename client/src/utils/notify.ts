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

    // Notify when the tab is hidden OR when the window/tab is not focused.
    // This matches typical expectations for "background" notifications.
    const hasFocus = typeof document.hasFocus === 'function' ? document.hasFocus() : true
    if (!document.hidden && hasFocus) return

    const tag = opts?.tag ?? 'lrcom'

    const fallback = () => {
      // eslint-disable-next-line no-new
      new Notification(title, { body, tag })
    }

    // Prefer SW-backed notifications when possible (more reliable in some browsers).
    // NOTE: `navigator.serviceWorker.ready` can hang forever if no SW is registered/controlling
    // the page (common when VAPID/push is disabled), so we avoid relying on it.
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .getRegistration()
        .then(async (reg) => {
          const activeReg =
            reg ?? (await navigator.serviceWorker.register('/sw.js', { scope: '/' }).catch(() => undefined))
          if (!activeReg) return fallback()

          return activeReg.showNotification(title, {
            body,
            tag,
            icon: './web-app-manifest-192x192.png',
            badge: './web-app-manifest-192x192.png',
          })
        })
        .catch(fallback)
      return
    }

    fallback()
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
