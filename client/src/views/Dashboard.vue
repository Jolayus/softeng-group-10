<script>
import { RouterLink } from 'vue-router';

import CardDashboard from '../components/CardDashboard.vue';
import Date from '../components/Date.vue';

import cardsData from '../models/CardsData.js';

export default {
  components: {
    CardDashboard,
    Date
  },
  data() {
    return {
      cards: cardsData,
      classes: [
        'bg-primary',
        'bg-secondary',
        'bg-success',
        'bg-danger',
        'bg-warning',
        'bg-info'
      ]
    };
  },
  computed: {
    employeesLength() {
      return this.$store.getters['employees/employees'].length;
    },
    clientsLength() {
      return this.$store.getters['clients/clients'].length;
    }
  }
};
</script>

<template>
  <div class="gap-2 d-flex flex-column justify-content-between dashboard-main">
    <header class="position-relative">
      <h1>Dashboard</h1>
      <Date />
    </header>
    <main class="container-fluid p-5 position-relative main">
      <div class="row justify-content-center gap-3">
        <CardDashboard v-for="(card, index) in cards" :classes="classes[index]">
          <template v-slot:title>
            <div
              class="d-flex justify-content-center"
              :class="{
                'justify-content-between':
                  card.title === 'Employees' || card.title === 'Clients'
              }"
            >
              <h2 class="card-title">{{ card.title }}</h2>
              <h2 v-if="card.title === 'Employees'">{{ employeesLength }}</h2>
              <h2 v-else-if="card.title === 'Clients'">{{ clientsLength }}</h2>
            </div>
          </template>
          <template v-slot:description>
            <p class="card-text">{{ card.description }}</p>
          </template>
          <template v-slot:link>
            <RouterLink :to="card.path" class="btn text-light tms-btn"
              >{{ card.title }} Link</RouterLink
            >
          </template>
        </CardDashboard>
      </div>
    </main>
  </div>
</template>

<style scoped>
.main {
  z-index: -1;
}

.btn {
  z-index: 2;
}

.dashboard-main {
  z-index: 100;
}
</style>
