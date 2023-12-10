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
        const { employeeId, batchCodeId, salaryId, deductionId, type } =
          payrollEmployee;
        const employee =
          context.rootGetters['employees/getEmployeeById'](employeeId);

        const copy = JSON.parse(JSON.stringify(employee));
        copy.batchCodeId = batchCodeId;

        let salary = null;
        let deduction = null;

        if (type.toLowerCase() === 'internal') {
          salary = context.rootGetters['salaries/salaries'].find(
            (salary) => salary.id === salaryId
          );
          deduction = context.rootGetters['deductions/deductions'].find(
            (deduction) => deduction.id === deductionId
          );
        } else {
          salary = context.rootGetters[
            'externalSalaries/salaries'
          ].find((externalSalary) => externalSalary.id === salaryId);
          deduction = context.rootGetters[
            'externalDeductions/deductions'
          ].find((externalDeduction) => externalDeduction.id === deductionId);
        }

        copy.salary = salary;
        copy.deduction = deduction;
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
