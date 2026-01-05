<script setup lang="ts">
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useSessionStore } from '../stores/session'
import { useUiStore } from '../stores/ui'
import { useCallStore } from '../stores/call'
import { useI18n } from 'vue-i18n'

const session = useSessionStore()
const ui = useUiStore()
const call = useCallStore()

const { t } = useI18n()

const { users } = storeToRefs(session)
const { activeChatName, activeChatLabel } = storeToRefs(ui)
const { inCall, outgoingPending, pendingIncomingFrom, joinPending, joinConfirmToId, joinConfirmToName } = storeToRefs(call)

const isGroup = computed(() => !activeChatName.value)

const activePeer = computed(() => {
  const name = activeChatName.value
  if (!name) return null
  return users.value.find((u) => u.name === name) ?? null
})

const peerOnline = computed(() => {
  if (isGroup.value) return null
  return Boolean(activePeer.value)
})

const canCallActivePeer = computed(() => {
  const peer = activePeer.value
  if (!peer) return false
  if (!peer.id || !peer.name) return false
  if (pendingIncomingFrom.value) return false
  if (outgoingPending.value) return false
  if (inCall.value) return false
  if (joinPending.value) return false
  return true
})

function onCallActivePeer() {
  const peer = activePeer.value
  if (!peer || !peer.id || !peer.name) return
  if (peer.busy) {
    call.openJoinConfirm(peer.id, peer.name)
    return
  }
  void call.startCall(peer.id, peer.name)
}

const showCallButton = computed(() => !isGroup.value)
</script>

<template>
  <div class="chat-topbar" role="region" :aria-label="String(t('common.chat'))">
    <div class="chat-topbar-left">
      <div class="chat-topbar-title">{{ activeChatLabel }}</div>
      <span
        v-if="peerOnline !== null"
        class="status-dot"
        :class="{ online: peerOnline, offline: peerOnline === false }"
        aria-hidden="true"
      />
    </div>

    <button
      v-if="showCallButton"
      class="secondary icon-only"
      type="button"
      :aria-label="String(t('chat.callAria'))"
      :disabled="!canCallActivePeer"
      @click="onCallActivePeer"
    >
      <svg class="icon" aria-hidden="true" focusable="false"><use xlink:href="/icons.svg#call"></use></svg>
    </button>

    <!-- Keep join confirm modal within chat context (call UX) -->
    <div
      v-if="joinConfirmToId"
      class="modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="joinConfirmTitle"
      @click="(e) => { if (e.target === e.currentTarget) call.cancelJoinConfirm() }"
    >
      <div class="modal-card">
        <div class="modal-title" id="joinConfirmTitle">{{ t('chat.joinOngoingTitle') }}</div>
        <div class="muted" style="margin-bottom: 12px;">
          {{ joinConfirmToName ? t('chat.joinOngoingBodyNamed', { name: joinConfirmToName }) : t('chat.joinOngoingBody') }}
        </div>
        <div class="modal-actions">
          <button class="secondary" type="button" @click="call.cancelJoinConfirm">{{ t('common.cancel') }}</button>
          <button type="button" @click="call.confirmJoinAttempt">{{ t('common.proceed') }}</button>
        </div>
      </div>
    </div>
  </div>
</template>
