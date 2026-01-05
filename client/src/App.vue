<script setup lang="ts">
import { watchEffect } from 'vue'
import { storeToRefs } from 'pinia'
import { useSessionStore } from './stores/session'
import { useNotificationsStore } from './stores/notifications'
import SetupScreen from './components/SetupScreen.vue'
import AppShell from './components/AppShell.vue'
import AboutModal from './components/AboutModal.vue'
import { useWakeLock } from './utils/wakeLock'
import { useBeforeUnloadConfirm } from './utils/beforeUnloadConfirm'

const session = useSessionStore()
const notifications = useNotificationsStore()
const { inApp, status } = storeToRefs(session)

useWakeLock(inApp)
useBeforeUnloadConfirm(inApp)

watchEffect(() => {
  if (!inApp.value) return
  if (!session.connected) return
  notifications.autoRequestAfterLogin()
})
</script>

<template>
  <main>
    <SetupScreen v-if="!inApp" :status="status" @join="session.connect" />
    <AppShell v-else />

    <AboutModal />
  </main>
</template>
