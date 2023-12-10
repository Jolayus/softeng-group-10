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
    await this.$store.dispatch('tripRates/loadTripRates');
    await this.$store.dispatch('billingTrips/loadBillingTrips');
    await this.$store.dispatch('billings/loadBillings');
    await this.$store.dispatch('salaries/loadSalaries');
    await this.$store.dispatch('deductions/loadDeductions');
    await this.$store.dispatch('externalSalaries/loadExternalSalaries');
    await this.$store.dispatch('externalDeductions/loadExternalDeductions');
    await this.$store.dispatch('batches/loadBatches');
    await this.$store.dispatch('payrollEmployees/loadPayrollEmployees');

    console.log(this.$store.getters['payrollEmployees/payrollEmployees']);
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
