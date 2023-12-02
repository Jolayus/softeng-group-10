import { createRouter, createWebHistory } from 'vue-router';
import Login from '../views/Login.vue';
import Dashboard from '../views/Dashboard.vue';
import Employee from '../views/Employee.vue';
import Client from '../views/Client.vue';
import TripRates from '../views/TripRates.vue';
import BillingList from '../views/BillingList.vue';
import Billing from '../views/Billing.vue';
import Payroll from '../views/Payroll.vue';
import ArchivedClient from '../views/ArchivedClient.vue';
import ArchivedEmployee from '../views/ArchivedEmployee.vue';

const routes = [
  {
    path: '/',
    redirect: { path: '/login' }
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    beforeEnter: (to, from, next) => {
      if (Boolean(localStorage.getItem('authenticated'))) {
        next('/dashboard');
      } else {
        next();
      }
    }
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard
  },
  {
    path: '/employee',
    name: 'Employee',
    component: Employee
  },
  {
    path: '/client',
    name: 'Client',
    component: Client
  },
  {
    path: '/triprates',
    name: 'TripRates',
    component: TripRates
  },
  {
    path: '/billinglist',
    name: 'BillingList',
    component: BillingList
  },
  {
    path: '/billing/:billingId',
    name: 'Billing',
    component: Billing,
    props: true
  },
  {
    path: '/payroll',
    name: 'Payroll',
    component: Payroll
  },
  {
    path: '/archivedclient',
    name: 'ArchivedClient',
    component: ArchivedClient
  }
  ,
  {
    path: '/archivedemployee',
    name: 'ArchivedEmployee',
    component: ArchivedEmployee
  }
];

routes.forEach((route) => {
  if (route.path !== '/' && route.path !== '/login') {
    route.beforeEnter = function (to, from, next) {
      if (Boolean(localStorage.getItem('authenticated'))) {
        next();
      } else {
        next('/login');
      }
    };
  }
});

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
});

export default router;
