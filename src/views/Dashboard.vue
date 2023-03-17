<script>
import { RouterLink } from 'vue-router';

import CardDashboard from '../components/CardDashboard.vue';
import Date from '../components/Date.vue';
import Footer from '../components/Footer.vue';

import cardsData from '../model/CardsData.js';

export default {
  components: {
    CardDashboard,
    Date,
    Footer
  },
  data() {
    return {
      cards: cardsData
    };
  }
}
</script>

<template>
  <div class="d-flex flex-column justify-content-between h-100">
    <header class="position-relative">
      <h1>Dashboard</h1>
      <Date />
    </header>
    <main class="container-fluid p-5 position-relative">
      <div class="bg"></div>
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
    </main>
    <Footer>
      <div>
        <img src="../assets/company_logo.png" height="30" alt="company logo">
        <span>RO-ED Trucking Management System</span>
      </div>
      <div>
        <em>
          <small>Introduce opportunities for our Partner Operators and offer solution</small>
        </em>
      </div>
    </Footer>
  </div>
</template>

<style scoped>
.bg {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background: center / cover no-repeat url('../assets/bg.dashboard.png');
  opacity: 0.8;
}
</style>