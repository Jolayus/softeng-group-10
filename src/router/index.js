import { createRouter, createWebHistory } from 'vue-router'
import Dashboard from '../views/Dashboard.vue';
import Employee from '../views/Employee.vue';
import Client from '../views/Client.vue';
import TripRates from '../views/TripRates.vue';
import Billing from '../views/Billing.vue';
import Payroll from '../views/Payroll.vue';

const routes = [
  {
    path: '/',
    redirect: { path: '/dashboard' }
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
    path: '/billing',
    name: 'Billing',
    component: Billing
  },
  {
    path: '/payroll',
    name: 'Payroll',
    component: Payroll
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
});

export default router
