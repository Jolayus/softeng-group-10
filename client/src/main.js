import { createApp } from 'vue'
import App from './App.vue'
import router from './router';

import 'bootstrap/dist/css/bootstrap.css';
import './assets/main.scss';

const app = createApp(App)

app.use(router);

app.mount('#app')

import 'bootstrap/dist/js/bootstrap';