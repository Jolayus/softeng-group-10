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
    await this.$store.dispatch('billings/loadBillings');

    console.log(this.$store.getters['billings/billings']);
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
