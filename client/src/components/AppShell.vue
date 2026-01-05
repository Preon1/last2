<script setup lang="ts">
import AppHeader from './AppHeader.vue'
import ChatPanel from './ChatPanel.vue'
import { useUiStore } from '../stores/ui'
import { storeToRefs } from 'pinia'
import ContactsPage from './ContactsPage.vue'
import SettingsPage from './SettingsPage.vue'
import { useI18n } from 'vue-i18n'
import ChatTopBar from './ChatTopBar.vue'
import SettingsTopBar from './SettingsTopBar.vue'

const ui = useUiStore()
const { view } = storeToRefs(ui)
const { t } = useI18n()
</script>

<template>
  <section class="app" :class="{ 'no-header': view !== 'contacts' }">
    <AppHeader v-if="view === 'contacts'" />

    <button
      v-if="view !== 'contacts'"
      class="nav-back secondary icon-only"
      type="button"
      :aria-label="String(t('common.back'))"
      @click="ui.goHome"
    >
      <svg class="icon" aria-hidden="true" focusable="false"><use xlink:href="/icons.svg#bracket-left"></use></svg>
    </button>

    <ChatTopBar v-if="view === 'chat'" />
    <SettingsTopBar v-else-if="view === 'settings'" />
    <div v-if="view === 'chat'" class="chat-top-fade" aria-hidden="true"></div>

    <div class="content">
      <ContactsPage v-if="view === 'contacts'" />
      <ChatPanel v-else-if="view === 'chat'" />
      <SettingsPage v-else />
    </div>
  </section>
</template>
