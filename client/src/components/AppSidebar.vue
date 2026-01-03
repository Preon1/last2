<script setup lang="ts">
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useSessionStore } from '../stores/session'
import { useUiStore } from '../stores/ui'

const session = useSessionStore()
const ui = useUiStore()
const { users } = storeToRefs(session)
const { myId } = storeToRefs(session)
const { sidebarOpen } = storeToRefs(ui)
const { activeChatName } = storeToRefs(ui)

const visibleUsers = computed(() => {
  const mine = myId.value
  return (mine ? users.value.filter((u) => u.id !== mine) : users.value).filter((u) => Boolean(u.name))
})

function onOpenGroup() {
  ui.openChat(null)
  ui.closeSidebar()
}

function onOpenUser(name: string) {
  ui.openChat(name)
  ui.closeSidebar()
}

function isActive(name: string | null) {
  return (activeChatName.value ?? null) === name
}
</script>

<template>
  <aside class="sidebar" :class="{ open: sidebarOpen }">
    <div class="sidebar-title">Online</div>
    <ul class="users">
      <li>
        <button class="user-row" type="button" :class="{ active: isActive(null) }" @click="onOpenGroup">
          <span class="name">Group chat</span>
          <span v-if="ui.getUnread(null)" class="unread-badge" aria-label="Unread messages">{{ ui.getUnread(null) }}</span>
        </button>
      </li>

      <template v-if="visibleUsers.length">
        <li v-for="u in visibleUsers" :key="u.id">
          <button class="user-row" type="button" :class="{ active: isActive(u.name!) }" @click="onOpenUser(u.name!)">
            <span class="name">{{ u.name }}</span>
            <span class="user-row-right">
              <span class="meta">{{ u.busy ? 'busy' : '' }}</span>
              <span v-if="ui.getUnread(u.name!)" class="unread-badge" aria-label="Unread messages">{{ ui.getUnread(u.name!) }}</span>
            </span>
          </button>
        </li>
      </template>
      <li v-else>
        <div class="muted">No one online right now.</div>
      </li>
    </ul>
  </aside>
</template>
