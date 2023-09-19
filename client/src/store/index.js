import { createStore } from 'vuex';

import employeesModule from './modules/employees';
import clientsModule from './modules/clients';

const store = createStore({
  modules: {
    employees: employeesModule,
    clients: clientsModule
  }
});

export default store;