<script setup>
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import DyteClient from '@dytesdk/web-core';
const route = useRoute();
const roomName = route.params.roomName;
const authToken = sessionStorage.getItem('auth');
const meetingStates = ref({ meeting: 'idle'});
const joined = ref(false);
const logoConfig = ref(null);
logoConfig.value = { designTokens: { logo:'https://dyte.io/images/Dyte-Logo_1.svg' } };

onMounted(async () => {
  const dyteMeeting = await DyteClient.init({
    roomName,
    authToken
  });

  dyteMeeting.self.on('roomJoined', () => {
    joined.value = true;
    meetingStates.value.meeting = 'joined';
  });

  await dyteMeeting.joinRoom();

  [...document.getElementsByClassName('dyte-custom-meeting')].forEach((node) => {
    node.meeting = dyteMeeting;
  });

  document.addEventListener('dyteStateUpdate', (e) => {
    meetingStates.value = { ...meetingStates.value, ...e.detail }; 
  });
});
</script>

<template>
  <div class="container" v-if="joined">
    <div class="topbar">
      <div style="max-width: 100px">
        <dyte-logo id="dyte-logo" :config="logoConfig" />
      </div>
    </div>
    <div style="flex-grow: 1">
      <dyte-grid :gap="8" class="dyte-custom-meeting" />
    </div>
    <dyte-notifications class="dyte-custom-meeting" />
    <div class="action-items">
      <dyte-camera-toggle class="dyte-custom-meeting" />
      <dyte-mic-toggle class="dyte-custom-meeting" />
      <dyte-settings-toggle class="dyte-custom-meeting" :states="meetingStates" />
      <dyte-leave-button />
    </div>
    <dyte-participants-audio class="dyte-custom-meeting" />
    <dyte-dialog-manager class="dyte-custom-meeting" :states="meetingStates" />
  </div>
</template>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  width: 100vw;
  height: 100vh;
  background: black;
  color: white;
}

.topbar {
  height: 50px;
  width: 100%;
  padding: 10px;
}

.action-items {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
}
</style>
