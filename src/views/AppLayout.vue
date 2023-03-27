<script>
import Sidebar from '../components/Sidebar.vue';
import Footer from '../components/Footer.vue';
import { RouterView } from 'vue-router';

export default {
  name: 'AppLayout',
  components: {
    Sidebar,
    Footer
  }
}
</script>

<template>
  <div class="container-fluid">
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