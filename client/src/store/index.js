import { createStore } from 'vuex';

import employeesModule from './modules/employees';
import clientsModule from './modules/clients';
import tripRatesModule from './modules/tripRates';
import archivedEmployeesModule from './modules/archivedEmployees';
import archivedClientsModule from './modules/archivedClients';
import billingsModule from './modules/billings';
import billingTripsModule from './modules/billingTrips';

const store = createStore({
  modules: {
    employees: employeesModule,
    clients: clientsModule,
    tripRates: tripRatesModule,
    archivedEmployees: archivedEmployeesModule,
    archivedClients: archivedClientsModule,
    billings: billingsModule,
    billingTrips: billingTripsModule
  }
});

export default store;
