<script>
export default {
  name: 'Date',
  setup() {
    const dateObj = new Date();
    const month = dateObj.toLocaleString('en-US', { month: 'short' });
    const day = dateObj.getUTCDate();
    const year = dateObj.getUTCFullYear();
    return {
      month,
      day,
      year
    };
  }
}
</script>

<template>
  <div class="date rounded d-flex justify-content-between align-items-center text-light position-absolute border p-1">
    <h1>16</h1>
    <div class="d-flex flex-column align-items-center">
      <h4>THU</h4>
      <p class="mb-0">MAR 2023</p>
    </div>
  </div>
</template>

<style scoped>
.date {
  background: center / cover no-repeat url('../assets/bg.date.jpg');
  width: 130px;
  top: 0;
  right: 0;
}
</style>