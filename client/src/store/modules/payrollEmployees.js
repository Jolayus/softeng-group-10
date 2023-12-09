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
    }
  },
  actions: {
    async loadPayrollEmployees(context) {
      const loadedPayrollEmployees = await httpGetAllPayrollEmployees();

      loadedPayrollEmployees.forEach((payrollEmployee) => {
        const { employeeId, batchCodeId } = payrollEmployee;
        const employee =
          context.rootGetters['employees/getEmployeeById'](employeeId);

        const copy = JSON.parse(JSON.stringify(employee));
        copy.batchCodeId = batchCodeId;

        context.commit('addPayrollEmployee', copy);
      });
    },
    addPayrollEmployee(context, newPayrollEmployee) {
      const { employeeId, batchCodeId, salaryId, deductionId, type } =
        newPayrollEmployee;

      const employee =
        context.rootGetters['employees/getEmployeeById'](employeeId);

      const copy = JSON.parse(JSON.stringify(employee));
      copy.batchCodeId = batchCodeId;


      context.commit('addPayrollEmployee', copy);
    }
  },
  getters: {
    payrollEmployees(state) {
      return state.payrollEmployees;
    }
  }
};
