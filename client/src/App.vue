<script setup lang="ts">
import { computed, ref, watch, watchEffect } from 'vue'
import { storeToRefs } from 'pinia'
import { useSessionStore } from './stores/session'
import { useNotificationsStore } from './stores/notifications'
import { useUiStore } from './stores/ui'
import { useCallStore } from './stores/call'
import SetupScreen from './components/SetupScreen.vue'
import AppShell from './components/AppShell.vue'
import AboutModal from './components/AboutModal.vue'
import ToastHost from './components/ToastHost.vue'
import NotificationsPrompt from './components/NotificationsPrompt.vue'
import { useWakeLock } from './utils/wakeLock'
import { useBeforeUnloadConfirm } from './utils/beforeUnloadConfirm'

const session = useSessionStore()
const notifications = useNotificationsStore()
const ui = useUiStore()
const call = useCallStore()
const { inApp, status } = storeToRefs(session)

const didShowNotificationsPromptThisLogin = ref(false)

const { permission, supported } = storeToRefs(notifications)
const showNotificationsPrompt = computed(() => {
  if (!inApp.value) return false
  if (!session.connected) return false
  if (!supported.value) return false
  if (permission.value !== 'default') return false
  return !didShowNotificationsPromptThisLogin.value
})

function dismissNotificationsPrompt() {
  didShowNotificationsPromptThisLogin.value = true
}

function onJoin(name: string) {
  // Important for iOS/Safari: unlock audio on user gesture.
  call.primeAudio()
  session.connect(name)
}

useWakeLock(inApp)
useBeforeUnloadConfirm(inApp)

watchEffect(() => {
  if (!inApp.value) return
  if (!session.connected) return
  notifications.autoRequestAfterLogin()
})

watch(
  inApp,
  (next, prev) => {
    if (next && !prev) ui.goHome()
    if (next && !prev) didShowNotificationsPromptThisLogin.value = false
  },
  { flush: 'post' },
)
</script>

<template>
  <main>
    <SetupScreen v-if="!inApp" :status="status" @join="onJoin" />
    <AppShell v-else />

    <NotificationsPrompt :open="showNotificationsPrompt" @dismiss="dismissNotificationsPrompt" />

    <ToastHost />

    <AboutModal />
  </main>
</template>
