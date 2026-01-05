import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { useSessionStore } from './session'
import { notify, vibrate } from '../utils/notify'
import { i18n } from '../i18n'

type TurnConfig = {
  iceServers?: Array<{ urls: string | string[]; username?: string; credential?: string }>
}

function asString(v: unknown): string | null {
  return typeof v === 'string' ? v : null
}

function asBool(v: unknown): boolean | null {
  return typeof v === 'boolean' ? v : null
}

function asObj(v: unknown): Record<string, unknown> | null {
  if (!v || typeof v !== 'object') return null
  return v as Record<string, unknown>
}

function formatDuration(ms: number) {
  const total = Math.max(0, Math.floor(ms / 1000))
  const m = Math.floor(total / 60)
  const s = total % 60
  const mm = String(m).padStart(2, '0')
  const ss = String(s).padStart(2, '0')
  return `${mm}:${ss}`
}

function micErrorToStatus(err: unknown) {
  const name = (asObj(err)?.name as string | undefined) ?? ''
  if (name === 'NotAllowedError' || name === 'SecurityError') return String(i18n.global.t('call.micPermissionDenied'))
  if (name === 'NotFoundError') return String(i18n.global.t('call.micNotFound'))
  if (name === 'NotReadableError') return String(i18n.global.t('call.micInUse'))
  return String(i18n.global.t('call.micError'))
}

