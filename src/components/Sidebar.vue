<script>
import DashboardIcon from './Icons/DashboardIcon.vue';
import EmployeesIcon from './Icons/EmployeesIcon.vue';
import ClientsIcon from './Icons/ClientsIcon.vue';
import PayrollIcon from './Icons/PayrollIcon.vue';
import LogoutIcon from './Icons/LogoutIcon.vue';

export default {
  name: 'Sidebar',
  components: {
    DashboardIcon,
    EmployeesIcon,
    ClientsIcon,
    PayrollIcon,
    LogoutIcon
  }
}
</script>

<template>
  <aside class="min-vh-100 shadow-lg p-3 bg-dark rounded d-flex flex-column justify-content-between">
    <nav>
      <div class="d-flex flex-column justify-content-center text-center align-items-center p-2 border-bottom mb-2">
        <a class="navbar-brand" href="#">
          <img src="../assets/company_logo.png" height="50" alt="">
        </a>
        <h1 class="m-0 h5 text-light">RO-ED Logistics and Services</h1>
      </div>
      <ul class="nav flex-column justify-content-center nav-pills text-left" id="v-pills-tab" role="tablist"
        aria-orientation="vertical">
        <li>
          <a class="nav-link text-light d-flex align-items-center gap-1 active" data-bs-toggle="pill" role="button">
            <DashboardIcon />Dashboard
          </a>
        </li>
        <li>
          <a class="nav-link text-light d-flex align-items-center gap-1" data-bs-toggle="pill" role="button">
            <EmployeesIcon /> Employees
          </a>
        </li>
        <li>
          <a class="nav-link text-light d-flex align-items-center gap-1" data-bs-toggle="pill" role="button">
            <ClientsIcon /> Clients
          </a>
        </li>
        <li>
          <a class="btn nav-link text-light d-flex align-items-center gap-1" data-bs-toggle="pill" role="button">
            <PayrollIcon /> Payroll
          </a>
        </li>
      </ul>
    </nav>
    <div class="text-light border-top">
      <p class="logout p-2 mt-2 mb-2 rounded d-flex align-items-center gap-1" role="button">
        <LogoutIcon /> Logout
      </p>
    </div>
  </aside>
</template>

<style scoped>
.logout:hover {
  background-color: rgba(0, 0, 0, 0.1);
}
</style>