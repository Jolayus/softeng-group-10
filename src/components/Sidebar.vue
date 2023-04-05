<script>
import { RouterLink } from 'vue-router';
import DashboardIcon from './Icons/DashboardIcon.vue';
import EmployeesIcon from './Icons/EmployeesIcon.vue';
import ClientsIcon from './Icons/ClientsIcon.vue';
import TripRatesIcon from './Icons/TripRatesIcon.vue';
import BillingIcon from './Icons/BillingIcon.vue';
import PayrollIcon from './Icons/PayrollIcon.vue';
import LogoutIcon from './Icons/LogoutIcon.vue';

export default {
  name: 'Sidebar',
  components: {
    DashboardIcon,
    EmployeesIcon,
    ClientsIcon,
    TripRatesIcon,
    BillingIcon,
    PayrollIcon,
    LogoutIcon
  },
  methods: {
    onLogout() {
      this.$emit('logout');
    }
  }
}
</script>

<template>
  <aside class="h-100 shadow-lg p-3 d-flex flex-column justify-content-between position-fixed">
    <nav>
      <div class="d-flex flex-column justify-content-center text-center align-items-center p-2 border-bottom mb-2">
        <a class="navbar-brand" href="#">
          <img src="../assets/company_logo.png" height="50" alt="company logo">
        </a>
        <h1 class="m-0 h5 text-light">RO-ED Logistics and Services</h1>
      </div>
      <ul class="nav flex-column justify-content-center nav-pills text-left" id="v-pills-tab" role="tablist"
        aria-orientation="vertical">
        <li class="nav-link p-0 active" data-bs-toggle="pill">
          <RouterLink to="/dashboard" class="text-light d-flex align-items-center gap-1 active" role="button">
            <DashboardIcon />Dashboard
          </RouterLink>
        </li>
        <li class="nav-link p-0" data-bs-toggle="pill">
          <RouterLink to="/employee" class="text-light d-flex align-items-center gap-1" role="button">
            <EmployeesIcon /> Employees
          </RouterLink>
        </li>
        <li class="nav-link p-0" data-bs-toggle="pill">
          <div class="d-flex justify-content-between dropend">
            <RouterLink to="/client" class="text-light align-items-center gap-1 flex-grow-1" role="button">
              <ClientsIcon /> Clients
            </RouterLink>
            <button type="button" class="text-light btn dropdown-toggle dropdown-toggle-split" data-bs-toggle="dropdown" aria-expanded="false">
              <span class="visually-hidden">Toggle Dropdown</span>
            </button>
            <ul class="dropdown-menu">
              <li class="dropdown-item">
                <RouterLink to="/triprates" class="text-light d-flex align-items-center gap-1" role="button">
                  <TripRatesIcon /> Trip Rates
                </RouterLink>
              </li>
              <li class="dropdown-item ">
                <RouterLink to="/billing" class="text-light d-flex align-items-center gap-1" role="button">
                  <BillingIcon /> Billing
                </RouterLink>
              </li>
            </ul>
          </div>
        </li>
        <li class="nav-link p-0" data-bs-toggle="pill">
          <RouterLink to="/payroll" class="text-light d-flex align-items-center gap-1" role="button">
            <PayrollIcon /> Payroll
          </RouterLink>
        </li>
      </ul>
    </nav>
    <div class="text-light border-top">
      <p @click="onLogout" class="logout p-2 mt-2 mb-2 rounded d-flex align-items-center gap-1" role="button">
        <LogoutIcon /> Logout
      </p>
    </div>
  </aside>
</template>

<style scoped>
a {
  text-decoration: none;
  padding: 8px 16px;
}

aside,
.dropdown-menu {
  background-color: #041421;
}

.logout:hover,
.dropdown-item:hover {
  background-color: #4c7273;
}
</style>