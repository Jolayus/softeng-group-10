import { createApp } from 'vue'
import App from './App.vue'
import router from './router';
import store from './store';

import 'bootstrap/dist/css/bootstrap.css';
import './assets/main.scss';

const app = createApp(App)

app.use(router);
app.use(store);

app.mount('#app')

import 'bootstrap/dist/js/bootstrap';
