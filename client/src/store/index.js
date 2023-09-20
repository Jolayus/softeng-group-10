import { createStore } from 'vuex';

import employeesModule from './modules/employees';
import clientsModule from './modules/clients';
import archivedEmployeesModule from './modules/archivedEmployees';

const store = createStore({
  modules: {
    employees: employeesModule,
    clients: clientsModule,
    archivedEmployees: archivedEmployeesModule
  }
});

export default store;