<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useUiStore } from '../stores/ui'
import { useSessionStore } from '../stores/session'
import { confirmLeave } from '../utils/confirmLeave'
import { useI18n } from 'vue-i18n'
import { cycleLocale } from '../i18n'

const ui = useUiStore()
const session = useSessionStore()

const { t, locale } = useI18n()

const { themeLabel } = storeToRefs(ui)
const { status, techInfo, myName } = storeToRefs(session)

function onCycleLanguage() {
  cycleLocale()
}

function onAbout() {
  ui.openAbout()
}

function onLogout() {
  if (!confirmLeave('Last')) return
  session.disconnect()
}
</script>

<template>
  <section class="page">
    <div class="page-inner">

    <div class="headergap"></div>

      <div class="settings-tech">
        <div v-if="myName" class="status">{{ t('settings.youLabel') }} <strong>{{ myName }}</strong></div>
        <div v-if="status" class="status">{{ status }}</div>
        <div v-if="techInfo" class="muted">{{ techInfo }}</div>
      </div>

      <div class="settings-actions">
        <button class="secondary" type="button" :aria-label="String(t('theme.toggleAria'))" @click="ui.cycleTheme">
          {{ themeLabel }}
        </button>

        <button class="secondary" type="button" :aria-label="String(t('common.language'))" @click="onCycleLanguage">
          {{ t('common.language') }}: {{ t(`lang.${String(locale)}`) }}
        </button>

        <button class="secondary" type="button" @click="onAbout">{{ t('common.about') }}</button>

        <button
          class="secondary icon-only"
          type="button"
          :aria-label="String(t('common.logout'))"
          :title="String(t('common.logout'))"
          @click="onLogout"
        >
          <svg class="icon" aria-hidden="true" focusable="false"><use xlink:href="/icons.svg#logout"></use></svg>
        </button>
      </div>
    </div>
  </section>
</template>
