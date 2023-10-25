<script>
import AppLayout from './views/AppLayout.vue';

export default {
  name: 'App',
  components: {
    AppLayout
  },
  async created() {
    await this.$store.dispatch('employees/loadEmployees');
    await this.$store.dispatch('clients/loadClients');
  }
};
</script>

<template>
  <AppLayout />
</template>

<style>
/* Commonly used to set the table column's width fixed */
.w-20 {
  width: 20%;
}
</style>
