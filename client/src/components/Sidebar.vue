<script>
import { RouterLink } from 'vue-router';
import DashboardIcon from './Icons/DashboardIcon.vue';
import EmployeesIcon from './Icons/EmployeesIcon.vue';
import ClientsIcon from './Icons/ClientsIcon.vue';
import TripRatesIcon from './Icons/TripRatesIcon.vue';
import BillingIcon from './Icons/BillingIcon.vue';
import PayrollIcon from './Icons/PayrollIcon.vue';
import ArchiveIcon from './Icons/ArchiveIcon.vue';
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
    ArchiveIcon,
    LogoutIcon
  },
  data() {
    return {
      isSideBarBeingHover: false,
    };
  },
  methods: {
    onLogout() {
      this.$emit('logout');
    }
  }
};
</script>

<template>
  <aside
    @mouseover="isSideBarBeingHover = true"
    @mouseleave="isSideBarBeingHover = false"
    class="sidebar h-100 shadow-lg p-3 d-flex flex-column justify-content-between position-fixed"
  >
    <nav>
      <div
        class="d-flex flex-column justify-content-center text-center align-items-center p-2 border-bottom mb-2"
      >
        <a class="navbar-brand" href="#">
          <img
            src="../assets/company_logo.png"
            height="50"
            alt="company logo"
          />
        </a>

      </div>
      <ul
        class="nav flex-column justify-content-center nav-pills text-left"
        aria-orientation="vertical"
      >
        <li class="nav-link p-0">
          <div class="w-100">
            <RouterLink to="/dashboard" class="router-link text-light gap-2" role="button">
              <DashboardIcon class="dashboard-icon" /><span>Dashboard</span>
            </RouterLink>
          </div>
        </li>
        <li class="nav-link p-0 w-100">
          <div>
            <RouterLink to="/employee" class="router-link text-light gap-2" role="button">
              <EmployeesIcon /><span>Employees</span>
            </RouterLink>
          </div>
        </li>
        <li class="nav-link p-0 w-100">
          <div class="d-flex justify-content-between dropend">
            <RouterLink to="/client" class="router-link text-light gap-2" role="button">
              <ClientsIcon /><span>Clients</span>
            </RouterLink>
            <button
              type="button"
              class="text-light btn dropdown-toggle dropdown-toggle-split"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <span class="visually-hidden">Toggle Dropdown</span>
            </button>
            <ul id="dropdown" class="dropdown-menu nav-pills">
              <li class="dropdown-item nav-link py-1">
                <RouterLink
                  to="/triprates"
                  class="text-light d-flex align-items-center gap-1"
                  role="button"
                >
                  <TripRatesIcon /><span>Trip Rates</span>
                </RouterLink>
              </li>
              <li class="dropdown-item nav-link py-1">
                <RouterLink
                  to="/billinglist"
                  class="text-light d-flex align-items-center gap-1"
                  role="button"
                >
                  <BillingIcon /><span>Billing</span>
                </RouterLink>
              </li>
            </ul>
          </div>
        </li>
        <li class="nav-link p-0">
          <div>
            <RouterLink to="/payroll" class="router-link text-light gap-2" role="button">
              <PayrollIcon /><span>Payroll</span>
            </RouterLink>
          </div>
        </li>
        <li class="nav-link p-0">
          <div class="d-flex justify-content-between dropdown">
            <button
              type="button"
              class="archives-btn text-light btn dropdown-toggle dropdown-toggle-split w-100 d-flex align-items-center"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <div class="d-flex gap-2 align-items-center">
                <ArchiveIcon /><span>Archives</span>
              </div>
              <span class="visually-hidden">Toggle Dropdown</span>
            </button>
            <ul class="dropdown-menu w-100 nav-pills">
              <li class="dropdown-item nav-link py-1">
                <RouterLink
                  to="/archivedemployee"
                  class="text-light d-flex align-items-center gap-1"
                  role="button"
                >
                  <EmployeesIcon /> Archived Employees
                </RouterLink>
              </li>
              <li class="dropdown-item nav-link py-1">
                <RouterLink
                  to="/archivedclient"
                  class="text-light d-flex align-items-center gap-1"
                  role="button"
                >
                  <ClientsIcon /> Archived Clients
                </RouterLink>
              </li>
            </ul>
          </div>
        </li>
      </ul>
    </nav>
    <div class="text-light border-top">
      <p
        @click="onLogout"
        class="logout mt-2 mb-2 rounded d-flex align-items-center gap-1 p-0"
        role="button"
      >
      <div class="d-flex gap-2">
        <LogoutIcon /><span>Logout</span>
      </div>
      </p>
    </div>
  </aside>
</template>

<style scoped>
a,
.dropdown-toggle-split,
.logout {
  text-decoration: none;
  padding: 8px 16px;
}

aside,
.dropdown-menu {
  background-color: #041421;
  z-index: 200;
}

.nav-link:hover,
.logout:hover,
.dropdown-item:hover {
  background-color: #4c7273 !important;
}

.nav-link {
  background-color: #041421 !important;
}

.sidebar {
  width: 4rem;
  transition: width 500ms ease;
}

.sidebar .nav {
  gap: 20px;
  transition: gap 500ms ease;
}

.nav li {
  width: 100%;
}

.nav div {
  display: flex;
}

.nav li a {
  display: flex;
  transition: padding 400ms ease;
  padding: 0;
}

.nav li a span,
.nav li span {
  display: none;
}

.sidebar .nav li div button {
  display: none;
}

.archives-btn {
  display: flex;
  border: 0;
  padding: 0;
  transition: padding 400ms ease;
}

.archives-btn::after {
  display: none;
}

.logout {
  display: flex;
}

.logout span {
  display: none;
}

.sidebar:hover {
  width: 20rem;
}

.sidebar:hover .nav {
  gap: 0;
}

.sidebar:hover div {
  justify-content: flex-start;
}

.sidebar:hover .logout span {
  display: block;
}

.sidebar:hover .nav li a span {
  display: block;
}

.sidebar:hover .nav li a,
.sidebar:hover .archives-btn {
  padding: 0.8rem;
  justify-content: flex-start;
  align-items: center;
}

.sidebar:hover .logout {
  height: 100%;
}

.sidebar:hover .archives-btn {
  padding-left: 0.8rem;
}

.sidebar:hover .nav li div button {
  display: inline-block;
}

.sidebar:hover .archives-btn {
  display: flex;
  justify-content: space-between;
}

.sidebar:hover .archives-btn::after {
  display: block;
}

.sidebar:hover .archives-btn span {
  display: block;
}

.sidebar:hover .logout {
  justify-content: flex-start;
}

svg {
  width: 32px;
  transition: width 600ms ease;
}

.sidebar:hover svg {
  width: 20px;
}

.router-link {
  width: 300px;
}
</style>
