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
      <div class="col-3 p-0">
        <Sidebar />
      </div>
      <div class="col-9 p-5 text-center">
        <RouterView />
      </div>
    </div>
  </div>
</template>