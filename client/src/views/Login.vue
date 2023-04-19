<script>
export default {
  name: 'Login',
  data() {
    return {
      username: '',
      password: '',
      error: ''
    };
  },
  methods: {
    onLogin() {
      if (this.username === 'admin' && this.password === 'admin') {
        this.$emit('login');
      } else if (this.username !== 'admin' && this.password !== 'admin') {
        this.error = 'Incorrect username and password';
      } else if (this.username !== 'admin') {
        this.error = 'Incorrect username';
      } else {
        this.error = 'Incorrect password';
      }
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
      <div
        class="col-4 d-flex justify-content-center align-items-center flex-column"
      >
        <div class="d-flex flex-column align-items-center">
          <div class="d-flex">
            <img
              class="logo"
              width="120"
              height="80"
              src="../assets/company_logo.png"
              alt="company logo"
              style="margin-bottom: 20px; margin-left: 15px"
            />
            <h2>RO-ED LOGISTICS SERVICES</h2>
          </div>
          <h3
            class="mb-5"
            style="background-color: #4c7273; color: white; padding: 10px"
          >
            Trucking Management System
          </h3>
        </div>
        <form @submit.prevent="onLogin" class="w-75 d-flex flex-column gap-3">
          <div class="form-group">
            <label for="loginUsername">Username</label>
            <input
              type="text"
              class="form-control"
              id="loginUsername"
              placeholder="Username"
              v-model="username"
              required
            />
          </div>
          <div class="form-group">
            <label for="loginPassword" style="margin-top: 20px">Password</label>
            <input
              type="password"
              class="form-control"
              id="loginPassword"
              placeholder="Password"
              v-model="password"
              required
            />
          </div>
          <button
            type="submit"
            class="btn tms-btn text-light"
            style="margin-top: 10px"
          >
            Login
          </button>
        </form>
        <div class="mt-3 text-danger warning-message" v-if="error">
          {{ error }}
        </div>
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

h2 {
  font-size: 1.5rem;
  line-height: 1.2;
  font-weight: bold;
  text-transform: uppercase;
  color: #333;
  margin-right: 30px;
  margin-top: 14px;
}

h3 {
  font-size: 1.2rem;
  line-height: 1.2;
  font-weight: bold;
  text-align: center;
  margin-bottom: 2rem;
  text-transform: uppercase;
  letter-spacing: 0.2rem;
  color: #333;
}

.form-group {
  margin-top: -20px;
}

button[type='submit'] {
  margin: 0 auto;
  width: 50%;
}

.text-danger {
  color: #dc3545;
  font-size: 1rem;
}

.warning-message {
  text-align: center;
  margin-top: 10px;
  padding: 10px;
  border: 1px solid #dc3545;
  border-radius: 5px;
  background-color: #f8d7da;
}
</style>
