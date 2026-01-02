<script setup lang="ts">
import AppHeader from './AppHeader.vue'
import AppSidebar from './AppSidebar.vue'
import ChatPanel from './ChatPanel.vue'
import { storeToRefs } from 'pinia'
import { useUiStore } from '../stores/ui'

const ui = useUiStore()
const { sidebarOpen } = storeToRefs(ui)
</script>

<template>
  <section class="app">
    <AppHeader />
    <div class="content">
      <div v-if="sidebarOpen" class="overlay" @click="ui.closeSidebar" />
      <AppSidebar />
      <ChatPanel />
    </div>
  </section>
</template>
