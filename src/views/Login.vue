<script>
import { RouterLink } from 'vue-router';

export default {
  name: 'Login',
  data() {
    return {
      username: '',
      password: ''
    };
  },
  methods: {
    onLogin() {
      this.$emit('on-login');
    }
  }
};
</script>

<template>
  <div class="container-fluid">
    <div class="row min-vh-100">
      <div class="bg col-8 bg-primary">
        <div class="overlay"></div>
      </div>
      <div class="col-4 d-flex justify-content-center align-items-center flex-column">
        <div class="d-flex flex-column align-items-center">
          <div class="d-flex">
            <img
              width="120"
              height="80"
              src="../assets/company_logo.png"
              alt="company logo"
            />
            <h2>RO-ED LOGISTICS SERVICES</h2>
          </div>
          <h3 class="mb-5">Trucking Management System</h3>
        </div>
        <form @submit.prevent="onLogin" class="w-75 d-flex flex-column gap-3">
          <div class="form-group">
            <label for="loginUsername">Username</label>
            <input
              type="text"
              class="form-control"
              id="loginUsername"
              placeholder="Username"
              v-model="password"
              required
            />
          </div>
          <div class="form-group">
            <label for="loginPassword">Password</label>
            <input
              type="password"
              class="form-control"
              id="loginPassword"
              placeholder="Password"
              v-model="username"
            />
          </div>
          <button type="submit" class="btn tms-btn text-light">
            <RouterLink to="/dashboard" class="text-light text-decoration-none">Login</RouterLink>
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
.bg {
  position: relative;
  background: center / cover no-repeat url('../assets/bg.dashboard.png');
}

.bg .overlay {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: #4c7273;
  opacity: 0.4;
}

button[type="submit"] {
  margin: 0 auto;
  width: 50%;
}
</style>
