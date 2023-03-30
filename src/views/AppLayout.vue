<script>
import Login from './Login.vue';
import Sidebar from '../components/Sidebar.vue';
import Footer from '../components/Footer.vue';
import { RouterView } from 'vue-router';

export default {
  name: 'AppLayout',
  data() {
    return {
      isLoggedIn: false
    };
  },
  components: {
    Login,
    Sidebar,
    Footer
  },
  emits: ['on-login']
}
</script>

<template>

  <div v-if="!isLoggedIn">
    <Login @on-login="isLoggedIn = true" />
  </div>

  <div v-else class="container-fluid">
    <div class="row">
      <div class="col-3 p-0 min-vh-100">
        <Sidebar />
      </div>
      <div class="col-9 text-center min-vh-100 d-flex flex-column">
        <RouterView />
        <Footer></Footer>
      </div>
    </div>
  </div>
</template>