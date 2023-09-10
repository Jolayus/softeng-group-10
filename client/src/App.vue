<script>
import AppLayout from './views/AppLayout.vue';

export default {
  name: 'App',
  components: {
    AppLayout
  },
  async created() {
    await this.$store.dispatch('employees/loadEmployees');
  }
}
</script>

<template>
  <AppLayout />
</template>
