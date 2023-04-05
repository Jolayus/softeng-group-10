<script>
import Login from './Login.vue';
import Sidebar from '../components/Sidebar.vue';
import Footer from '../components/Footer.vue';
import { RouterView } from 'vue-router';

export default {
  name: 'AppLayout',
  data() {
    return {
      isLoggedIn: Boolean(localStorage.getItem('authenticated'))
    };
  },
  components: {
    Login,
    Sidebar,
    Footer
  },
  methods: {
    onLoginHandler() {
      this.isLoggedIn = true;
      localStorage.setItem('authenticated', true);
      this.$router.push({ path: '/dashboard' });
    },

    onLogoutHandler() {
      this.isLoggedIn = false;
      localStorage.setItem('authenticated', false);
      this.$router.push({ path: '/login' });
      localStorage.clear();
    }
  },
  emits: ['login', 'logout']
};
</script>

<template>
  <div v-if="!isLoggedIn">
    <Login @login="onLoginHandler" />
  </div>

  <div v-else class="container-fluid">
    <div class="row">
      <div class="col-3 p-0 min-vh-100">
        <Sidebar @logout="onLogoutHandler" />
      </div>
      <div class="col-9 text-center min-vh-100 d-flex flex-column">
        <RouterView />
        <Footer></Footer>
      </div>
    </div>
  </div>
</template>
