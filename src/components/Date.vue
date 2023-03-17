<script>
export default {
  name: 'Date',
  setup() {
    const days = [
      'Mon',
      'Tue',
      'Wed',
      'Thu',
      'Fri',
      'Sat',
      'Sun'
    ];
    const dateObj = new Date();
    const month = dateObj.toLocaleString('en-US', { month: 'short' });
    const dayNumber = dateObj.getUTCDate();
    const dayWord = days[dateObj.getDay() - 1];
    const year = dateObj.getUTCFullYear();
    return {
      month,
      dayNumber,
      dayWord,
      year
    };
  }
}
</script>

<template>
  <div class="date rounded d-flex justify-content-between align-items-center text-light position-absolute border p-1">
    <h1>{{ dayNumber }}</h1>
    <div class="d-flex flex-column align-items-center">
      <h4 class="text-uppercase">{{ dayWord }}</h4>
      <p class="text-uppercase mb-0">{{ month }} {{ year }}</p>
    </div>
  </div>
</template>

<style scoped>
.date {
  background: center / cover no-repeat url('../assets/bg.date.jpg');
  width: 140px;
  top: 0;
  right: 0;
}
</style>