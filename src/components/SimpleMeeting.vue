<template>
  <div class="hello">
    <dyte-meeting id="meeting" />
  </div>
</template>

<script>
import { onMounted } from 'vue';
import { useRoute } from 'vue-router';
import DyteClient from '@dytesdk/web-core';

export default {
  name: 'SimpleMeeting',
  methods: {
    
  }, 
  setup() {
    const route = useRoute();
    const roomName = route.params.roomName;
    const authToken = sessionStorage.getItem('auth');

    onMounted(async () => {
      const dyteMeeting = await DyteClient.init({
        roomName,
        authToken
      });
      dyteMeeting.self.on('roomJoined', () => {
        if (dyteMeeting.self.audioEnabled) {
          console.log('joined meeting with audio track', dyteMeeting.self.audioTrack);
        }
      });

      dyteMeeting.self.on('audioUpdate', ({audioEnabled, audioTrack}) => {
        if (audioEnabled) {
          console.log('Audio Track for current user', audioTrack);
        }
      });

      document.getElementById('meeting').meeting = dyteMeeting;
    });
  },
}
</script>