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

    // Prefer SW-backed notifications when possible (more reliable in some browsers).
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready
        .then((reg) =>
          reg.showNotification(title, {
            body,
            tag,
          }),
        )
        .catch(() => {
          // eslint-disable-next-line no-new
          new Notification(title, { body, tag })
        })
      return
    }

    // eslint-disable-next-line no-new
    new Notification(title, { body, tag })
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
