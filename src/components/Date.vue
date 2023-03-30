<template>
  <div class="date-time-container">
    <p class="date">{{ currentDate }}</p>
    <p class="time">{{ currentTime }}</p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      currentDate: '',
      currentTime: '',
    };
  },
  created() {
    this.updateDateTime();
    setInterval(() => this.updateDateTime(), 1000);
  },
  methods: {
    updateDateTime() {
      const now = new Date();
      const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
      const timeOptions = { hour: '2-digit', minute: '2-digit', hour12: true };
      this.currentDate = now.toLocaleDateString('en-US', dateOptions);
      this.currentTime = now.toLocaleTimeString('en-US', timeOptions);
    },
  },
};
</script>

<style scoped>
.date-time-container {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  position: absolute;
  top: 15px;
  right: 0;
  margin: 10px;
  padding: 10px;
  border-radius: 5px;
  background-color: #041421;
  color: white;
  font-size: 1.2rem;
}

.date {
  margin: 0;
}

.time {
  margin: 0;
  font-weight: bold;
}
</style>

<!-- <script>
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
</style> -->

