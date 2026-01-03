<script setup lang="ts">
import { computed, ref, watchEffect } from 'vue'
import { storeToRefs } from 'pinia'
import { useSessionStore } from '../stores/session'
import { useUiStore } from '../stores/ui'
import { useCallStore } from '../stores/call'
import CallPanel from './CallPanel.vue'

const session = useSessionStore()
const ui = useUiStore()
const call = useCallStore()

const { chat, users } = storeToRefs(session)
const { replyToId, activeChatName, activeChatLabel } = storeToRefs(ui)
const { inCall, outgoingPending, pendingIncomingFrom, joinPending, joinConfirmToId, joinConfirmToName } = storeToRefs(call)

const showCallPanel = computed(() => Boolean(pendingIncomingFrom.value) || outgoingPending.value || inCall.value || joinPending.value)

const activePeer = computed(() => {
  const name = activeChatName.value
  if (!name) return null
  return users.value.find((u) => u.name === name) ?? null
})

const canCallActivePeer = computed(() => {
  const peer = activePeer.value
  if (!peer) return false
  if (!peer.id || !peer.name) return false
  // Don't allow starting a new call while any call state is active.
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

const chatInput = ref('')
const chatMessagesEl = ref<HTMLElement | null>(null)
const chatInputEl = ref<HTMLTextAreaElement | null>(null)

const filteredChat = computed(() => {
  const peer = activeChatName.value
  // Group chat view
  if (!peer) return chat.value.filter((m) => !m.private)

  // Private chat view with selected user
  return chat.value.filter((m) => m.private && (m.fromName === peer || m.toName === peer))
})

function parseReply(text: string): { replyTo: string | null; body: string } {
  if (!text.startsWith('@reply ')) return { replyTo: null, body: text }
  const nl = text.indexOf('\n')
  if (nl <= 7) return { replyTo: null, body: text }
  const id = text.slice(7, nl).trim()
  if (!id) return { replyTo: null, body: text }
  return { replyTo: id, body: text.slice(nl + 1) }
}

const byId = computed(() => {
  const map = new Map<string, { fromName: string; text: string }>()
  for (const m of chat.value) {
    if (m.id) map.set(m.id, { fromName: m.fromName, text: m.text })
  }
  return map
})

const renderedChat = computed(() => {
  return filteredChat.value.map((m) => {
    const parsed = parseReply(m.text)
    return {
      ...m,
      displayText: parsed.body,
      replyTo: parsed.replyTo,
    }
  })
})

const replyBanner = computed(() => {
  if (!replyToId.value) return null
  const found = byId.value.get(replyToId.value)
  if (!found) return { title: 'Replying', subtitle: '' }
  const body = parseReply(found.text).body
  const snip = body.length > 80 ? `${body.slice(0, 80)}…` : body
  return { title: `Replying to ${found.fromName}`, subtitle: snip }
})

function onSend() {
  const body = chatInput.value.trim()
  if (!body) return
  const text = replyToId.value ? `@reply ${replyToId.value}\n${body}` : body
  session.sendChat(text, activeChatName.value)
  chatInput.value = ''
  if (replyToId.value) ui.clearReply()

  queueMicrotask(() => autoGrowChatInput())
}

function isMobileTextEntry() {
  return (navigator.maxTouchPoints ?? 0) > 0 || (window.matchMedia && window.matchMedia('(pointer: coarse)').matches)
}

function autoGrowChatInput() {
  const el = chatInputEl.value
  if (!el) return

  el.style.height = 'auto'

  const cs = window.getComputedStyle(el)
  const lineHeight = Number.parseFloat(cs.lineHeight) || 20
  const paddingTop = Number.parseFloat(cs.paddingTop) || 0
  const paddingBottom = Number.parseFloat(cs.paddingBottom) || 0
  const borderTop = Number.parseFloat(cs.borderTopWidth) || 0
  const borderBottom = Number.parseFloat(cs.borderBottomWidth) || 0

  const maxHeight = lineHeight * 8 + paddingTop + paddingBottom + borderTop + borderBottom
  const target = Math.min(el.scrollHeight, maxHeight)
  el.style.height = `${target}px`
  el.style.overflowY = el.scrollHeight > maxHeight ? 'auto' : 'hidden'
}

function onChatKeydown(e: KeyboardEvent) {
  if (e.key !== 'Enter') return

  // Mobile: Enter inserts newline; send is only via the Send button.
  if (isMobileTextEntry()) return

  // Desktop: Shift+Enter inserts newline.
  if (e.shiftKey) return

  e.preventDefault()
  onSend()
}

watchEffect(() => {
  void filteredChat.value.length
  queueMicrotask(() => {
    if (chatMessagesEl.value) {
      chatMessagesEl.value.scrollTop = chatMessagesEl.value.scrollHeight
    }
  })
})

function cssEscape(s: string) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const css = (window as any).CSS
  return css && typeof css.escape === 'function' ? css.escape(s) : s.replace(/"/g, '\\"')
}

function scrollToMessage(id: string) {
  const root = chatMessagesEl.value
  if (!root) return
  const sel = `[data-msg-id="${cssEscape(id)}"]`
  const el = root.querySelector(sel) as HTMLElement | null
  if (!el) return
  el.scrollIntoView({ behavior: 'smooth', block: 'center' })
  el.classList.add('flash')
  window.setTimeout(() => el.classList.remove('flash'), 900)
}

function onClickReplyTarget(id: string) {
  ui.setReplyTo(id)
  queueMicrotask(() => chatInputEl.value?.focus())
}

</script>

<template>
  <section class="chat">
    <CallPanel v-if="showCallPanel" />

    <div class="chat-header">
      <div class="chat-header-title">{{ activeChatLabel }}</div>
      <button
        v-if="activeChatName"
        class="secondary icon-only"
        type="button"
        aria-label="Call"
        :disabled="!canCallActivePeer"
        @click="onCallActivePeer"
      >
        <svg class="icon" aria-hidden="true" focusable="false"><use xlink:href="/icons.svg#call"></use></svg>
      </button>
    </div>

    <div
      v-if="joinConfirmToId"
      class="modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="joinConfirmTitle"
      @click="(e) => { if (e.target === e.currentTarget) call.cancelJoinConfirm() }"
    >
      <div class="modal-card">
        <div class="modal-title" id="joinConfirmTitle">Join ongoing call?</div>
        <div class="muted" style="margin-bottom: 12px;">
          {{ joinConfirmToName ? `You are attempting to join ${joinConfirmToName}'s ongoing call.` : 'You are attempting to join an ongoing call.' }}
        </div>
        <div class="modal-actions">
          <button class="secondary" type="button" @click="call.cancelJoinConfirm">Cancel</button>
          <button type="button" @click="call.confirmJoinAttempt">Proceed</button>
        </div>
      </div>
    </div>

    <div ref="chatMessagesEl" class="chat-messages" aria-live="polite">
      <div
        v-for="(m, i) in renderedChat"
        :key="m.id ?? i"
        class="chat-line"
        :data-msg-id="m.id || undefined"
      >
        <div class="chat-meta">
          <span>{{ m.fromName }}</span>
          <button v-if="m.id" class="reply-btn" type="button" @click="onClickReplyTarget(m.id)">Reply</button>
        </div>
        <button
          v-if="m.replyTo"
          class="reply-ref"
          type="button"
          @click="scrollToMessage(m.replyTo)"
        >
          <template v-if="byId.get(m.replyTo)">
            Reply to {{ byId.get(m.replyTo)!.fromName }}
          </template>
          <template v-else>
            Reply
          </template>
        </button>
        <div class="chat-text">{{ m.displayText }}</div>
      </div>
    </div>

    <div v-if="replyBanner" class="reply-banner">
      <div class="reply-banner-text">
        <div class="reply-banner-title">{{ replyBanner.title }}</div>
        <div v-if="replyBanner.subtitle" class="reply-banner-subtitle">{{ replyBanner.subtitle }}</div>
      </div>
      <button class="secondary reply-cancel" type="button" @click="ui.clearReply">Cancel</button>
    </div>

    <div class="chat-input">
      <textarea
        ref="chatInputEl"
        v-model="chatInput"
        rows="1"
        maxlength="500"
        autocomplete="off"
        placeholder="Type a message..."
        @keydown="onChatKeydown"
        @input="autoGrowChatInput"
        @focus="autoGrowChatInput"
      ></textarea>
      <button class="icon-only" type="button" aria-label="Send" @click="onSend">
        <svg class="icon" aria-hidden="true" focusable="false"><use xlink:href="/icons.svg#send"></use></svg>
      </button>
    </div>

  </section>
</template>
