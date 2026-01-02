<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useSessionStore } from '../stores/session'
import { useUiStore } from '../stores/ui'
import { useNotificationsStore } from '../stores/notifications'
import { confirmLeave } from '../utils/confirmLeave'

const session = useSessionStore()
const ui = useUiStore()
const notifications = useNotificationsStore()

const { myName } = storeToRefs(session)
const { themeLabel } = storeToRefs(ui)
const { buttonLabel, buttonDisabled } = storeToRefs(notifications)

function onLogout() {
  if (!confirmLeave('Last')) return
  session.disconnect()
}
</script>

<template>
  <header class="header">
    <div class="header-left">
      <button class="secondary icon-only mobile-only" type="button" aria-label="Users" @click="ui.toggleSidebar">
        <svg class="icon" aria-hidden="true" focusable="false"><use xlink:href="/icons.svg#users"></use></svg>
      </button>
      <div class="brand"><img class="logo" src="/lrcom_logo.png" alt="" /><span>Last</span></div>
    </div>

    <div class="header-center"></div>

    <div class="header-right">
      <button class="secondary icon-only" type="button" aria-label="Filters" @click="ui.openFilters">
        <svg class="icon" aria-hidden="true" focusable="false"><use xlink:href="/icons.svg#filter"></use></svg>
      </button>

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
  </header>
</template>
