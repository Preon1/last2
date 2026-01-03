import { defineStore } from 'pinia'
import { computed, ref, watch } from 'vue'

export const useUiStore = defineStore('ui', () => {
  const settingsOpen = ref(false)

  const aboutOpen = ref(false)

  const sidebarOpen = ref(false)

  const themeMode = ref<'system' | 'dark' | 'light'>('system')

  const replyToId = ref<string | null>(null)

  const showPrivate = ref(true)
  const showPublic = ref(true)
  const showSystem = ref(true)

  const enabledKinds = computed(() => {
    const kinds = new Set<string>()
    if (showPublic.value) kinds.add('public')
    if (showPrivate.value) kinds.add('private')
    if (showSystem.value) kinds.add('system')
    return kinds
  })

  const themeLabel = computed(() => {
    const mode = themeMode.value
    const label = mode === 'system' ? 'System' : mode === 'dark' ? 'Dark' : 'Light'
    return `Theme: ${label}`
  })

  function applyTheme() {
    try {
      if (themeMode.value === 'system') {
        document.documentElement.removeAttribute('data-theme')
      } else {
        document.documentElement.setAttribute('data-theme', themeMode.value)
      }
    } catch {
      // ignore
    }
  }

  function loadTheme() {
    try {
      const raw = localStorage.getItem('lrcom-theme')
      if (raw === 'dark' || raw === 'light' || raw === 'system') {
        themeMode.value = raw
      }
    } catch {
      // ignore
    }
    applyTheme()
  }

  function cycleTheme() {
    themeMode.value = themeMode.value === 'system' ? 'dark' : themeMode.value === 'dark' ? 'light' : 'system'
  }

  function openSettings() {
    settingsOpen.value = true
  }

  function closeSettings() {
    settingsOpen.value = false
  }

  function toggleSettings() {
    settingsOpen.value = !settingsOpen.value
  }

  function openAbout() {
    aboutOpen.value = true
  }

  function closeAbout() {
    aboutOpen.value = false
  }

  function openSidebar() {
    sidebarOpen.value = true
  }

  function closeSidebar() {
    sidebarOpen.value = false
  }

  function toggleSidebar() {
    sidebarOpen.value = !sidebarOpen.value
  }

  function setReplyTo(id: string) {
    replyToId.value = id
  }

  function clearReply() {
    replyToId.value = null
  }

  // Initialize + persist theme.
  loadTheme()
  watch(
    themeMode,
    (v) => {
      try {
        localStorage.setItem('lrcom-theme', v)
      } catch {
        // ignore
      }
      applyTheme()
    },
    { flush: 'post' },
  )

  return {
    settingsOpen,
    aboutOpen,
    sidebarOpen,
    themeMode,
    themeLabel,
    cycleTheme,
    replyToId,
    showPrivate,
    showPublic,
    showSystem,
    enabledKinds,
    openSettings,
    closeSettings,
    toggleSettings,
    openAbout,
    closeAbout,
    openSidebar,
    closeSidebar,
    toggleSidebar,
    setReplyTo,
    clearReply,
  }
})