export const useCallStore = defineStore('call', () => {
  const session = useSessionStore()

  const roomId = ref<string | null>(null)
  const status = ref<string>('')

  const pendingIncomingFrom = ref<string | null>(null)
  const pendingIncomingFromName = ref<string>('')
  const pendingIncomingRoomId = ref<string | null>(null)

  const outgoingPending = ref(false)
  const outgoingPendingName = ref('')

  // Join ongoing call flow
  const joinConfirmToId = ref<string | null>(null)
  const joinConfirmToName = ref<string>('')

  const joinPending = ref(false)
  const joinPendingToName = ref('')
  const joinPendingRoomId = ref<string | null>(null)

  // Server sends one join request at a time (queue is server-side).
  const joinRequestFromId = ref<string | null>(null)
  const joinRequestFromName = ref<string>('')
  const joinRequestRoomId = ref<string | null>(null)

  const timerStartMs = ref<number | null>(null)
  const timerText = ref('00:00')

  const remoteStreams = ref<Record<string, MediaStream>>({})

  const peerNames = new Map<string, string>()
  const pcs = new Map<string, RTCPeerConnection>()

  let localStream: MediaStream | null = null
  let timerInterval: number | null = null
  let handlerInstalled = false

  let ringtoneCtx: AudioContext | null = null
  let ringtoneOsc: OscillatorNode | null = null
  let ringtoneGain: GainNode | null = null
  let ringtoneInterval: number | null = null

  function getAudioContextCtor(): typeof AudioContext | null {
    return (window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext) ?? null
  }

  function primeAudio() {
    // Mobile browsers (esp. iOS Safari) require a user gesture before audio can play.
    // Call this from a click/tap handler (e.g. Join button).
    try {
      const Ctor = getAudioContextCtor()
      if (!Ctor) return
      if (!ringtoneCtx) ringtoneCtx = new Ctor()

      // Resume if suspended (may still require gesture).
      void ringtoneCtx.resume?.().catch(() => {})

      // Create a short-lived silent node so the context is actually "used".
      const osc = ringtoneCtx.createOscillator()
      const gain = ringtoneCtx.createGain()
      gain.gain.value = 0.0
      osc.connect(gain)
      gain.connect(ringtoneCtx.destination)
      osc.start()
      osc.stop(ringtoneCtx.currentTime + 0.02)
      osc.onended = () => {
        try {
          osc.disconnect()
          gain.disconnect()
        } catch {
          // ignore
        }
      }
    } catch {
      // ignore
    }
  }

  const inCall = computed(() => Boolean(roomId.value))
  const peers = computed(() => Array.from(peerNames.entries()).map(([id, name]) => ({ id, name })))

  const callLabel = computed(() => {
    // Ensure this recomputes when locale changes.
    void i18n.global.locale.value
    const names = peers.value.map((p) => p.name).filter(Boolean)
    if (names.length === 0) return String(i18n.global.t('call.notInCall'))
    return String(i18n.global.t('call.inCall', { names: names.join(', ') }))
  })

  function updateTimer() {
    if (timerStartMs.value == null) return
    timerText.value = formatDuration(Date.now() - timerStartMs.value)
  }

  function startTimerIfNeeded() {
    if (timerStartMs.value != null) return
    timerStartMs.value = Date.now()
    updateTimer()
    if (timerInterval != null) window.clearInterval(timerInterval)
    timerInterval = window.setInterval(updateTimer, 1000)
  }

  function resetTimer() {
    if (timerInterval != null) window.clearInterval(timerInterval)
    timerInterval = null
    timerStartMs.value = null
    timerText.value = '00:00'
  }

  function startRingtone() {
    try {
      stopRingtone()
      const Ctor = getAudioContextCtor()
      if (!Ctor) return
      ringtoneCtx = new Ctor()

      // If the context is suspended (common on mobile), attempt resume.
      void ringtoneCtx.resume?.().catch(() => {})

      ringtoneOsc = ringtoneCtx.createOscillator()
      ringtoneGain = ringtoneCtx.createGain()
      ringtoneOsc.type = 'sine'
      ringtoneOsc.frequency.value = 880
      ringtoneGain.gain.value = 0.0
      ringtoneOsc.connect(ringtoneGain)
      ringtoneGain.connect(ringtoneCtx.destination)
      ringtoneOsc.start()

      let on = false
      ringtoneInterval = window.setInterval(() => {
        if (!ringtoneCtx || !ringtoneGain) return
        on = !on
        ringtoneGain.gain.setTargetAtTime(on ? 0.08 : 0.0, ringtoneCtx.currentTime, 0.01)
      }, 350)
    } catch {
      // ignore
    }
  }

  function stopRingtone() {
    try {
      if (ringtoneInterval != null) window.clearInterval(ringtoneInterval)
      ringtoneInterval = null
      ringtoneOsc?.stop()
      ringtoneOsc?.disconnect()
      ringtoneGain?.disconnect()
      ringtoneCtx?.close()
    } catch {
      // ignore
    } finally {
      ringtoneCtx = null
      ringtoneOsc = null
      ringtoneGain = null
    }
  }

  async function ensureMic() {
    if (localStream) return localStream
    localStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false })
    return localStream
  }

  function closePeer(peerId: string) {
    const pc = pcs.get(peerId)
    if (pc) {
      try {
        pc.onicecandidate = null
        pc.ontrack = null
        pc.onconnectionstatechange = null
        pc.close()
      } catch {
        // ignore
      }
    }
    pcs.delete(peerId)

    const streams = { ...remoteStreams.value }
    delete streams[peerId]
    remoteStreams.value = streams

    peerNames.delete(peerId)
  }

  function resetCallState() {
    stopRingtone()
    for (const id of Array.from(pcs.keys())) closePeer(id)

    peerNames.clear()
    roomId.value = null

    pendingIncomingFrom.value = null
    pendingIncomingFromName.value = ''
    pendingIncomingRoomId.value = null

    outgoingPending.value = false
    outgoingPendingName.value = ''

    joinConfirmToId.value = null
    joinConfirmToName.value = ''

    joinPending.value = false
    joinPendingToName.value = ''
    joinPendingRoomId.value = null

    joinRequestFromId.value = null
    joinRequestFromName.value = ''
    joinRequestRoomId.value = null

    resetTimer()

    try {
      localStream?.getTracks().forEach((t) => t.stop())
    } catch {
      // ignore
    }
    localStream = null
  }

  function openJoinConfirm(toId: string, toName: string) {
    joinConfirmToId.value = toId
    joinConfirmToName.value = toName
  }

  function cancelJoinConfirm() {
    joinConfirmToId.value = null
    joinConfirmToName.value = ''
  }

  async function requestJoinOngoingCall(toId: string, toName: string) {
    if (joinPending.value) return
    if (pendingIncomingFrom.value || outgoingPending.value || inCall.value) return

    try {
      await ensureMic()
    } catch (err) {
      status.value = micErrorToStatus(err)
      return
    }

    joinPending.value = true
    joinPendingToName.value = toName
    status.value = toName
      ? String(i18n.global.t('call.requestingToJoinNamed', { name: toName }))
      : String(i18n.global.t('call.requestingToJoin'))
    session.send({ type: 'callJoinRequest', to: toId })
  }

  async function confirmJoinAttempt() {
    const toId = joinConfirmToId.value
    const toName = joinConfirmToName.value
    if (!toId || !toName) return
    cancelJoinConfirm()
    await requestJoinOngoingCall(toId, toName)
  }

  function cancelJoinPending() {
    if (!joinPending.value) return
    session.send({ type: 'callJoinCancel' })
    status.value = ''
    resetCallState()
  }

  function acceptJoinRequest() {
    if (!joinRequestFromId.value) return
    session.send({ type: 'callJoinAccept', from: joinRequestFromId.value, roomId: joinRequestRoomId.value })
    joinRequestFromId.value = null
    joinRequestFromName.value = ''
    joinRequestRoomId.value = null
  }

  function rejectJoinRequest() {
    if (!joinRequestFromId.value) return
    session.send({ type: 'callJoinReject', from: joinRequestFromId.value, roomId: joinRequestRoomId.value })
    joinRequestFromId.value = null
    joinRequestFromName.value = ''
    joinRequestRoomId.value = null
  }

  async function ensurePeerConnection(peerId: string) {
    const existing = pcs.get(peerId)
    if (existing) return existing

    const ice = session.turnConfig as unknown as TurnConfig | null
    const pc = new RTCPeerConnection(ice ?? undefined)
    pcs.set(peerId, pc)

    pc.onicecandidate = (ev) => {
      if (!ev.candidate) return
      session.send({ type: 'signal', to: peerId, payload: { kind: 'ice', candidate: ev.candidate } })
    }

    pc.ontrack = (ev) => {
      const stream = ev.streams?.[0]
      if (!stream) return
      remoteStreams.value = { ...remoteStreams.value, [peerId]: stream }
    }

    const stream = await ensureMic()
    for (const track of stream.getTracks()) {
      pc.addTrack(track, stream)
    }

    pc.addEventListener('connectionstatechange', () => {
      if (!pcs.has(peerId)) return
      if (pc.connectionState === 'connected') {
        startTimerIfNeeded()
        const connectedLabel = String(i18n.global.t('call.connected'))
        if (status.value !== connectedLabel) status.value = connectedLabel
      }
      if (pc.connectionState === 'failed' || pc.connectionState === 'closed') {
        closePeer(peerId)
        if (peerNames.size === 0) resetCallState()
      }
    })

    return pc
  }

  async function startCall(toId: string, toName: string) {
    try {
      await ensureMic()
    } catch (err) {
      status.value = micErrorToStatus(err)
      return
    }

    peerNames.set(toId, toName)

    if (!roomId.value) {
      outgoingPending.value = true
      outgoingPendingName.value = toName
      status.value = toName
        ? String(i18n.global.t('call.callingNamed', { name: toName }))
        : String(i18n.global.t('call.calling'))
    } else {
      status.value = String(i18n.global.t('call.inviting'))
    }

    session.send({ type: 'callStart', to: toId })
  }

  function hangup() {
    session.send({ type: 'callHangup' })
    status.value = String(i18n.global.t('call.callEnded'))
    stopRingtone()
    resetCallState()
  }

  async function acceptIncoming() {
    if (!pendingIncomingFrom.value) return

    try {
      await ensureMic()
    } catch (err) {
      status.value = micErrorToStatus(err)
      return
    }

    stopRingtone()
    status.value = String(i18n.global.t('call.connecting'))
    session.send({
      type: 'callAccept',
      from: pendingIncomingFrom.value,
      roomId: pendingIncomingRoomId.value,
    })

    pendingIncomingFrom.value = null
    pendingIncomingFromName.value = ''
    pendingIncomingRoomId.value = null
  }

  function rejectIncoming() {
    stopRingtone()
    if (pendingIncomingFrom.value) {
      session.send({
        type: 'callReject',
        from: pendingIncomingFrom.value,
        roomId: pendingIncomingRoomId.value,
      })
    }

    pendingIncomingFrom.value = null
    pendingIncomingFromName.value = ''
    pendingIncomingRoomId.value = null
    status.value = ''
  }

  async function handleInbound(type: string, obj: Record<string, unknown>) {
    if (type === 'incomingCall') {
      pendingIncomingFrom.value = asString(obj.from)
      pendingIncomingFromName.value = asString(obj.fromName) ?? ''
      pendingIncomingRoomId.value = asString(obj.roomId)
      status.value = pendingIncomingFromName.value
        ? String(i18n.global.t('call.incomingCallNamed', { name: pendingIncomingFromName.value }))
        : String(i18n.global.t('call.incomingCall'))

      // Best-effort alerts (no permission prompts here).
      startRingtone()
      notify(
        String(i18n.global.t('call.incomingCall')),
        pendingIncomingFromName.value
          ? String(i18n.global.t('call.from', { name: pendingIncomingFromName.value }))
          : String(i18n.global.t('call.incomingCall')),
        { tag: 'lrcom-call' },
      )
      vibrate([200, 100, 200, 100, 400])
      return
    }

    if (type === 'callStartResult') {
      const ok = asBool(obj.ok)
      const reason = asString(obj.reason) ?? ''
      if (!ok) {
        if (outgoingPending.value && !roomId.value) {
          outgoingPending.value = false
          outgoingPendingName.value = ''
          status.value = String(i18n.global.t('call.callFailed', { reason }))
        }
      } else {
        if (outgoingPending.value && !roomId.value) {
          status.value = outgoingPendingName.value
            ? String(i18n.global.t('call.ringingNamed', { name: outgoingPendingName.value }))
            : String(i18n.global.t('call.ringing'))
        }
      }
      return
    }

    if (type === 'callJoinPending') {
      joinPending.value = true
      joinPendingRoomId.value = asString(obj.roomId)
      joinPendingToName.value = asString(obj.toName) ?? joinPendingToName.value
      status.value = joinPendingToName.value
        ? String(i18n.global.t('call.waitingToJoinNamed', { name: joinPendingToName.value }))
        : String(i18n.global.t('call.waitingToJoin'))
      return
    }

    if (type === 'callJoinResult') {
      const ok = asBool(obj.ok)
      const reason = asString(obj.reason) ?? ''
      if (!ok) {
        status.value = reason
          ? String(i18n.global.t('call.joinFailedReason', { reason }))
          : String(i18n.global.t('call.joinFailed'))
        resetCallState()
      }
      return
    }

    if (type === 'joinRequest') {
      joinRequestFromId.value = asString(obj.from)
      joinRequestFromName.value = asString(obj.fromName) ?? ''
      joinRequestRoomId.value = asString(obj.roomId)
      return
    }

    if (type === 'callRejected') {
      if (outgoingPending.value && !roomId.value) {
        outgoingPending.value = false
        outgoingPendingName.value = ''
        status.value = String(i18n.global.t('call.callRejected'))
      }
      if (!roomId.value) resetCallState()
      return
    }

    if (type === 'callEnded') {
      status.value = String(i18n.global.t('call.callEnded'))
      resetCallState()
      return
    }

    if (type === 'roomPeers') {
      roomId.value = asString(obj.roomId) ?? roomId.value
      outgoingPending.value = false
      outgoingPendingName.value = ''

      // If we were waiting to join, the server has now admitted us.
      joinPending.value = false
      joinPendingToName.value = ''
      joinPendingRoomId.value = null

      const peersArr = Array.isArray(obj.peers) ? (obj.peers as unknown[]) : []
      try {
        for (const p of peersArr) {
          const po = asObj(p)
          if (!po) continue
          const id = asString(po.id)
          if (!id || id === session.myId) continue
          const name = asString(po.name) ?? ''
          peerNames.set(id, name)
          await ensurePeerConnection(id)
        }
      } catch (err) {
        status.value = micErrorToStatus(err)
        hangup()
        return
      }

      status.value = String(i18n.global.t('call.connecting'))
      return
    }

    if (type === 'roomPeerJoined') {
      roomId.value = asString(obj.roomId) ?? roomId.value
      const peerObj = asObj(obj.peer)
      const peerId = peerObj ? asString(peerObj.id) : null
      if (!peerId || peerId === session.myId) return
      const peerName = peerObj ? (asString(peerObj.name) ?? '') : ''
      peerNames.set(peerId, peerName)

      let pc: RTCPeerConnection
      try {
        pc = await ensurePeerConnection(peerId)
      } catch (err) {
        status.value = micErrorToStatus(err)
        hangup()
        return
      }

      status.value = String(i18n.global.t('call.connecting'))
      const offer = await pc.createOffer({ offerToReceiveAudio: true, offerToReceiveVideo: false })
      await pc.setLocalDescription(offer)
      session.send({ type: 'signal', to: peerId, payload: { kind: 'offer', sdp: offer } })
      return
    }

    if (type === 'roomPeerLeft') {
      const peerId = asString(obj.peerId)
      if (peerId) closePeer(peerId)
      if (peerNames.size === 0) resetCallState()
      return
    }

    if (type === 'signal') {
      const payloadObj = asObj(obj.payload)
      const kind = payloadObj ? asString(payloadObj.kind) : null
      const fromId = asString(obj.from)
      const fromName = asString(obj.fromName)
      if (fromId && fromName) peerNames.set(fromId, fromName)
      if (!payloadObj || !kind || !fromId) return

      if (kind === 'offer') {
        const sdp = payloadObj.sdp as RTCSessionDescriptionInit
        let pc: RTCPeerConnection
        try {
          pc = await ensurePeerConnection(fromId)
        } catch (err) {
          status.value = micErrorToStatus(err)
          hangup()
          return
        }
        await pc.setRemoteDescription(sdp)
        const answer = await pc.createAnswer()
        await pc.setLocalDescription(answer)
        session.send({ type: 'signal', to: fromId, payload: { kind: 'answer', sdp: answer } })
        return
      }

      if (kind === 'answer') {
        const pc = pcs.get(fromId)
        if (!pc) return
        const sdp = payloadObj.sdp as RTCSessionDescriptionInit
        await pc.setRemoteDescription(sdp)
        status.value = String(i18n.global.t('call.connected'))
        return
      }

      if (kind === 'ice') {
        const pc = pcs.get(fromId)
        if (!pc) return
        try {
          await pc.addIceCandidate(payloadObj.candidate as RTCIceCandidateInit)
        } catch {
          // ignore
        }
      }
    }
  }

  function installHandler() {
    if (handlerInstalled) return
    handlerInstalled = true

    session.registerInboundHandler((type, obj) => {
      void handleInbound(type, obj)
    })

    session.registerDisconnectHandler(() => {
      resetCallState()
      status.value = ''
    })
  }

  installHandler()

  return {
    roomId,
    status,
    inCall,
    peers,
    callLabel,
    pendingIncomingFrom,
    pendingIncomingFromName,
    outgoingPending,
    outgoingPendingName,
    joinConfirmToId,
    joinConfirmToName,
    joinPending,
    joinPendingToName,
    joinRequestFromId,
    joinRequestFromName,
    timerText,
    remoteStreams,
    startCall,
    openJoinConfirm,
    cancelJoinConfirm,
    confirmJoinAttempt,
    cancelJoinPending,
    acceptJoinRequest,
    rejectJoinRequest,
    acceptIncoming,
    rejectIncoming,
    hangup,
    primeAudio,
  }
})
