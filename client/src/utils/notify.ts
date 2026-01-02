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
    // Mirror legacy behavior: only notify when not visible.
    if (!document.hidden) return

    // eslint-disable-next-line no-new
    new Notification(title, {
      body,
      tag: opts?.tag ?? 'lrcom',
    })
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
