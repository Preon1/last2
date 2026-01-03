<script setup lang="ts">
import { useUiStore } from '../stores/ui'

const ui = useUiStore()
</script>

<template>
  <header class="header">
    <div class="header-left">
      <div class="brand"><img class="logo" src="/lrcom_logo.png" alt="" /><span>Last</span></div>
    </div>

    <div class="header-right">
        <button class="secondary icon-only" type="button" aria-label="Settings" @click="ui.openSettings">
            <svg class="icon" aria-hidden="true" focusable="false"><use xlink:href="/icons.svg#filter"></use></svg>
        </button>
        <button class="secondary icon-only mobile-only" type="button" aria-label="Users" @click="ui.toggleSidebar">
        <svg class="icon" aria-hidden="true" focusable="false"><use xlink:href="/icons.svg#users"></use></svg>
        </button>
    </div>
  </header>
</template>
