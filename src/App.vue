<script>
import Sidebar from './components/Sidebar.vue';

export default {
  name: 'App',
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
      <div class="col-9">

      </div>
    </div>
  </div>
</template>
