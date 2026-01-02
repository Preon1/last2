export function confirmLeave(appName = 'Last') {
  try {
    return window.confirm(`Logout and leave ${appName}?`)
  } catch {
    return true
  }
}
