<script setup lang="ts">
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useSessionStore } from '../stores/session'
import { useCallStore } from '../stores/call'
import { useUiStore } from '../stores/ui'

const session = useSessionStore()
const call = useCallStore()
const ui = useUiStore()
const { users } = storeToRefs(session)
const { myId } = storeToRefs(session)
const { sidebarOpen } = storeToRefs(ui)

const visibleUsers = computed(() => {
  const mine = myId.value
  return mine ? users.value.filter((u) => u.id !== mine) : users.value
})

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
      <template v-if="visibleUsers.length">
        <li v-for="u in visibleUsers" :key="u.id">
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
      </template>
      <li v-else>
        <div class="muted">No one online right now.</div>
      </li>
    </ul>
  </aside>
</template>
