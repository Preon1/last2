<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useSessionStore } from '../stores/session'
import { useCallStore } from '../stores/call'
import { useUiStore } from '../stores/ui'
import { useNotificationsStore } from '../stores/notifications'
import { confirmLeave } from '../utils/confirmLeave'

const session = useSessionStore()
const call = useCallStore()
const ui = useUiStore()
const notifications = useNotificationsStore()

const { users, status, techInfo, myName } = storeToRefs(session)
const { myId } = storeToRefs(session)
const { sidebarOpen } = storeToRefs(ui)
const { themeLabel } = storeToRefs(ui)
const { buttonLabel, buttonDisabled } = storeToRefs(notifications)

function onLogout() {
  if (!confirmLeave('Last')) return
  session.disconnect()
  ui.closeSidebar()
}

function canCall(id: string, name: string | null, busy: boolean) {
  if (!id) return false
  if (!name) return false
  if (busy) return false
  if (myId.value && id === myId.value) return false
  return true
}
</script>

<template>
  <aside class="sidebar" :class="{ open: sidebarOpen }">
    <div class="sidebar-title">Online</div>
    <ul class="users">
      <li v-for="u in users" :key="u.id">
        <div class="name">{{ u.name || '…' }}</div>
        <div class="user-actions">
          <div class="meta">{{ u.busy ? 'busy' : '' }}</div>
          <button
            class="secondary icon-only"
            type="button"
            aria-label="Call"
            :disabled="!canCall(u.id, u.name, u.busy)"
            @click="call.startCall(u.id, u.name || ''); ui.closeSidebar()"
          >
            <svg class="icon" aria-hidden="true" focusable="false"><use xlink:href="/icons.svg#call"></use></svg>
          </button>
        </div>
      </li>
    </ul>

    <div class="sidebar-controls">
      <div class="account-controls">
        <div class="who">
          <span class="muted">You:</span>
          <span class="who-name">{{ myName }}</span>
        </div>

        <button class="secondary" type="button" :disabled="buttonDisabled" @click="notifications.requestPermissionAndEnable">
          {{ buttonLabel }}
        </button>

        <button class="secondary" type="button" aria-label="Toggle theme" @click="ui.cycleTheme">
          {{ themeLabel }}
        </button>

        <button class="secondary icon-only" type="button" aria-label="Logout" @click="onLogout">
          <svg class="icon" aria-hidden="true" focusable="false"><use xlink:href="/icons.svg#logout"></use></svg>
        </button>
      </div>
    </div>

    <div class="sidebar-footer">
      <div class="status">{{ status }}</div>
      <div class="muted">{{ techInfo }}</div>
      <button class="text-link text-link-muted" type="button" @click="ui.openAbout(); ui.closeSidebar()">About</button>
    </div>
  </aside>
</template>
