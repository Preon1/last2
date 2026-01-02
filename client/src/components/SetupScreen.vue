<script setup lang="ts">
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useUiStore } from '../stores/ui'

defineProps<{ status: string }>()

const emit = defineEmits<{ (e: 'join', name: string): void }>()

const ui = useUiStore()
const { themeLabel } = storeToRefs(ui)

const nameInput = ref('')

function onJoin() {
  emit('join', nameInput.value)
}
</script>

<template>
  <section class="setup">
    <div class="setup-card">
      <div class="setup-header">
        <div class="setup-brand">
          <img class="logo logo-lg" src="/lrcom_logo.png" alt="Last" />
          <div>
            <div class="setup-title">Last</div>
            <div class="setup-subtitle muted">No accounts, no cookies, no saved sessions.</div>
          </div>
        </div>

        <div class="setup-header-actions">
          <button class="secondary" type="button" aria-label="Toggle theme" @click="ui.cycleTheme">
            {{ themeLabel }}
          </button>
          <button class="secondary" type="button" aria-label="About" @click="ui.openAbout">About</button>
        </div>
      </div>

      <form class="setup-form" autocomplete="off" @submit.prevent="onJoin">
        <label class="field" for="name">
          <span class="field-label">Your name</span>
          <input id="name" v-model="nameInput" maxlength="32" inputmode="text" placeholder="e.g. Alex" />
        </label>

        <button class="join" type="submit">Join</button>

        <div class="status" aria-live="polite">{{ status }}</div>
        <div class="hint">Press Enter to join. Microphone permission will be requested after you join.</div>
      </form>
    </div>
  </section>
</template>
