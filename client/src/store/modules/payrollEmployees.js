import { httpGetAllPayrollEmployees } from '../../requests/requests';

export default {
  namespaced: true,
  state() {
    return {
      payrollEmployees: []
    };
  },
  mutations: {
    setPayrollEmployees(state, newPayrollEmployees) {
      state.payrollEmployees = newPayrollEmployees;
    },
    addPayrollEmployee(state, newPayrollEmployee) {
      state.payrollEmployees.push(newPayrollEmployee);
      console.log(state.payrollEmployees);
    }
  },
  actions: {
    async loadPayrollEmployees(context) {
      const loadedPayrollEmployees = await httpGetAllPayrollEmployees();
      context.commit('setPayrollEmployees', loadedPayrollEmployees);
    },
    addPayrollEmployee(context, newPayrollEmployee) {
      context.commit('addPayrollEmployee', newPayrollEmployee);
    }
  },
  getters: {
    payrollEmployees(state) {
      return state.payrollEmployees;
    }
  }
};
