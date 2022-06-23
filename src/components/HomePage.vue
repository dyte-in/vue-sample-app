<template>
  <div class="main-screen-wrapper">
    <div class="divider" />
    <h3>Choose Example </h3>
    <select @change="setSelectedExample">
      <option value="simple-meeting">simple-meeting</option>
      <option value="custom-layout">custom-layout</option>
    </select>
    <div class="ex-det">
      <div>Check the example component here</div>
      <br />
      <code>/src/components/{{currentExample}}.vue</code>
    </div>
    <div class="divider" />
    <div class="existing-meeting-wrapper flex column">
      <h3>List of created rooms.</h3>
      <h5>Click to join as new participant or as a host.</h5>
      <dyte-spinner v-if="loading"/>
      <div v-if="!loading" class="existing-meeting-list flex row">
        <div v-for="meeting in meetings" :key="meeting.id" class="flex column meeting-list-wrapper">
          <li key={{meeting.id}}>{{meeting.title}}</li>
          <div class="flex row">
            <button @click="joinMeeting(meeting, $event, true)">
              Join as Host
            </button>
            <button class="margin-left">
              Join as Participant
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, inject } from "vue";

const MY_BACKEND = process.env.VUE_APP_MY_BACKEND;

export default {
  name: 'HomePage',
  methods: {
    joinMeeting(meeting, evt, isHost) {
      const { id, roomName } = meeting;

      this.axios({
        url: `${MY_BACKEND}/participant/create`,
        method: "POST",
        headers: {
          Accept: "application/json",
        },
        data: {
          roleName: isHost ? 'host' : 'participant',
          meetingId: id,
          clientSpecificId: Math.random().toString(36).substring(7)
        },
      }).then((resp) => {
        const authResponse = resp.data.data.authResponse;
        const authToken = authResponse.authToken;

        //saving meeting details in session storage
        sessionStorage.setItem("auth", authToken);
        sessionStorage.setItem("meetingID", id);
        sessionStorage.setItem("roomName", roomName);
        this.$router.push(`/meeting/${this.currentExample}/${roomName}`);
      });
    },
    setSelectedExample(evt) {
      this.currentExample = evt.target.value;
    }
  },
  setup() {
    const meetings = ref(null);
    const loading = ref(true);
    const error = ref(null);
    const currentExample = ref('simple-meeting');
    const axios = inject('axios');

    async function fetchData() {
      axios.get(`${MY_BACKEND}/meetings`).then((response) => {
        if (response.data && response.data.data && response.data.data.total > 0) {
          meetings.value = response.data.data.meetings;
          loading.value = false;
        }
      });
    }

    onMounted(async () => {
      await fetchData();
    });

    return {
      meetings,
      loading,
      currentExample,
      error
    };
 },
}
</script>

<style scoped>

.flex {
  display: flex;
}

.column {
  flex-direction: column;
}

.row {
  flex-direction: row;
}

.main-screen-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 50%;
  margin: 0 auto;
}

.main-screen-wrapper img {
  width: 50%;
  margin: 20px 0;
  height: 100px;
}

button {
  padding: 10px 16px;
  background: #0078e7;
  border: none;
  cursor: pointer;
  color: white;
  border-radius: 2px;
}

li {
  font-size: 18px;
  padding: 10px 0;
  display: table-cell;
  text-transform: capitalize;
  width: 300px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

button:hover {
  background: #2160fd;
}

.margin-left {
  margin-left: 1rem;
}

.meeting-list-wrapper {
  background: #262626;
  padding: 10px;
  border-radius: 4px;
  cursor: pointer;
  margin: 10px 10px 10px 0;
}
.meeting-list-wrapper:hover {
  transform: scale(1.02);
  transition: all 0.2s ease-in;
}

.existing-meeting-wrapper {
  width: 50%;
  align-items: center;
}
.existing-meeting-list {
  flex-wrap: wrap;
  justify-content: space-evenly;
}

.existing-meeting-wrapper h3 {
  margin-bottom: 0rem;
}
input {
  padding: 10px;
}

.divider {
  height: 0.5px;
  width: 100%;
  background: #dddddd;
  margin-top: 1.5em;
  opacity: 0.5;
}

.no-rooms {
  background: #262626;
  padding: 10px;
  border-radius: 4px;
  cursor: pointer;
  margin: 10px 10px 10px 0;
}

.ex-det {
  margin: 20px 0;
}

.ex-det code {
  padding: 10px;
  background: #474747;
  border-radius: 4px;
}


</style>
