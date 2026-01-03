<script setup lang="ts">
import { watchEffect } from 'vue'
import { storeToRefs } from 'pinia'
import { useUiStore } from '../stores/ui'
import { useSessionStore } from '../stores/session'
import { confirmLeave } from '../utils/confirmLeave'

const ui = useUiStore()
const session = useSessionStore()

const { settingsOpen, themeLabel } = storeToRefs(ui)
const { status, techInfo, myName } = storeToRefs(session)

function onBackdropClick(e: MouseEvent) {
  if (e.target && e.target === e.currentTarget) ui.closeSettings()
}

function onEscape(e: KeyboardEvent) {
  if (e.key === 'Escape') ui.closeSettings()
}

function onAbout() {
  ui.openAbout()
  ui.closeSettings()
}

function onLogout() {
  if (!confirmLeave('Last')) return
  ui.closeSettings()
  session.disconnect()
}

watchEffect((onCleanup) => {
  if (!settingsOpen.value) return
  document.addEventListener('keydown', onEscape)
  onCleanup(() => document.removeEventListener('keydown', onEscape))
})
</script>

<template>
  <div
    v-if="settingsOpen"
    class="modal"
    role="dialog"
    aria-modal="true"
    aria-labelledby="settingsTitle"
    @click="onBackdropClick"
  >
    <div class="modal-card">
      <div class="modal-title" id="settingsTitle">Settings</div>

      <div class="settings-tech">
        <div v-if="myName" class="status">You: <strong>{{ myName }}</strong></div>
        <div v-if="status" class="status">{{ status }}</div>
        <div v-if="techInfo" class="muted">{{ techInfo }}</div>
      </div>

      <div class="settings-actions">
        <button class="secondary" type="button" aria-label="Toggle theme" @click="ui.cycleTheme">
          {{ themeLabel }}
        </button>

        <button class="secondary" type="button" @click="onAbout">About</button>

        <button class="secondary icon-only" type="button" aria-label="Logout" title="Logout" @click="onLogout">
          <svg class="icon" aria-hidden="true" focusable="false"><use xlink:href="/icons.svg#logout"></use></svg>
        </button>
      </div>

      <div class="modal-actions">
        <div></div>
        <button class="secondary" type="button" @click="ui.closeSettings">Close</button>
      </div>
    </div>
  </div>
</template>
