import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { useSessionStore } from './session'
import { tryEnableWebPushForSocket } from '../utils/push'

export const useNotificationsStore = defineStore('notifications', () => {
  const session = useSessionStore()

  const supported = computed(() => typeof Notification !== 'undefined')
  const permission = ref<NotificationPermission>(typeof Notification === 'undefined' ? 'default' : Notification.permission)

  const buttonLabel = computed(() => {
    if (!supported.value) return 'Notifications unavailable'
    if (permission.value === 'granted') return 'Notifications on'
    if (permission.value === 'denied') return 'Notifications blocked'
    return 'Enable notifications'
  })

  const buttonDisabled = computed(() => !supported.value || permission.value === 'denied' || session.ws == null)

  async function requestPermissionAndEnable() {
    if (!supported.value) return
    const perm = await Notification.requestPermission()
    permission.value = perm
    if (perm !== 'granted') return

    // Optional/best-effort.
    await tryEnableWebPushForSocket(session.send)
  }

  // Keep permission in sync if browser changes it.
  function refresh() {
    if (!supported.value) return
    permission.value = Notification.permission
  }

  return {
    supported,
    permission,
    buttonLabel,
    buttonDisabled,
    requestPermissionAndEnable,
    refresh,
  }
})
