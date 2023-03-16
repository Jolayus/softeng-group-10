<script>
import Sidebar from '../components/Sidebar.vue';
import { RouterView } from 'vue-router';

export default {
  name: 'AppLayout',
  components: {
    Sidebar
  }
}
</script>

<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col-3 p-0 min-vh-100">
        <Sidebar />
      </div>
      <div class="col-9 text-center min-vh-100">
        <RouterView />
      </div>
    </div>
  </div>
</template>