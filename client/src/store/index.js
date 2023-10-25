import { createStore } from 'vuex';

import employeesModule from './modules/employees';
import clientsModule from './modules/clients';
import archivedEmployeesModule from './modules/archivedEmployees';
import archivedClientsModule from './modules/archivedClients';
import billingsModule from './modules/billing';

const store = createStore({
  modules: {
    employees: employeesModule,
    clients: clientsModule,
    archivedEmployees: archivedEmployeesModule,
    archivedClients: archivedClientsModule,
    billings: billingsModule
  }
});

export default store;
