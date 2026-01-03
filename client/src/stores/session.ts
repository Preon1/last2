import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { useUiStore } from './ui'

export type PresenceUser = {
  id: string
  name: string | null
  busy: boolean
}

export type ChatMsg = {
  type: 'chat'
  id?: string
  atIso: string
  fromName: string
  toName?: string | null
  private: boolean
  text: string
}

export type VoiceInfo = {
  turnHost?: string
  relayPortsTotal?: number | null
  relayPortsUsedEstimate?: number
  maxConferenceUsersEstimate?: number
  capacityCallsEstimate?: number
}

type InboundMsgAny = { type?: unknown; [k: string]: unknown }

function asObj(v: unknown): InboundMsgAny | null {
  if (!v || typeof v !== 'object') return null
  return v as InboundMsgAny
}

function asString(v: unknown): string | null {
  return typeof v === 'string' ? v : null
}

function asBool(v: unknown): boolean | null {
  return typeof v === 'boolean' ? v : null
}

function asNumber(v: unknown): number | null {
  return typeof v === 'number' && Number.isFinite(v) ? v : null
}

function asVoiceInfo(v: unknown): VoiceInfo | null {
  const o = asObj(v)
  if (!o) return null

  const turnHost = asString(o.turnHost)

  const relayPortsTotal = o.relayPortsTotal === null ? null : asNumber(o.relayPortsTotal)
  const relayPortsUsedEstimate = asNumber(o.relayPortsUsedEstimate)
  const maxConferenceUsersEstimate = asNumber(o.maxConferenceUsersEstimate)
  const capacityCallsEstimate = asNumber(o.capacityCallsEstimate)

  return {
    ...(turnHost ? { turnHost } : {}),
    ...(o.relayPortsTotal === null ? { relayPortsTotal: null } : {}),
    ...(relayPortsTotal !== null ? { relayPortsTotal } : {}),
    ...(relayPortsUsedEstimate !== null ? { relayPortsUsedEstimate } : {}),
    ...(maxConferenceUsersEstimate !== null ? { maxConferenceUsersEstimate } : {}),
    ...(capacityCallsEstimate !== null ? { capacityCallsEstimate } : {}),
  }
}

function wsUrl() {
  const proto = location.protocol === 'https:' ? 'wss:' : 'ws:'
  return `${proto}//${location.host}`
}

