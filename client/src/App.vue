<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useSessionStore } from './stores/session'
import SetupScreen from './components/SetupScreen.vue'
import AppShell from './components/AppShell.vue'
import AboutModal from './components/AboutModal.vue'
import { useWakeLock } from './utils/wakeLock'
import { useBeforeUnloadConfirm } from './utils/beforeUnloadConfirm'

const session = useSessionStore()
const { inApp, status } = storeToRefs(session)

useWakeLock(inApp)
useBeforeUnloadConfirm(inApp)
</script>

<template>
  <main>
    <SetupScreen v-if="!inApp" :status="status" @join="session.connect" />
    <AppShell v-else />

    <AboutModal />
  </main>
</template>
