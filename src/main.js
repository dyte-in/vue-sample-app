import { createApp, h } from "vue";
import { createRouter, createWebHistory } from "vue-router";
import { defineCustomElements } from "@dytesdk/ui-kit/loader";
import axios from "axios";
import VueAxios from "vue-axios";
import App from "./App.vue";
import HomePage from './components/HomePage.vue';
import SimpleMeeting from './components/SimpleMeeting.vue';
import CustomLayout from './components/CustomLayout.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: HomePage },
    { path: '/meeting/simple-meeting/:roomName', component: SimpleMeeting },
    { path: '/meeting/custom-layout/:roomName', component: CustomLayout },
  ],
});

// define Dyte web components
defineCustomElements();

// reate vue app
const app = createApp({
    render: () => h(App)
});

// Axios for api calls
app.use(VueAxios, axios);
app.provide('axios', app.config.globalProperties.axios);

// use router
app.use(router);

// mount the app
app.mount('#app');