export const useSessionStore = defineStore('session', () => {
  const ui = useUiStore()
  const ws = ref<WebSocket | null>(null)

  const myId = ref<string | null>(null)
  const myName = ref<string | null>(null)

  const turnConfig = ref<unknown | null>(null)

  const voiceInfo = ref<VoiceInfo | null>(null)

  const status = ref<string>('')
  const users = ref<PresenceUser[]>([])
  const chat = ref<ChatMsg[]>([])

  const techInfo = computed(() => {
    const voice = voiceInfo.value
    if (!voice || (!voice.turnHost && voice.relayPortsTotal == null)) return ''

    const parts: string[] = []
    if (voice.turnHost) parts.push(`TURN ${voice.turnHost}`)

    if (typeof voice.relayPortsUsedEstimate === 'number' && typeof voice.relayPortsTotal === 'number') {
      parts.push(`UDP relay ports ~${voice.relayPortsUsedEstimate}/${voice.relayPortsTotal}`)
    } else if (typeof voice.relayPortsTotal === 'number') {
      parts.push(`UDP relay ports ${voice.relayPortsTotal}`)
    } else if (typeof voice.relayPortsUsedEstimate === 'number') {
      parts.push(`UDP relay ports in use ~${voice.relayPortsUsedEstimate}`)
    }

    if (typeof voice.maxConferenceUsersEstimate === 'number') {
      parts.push(`est conf max ~${voice.maxConferenceUsersEstimate} users`)
    } else if (typeof voice.capacityCallsEstimate === 'number') {
      parts.push(`est 1:1 max ~${voice.capacityCallsEstimate} calls`)
    }

    return parts.join(' • ')
  })

  const inboundHandlers: Array<(type: string, obj: Record<string, unknown>) => void> = []
  const disconnectHandlers: Array<() => void> = []

  const connected = computed(() => ws.value?.readyState === WebSocket.OPEN)
  const inApp = computed(() => Boolean(myName.value))

  function send(obj: unknown) {
    if (!ws.value || ws.value.readyState !== WebSocket.OPEN) return
    ws.value.send(JSON.stringify(obj))
  }

  function registerInboundHandler(handler: (type: string, obj: Record<string, unknown>) => void) {
    inboundHandlers.push(handler)
  }

  function registerDisconnectHandler(handler: () => void) {
    disconnectHandlers.push(handler)
  }

  function disconnect() {
    try {
      ws.value?.close()
    } catch {
      // ignore
    }
    ws.value = null
    myId.value = null
    myName.value = null
    turnConfig.value = null
    users.value = []
    chat.value = []
    status.value = ''

    for (const h of disconnectHandlers) {
      try {
        h()
      } catch {
        // ignore
      }
    }
  }

  function connect(name: string) {
    const desiredName = name.trim()
    if (!desiredName) {
      status.value = 'Enter a name.'
      return
    }

    status.value = 'Connecting…'
    disconnect()

    const sock = new WebSocket(wsUrl())
    ws.value = sock

    sock.addEventListener('open', () => {
      send({ type: 'setName', name: desiredName })
    })

    sock.addEventListener('message', (ev) => {
      let obj: InboundMsgAny | null
      try {
        obj = asObj(JSON.parse(String(ev.data)))
      } catch {
        return
      }

      if (!obj) return

      const type = asString(obj.type)
      if (!type) return

      if (type === 'hello') {
        const id = asString(obj.id)
        if (id) myId.value = id

        if ('turn' in obj) {
          turnConfig.value = obj.turn
        }
        return
      }

      if (type === 'nameResult') {
        const ok = asBool(obj.ok)
        const name = asString(obj.name)
        const reason = asString(obj.reason)
        if (ok && name) {
          myName.value = name
          status.value = ''
        } else {
          status.value = reason === 'taken' ? 'Name is taken.' : 'Invalid name.'
        }
        return
      }

      if (type === 'presence') {
        users.value = Array.isArray(obj.users) ? (obj.users as PresenceUser[]) : []
        voiceInfo.value = asVoiceInfo(obj.voice)
        return
      }

      if (type === 'chat') {
        const atIso = asString(obj.atIso)
        const fromName = asString(obj.fromName)
        const text = asString(obj.text)
        const isPrivate = asBool(obj.private)
        const id = asString(obj.id)

        if (!atIso || !fromName || !text || isPrivate === null) return

        const toNameRaw = obj.toName
        const toName = toNameRaw === null ? null : asString(toNameRaw)

        const msg: ChatMsg = {
          type: 'chat',
          ...(id ? { id } : {}),
          atIso,
          fromName,
          ...(toName !== null && toName !== undefined ? { toName } : {}),
          private: isPrivate,
          text,
        }

        chat.value.push(msg)

        // Unread counters (best-effort): bump only for messages not authored by me
        // and not currently in the active chat.
        try {
          if (myName.value && fromName === myName.value) return

          if (!isPrivate) {
            if (ui.activeChatName !== null) ui.bumpUnread(null)
            return
          }

          // For private messages, map to the "other" participant.
          const other = myName.value && fromName === myName.value
            ? (toName ?? null)
            : fromName

          if (!other) return
          if (ui.activeChatName !== other) ui.bumpUnread(other)
        } catch {
          // ignore
        }
        return
      }

      if (type === 'error') {
        const code = asString(obj.code)
        if (code === 'NO_NAME') status.value = 'Enter a name.'
      }

      for (const h of inboundHandlers) {
        try {
          h(type, obj)
        } catch {
          // ignore
        }
      }
    })

    sock.addEventListener('close', () => {
      if (myName.value) status.value = 'Disconnected.'
      // keep state; user can reconnect
    })

    sock.addEventListener('error', () => {
      status.value = 'Connection error.'
    })
  }

  function sendChat(text: string, toName?: string | null) {
    const t = text.trim()
    if (!t) return
    const target = (toName ?? '').trim()
    send(target ? { type: 'chatSend', text: t, toName: target } : { type: 'chatSend', text: t })
  }

  return {
    ws,
    connected,
    inApp,
    myId,
    myName,
    turnConfig,
    voiceInfo,
    techInfo,
    status,
    users,
    chat,
    connect,
    disconnect,
    sendChat,
    send,
    registerInboundHandler,
    registerDisconnectHandler,
  }
})
