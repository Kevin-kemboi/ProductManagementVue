import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';
import './assets/main.css';
import { useAuthStore } from './stores/authStore';

// Create Pinia instance
const pinia = createPinia();

// Create Vue app
const app = createApp(App);

// Use plugins
app.use(pinia);
app.use(router);

// Restore session before mounting
const authStore = useAuthStore();
authStore.restoreSession();

// Mount the app
app.mount('#app');
