import { createStore } from 'vuex';
import employeesModule from './modules/employees';

const store = createStore({
  modules: {
    employees: employeesModule
  }
});

export default store;