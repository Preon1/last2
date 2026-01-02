<script setup lang="ts">
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useCallStore } from '../stores/call'

const call = useCallStore()
const { status, timerText, pendingIncomingFrom, pendingIncomingFromName, outgoingPending, remoteStreams, callLabel } = storeToRefs(call)

const remoteIds = computed(() => Object.keys(remoteStreams.value))

function onAccept() {
  void call.acceptIncoming()
}
</script>

<template>
  <div class="card chat-top">
    <div class="chat-call">
      <div class="call-title">{{ callLabel }}</div>

      <div class="call-meta">
        <div class="status">
          <template v-if="pendingIncomingFrom">
            Incoming call from <strong>{{ pendingIncomingFromName || 'Unknown' }}</strong>
          </template>
          <template v-else>
            {{ status || (outgoingPending ? 'Calling…' : '') }}
          </template>
        </div>
        <div class="muted call-timer" :class="{ hidden: timerText === '00:00' }">{{ timerText }}</div>
      </div>

      <div class="call-actions">
        <template v-if="pendingIncomingFrom">
          <button type="button" @click="onAccept">Accept</button>
          <button class="secondary" type="button" @click="call.rejectIncoming">Reject</button>
        </template>
        <template v-else>
          <button v-if="call.inCall || outgoingPending" class="danger" type="button" @click="call.hangup">Hang up</button>
        </template>
      </div>

      <div class="remote-audios">
        <audio
          v-for="id in remoteIds"
          :key="id"
          autoplay
          playsinline
          :ref="(el) => { if (el && remoteStreams[id]) (el as HTMLAudioElement).srcObject = remoteStreams[id] }"
        />
      </div>
    </div>
  </div>
</template>
