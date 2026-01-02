<script setup lang="ts">
import { watchEffect } from 'vue'
import { storeToRefs } from 'pinia'
import { useUiStore } from '../stores/ui'

const ui = useUiStore()
const { aboutOpen } = storeToRefs(ui)

function onBackdropClick(e: MouseEvent) {
  if (e.target && e.target === e.currentTarget) ui.closeAbout()
}

function onEscape(e: KeyboardEvent) {
  if (e.key === 'Escape') ui.closeAbout()
}

watchEffect((onCleanup) => {
  if (!aboutOpen.value) return
  document.addEventListener('keydown', onEscape)
  onCleanup(() => document.removeEventListener('keydown', onEscape))
})
</script>

<template>
  <div v-if="aboutOpen" class="modal" role="dialog" aria-modal="true" aria-labelledby="aboutTitle" @click="onBackdropClick">
    <div class="modal-card">
      <div class="modal-title" id="aboutTitle">About</div>
      <div class="muted">
        Last is an ephemeral, registration-less, audio-only WebRTC communicator. No accounts, no cookies, no saved sessions.
      </div>
      <div class="modal-actions">
        <a href="https://github.com/Preon1/last" target="_blank" rel="noopener noreferrer">Git repository</a>
        <button class="secondary" type="button" @click="ui.closeAbout">Close</button>
      </div>
    </div>
  </div>
</template>
