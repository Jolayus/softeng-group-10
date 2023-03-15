<script>
import { RouterLink } from 'vue-router';

import CardDashboard from '../components/CardDashboard.vue';
import cardsData from '../data/CardsData.js';

export default {
  components: {
    CardDashboard
  },
  data() {
    return {
      cards: cardsData
    };
  },
}
</script>

<template>
  <h1>Dashboard</h1>
  <div class="container-fluid">
    <div class="row justify-content-center gap-4">
      <CardDashboard v-for="card in cards">
        <template v-slot:title>
          <h2 class="card-title">{{ card.title }}</h2>
        </template>
        <template v-slot:description>
          <p class="card-text">{{ card.description }}</p>
        </template>
        <template v-slot:link>
          <RouterLink :to="card.path" class="btn text-light tms-btn">{{ card.title }} Link</RouterLink>
        </template>
      </CardDashboard>
    </div>
  </div>
</template>