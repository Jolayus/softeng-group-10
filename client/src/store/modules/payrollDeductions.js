export default {
  namespaced: true,
  state() {
    return {
      deductions: []
    };
  },
  mutations: {
    setDeductions(state, newDeductions) {
      state.deductions = newDeductions;
    },
    addDeduction(state, newDeduction) {
      state.deductions.push(newDeduction);
    },
    editDeduction(state, { newDetails, employee }) {
      const updatedDeduction = state.deductions.find(
        (deduction) => deduction.employeeId === newDetails.employeeId
      );

      const { cashAdvance, pagibig, SSSContrib, philhealth, late, damages, others, total } =
        newDetails;

      updatedDeduction.cashAdvance = cashAdvance;
      updatedDeduction.pagibig = pagibig;
      updatedDeduction.SSSContrib = SSSContrib;
      updatedDeduction.philhealth = philhealth;
      updatedDeduction.late = late;
      updatedDeduction.damages = damages;
      updatedDeduction.others = others;
      updatedDeduction.total = total;

      employee.deduction = updatedDeduction;

      console.log(employee);
    }
  },
  actions: {
    addDeduction(context, newDeduction) {
      context.commit('addDeduction', newDeduction);
    },
    editDeduction(context, newDetails) {
      const employee = context.rootGetters['employees/getEmployeeById'](
        newDetails.employeeId
      );

      context.commit('editDeduction', { newDetails, employee });
    }
  },
  getters: {
    deductions(state) {
      return state.deductions;
    },
    isDeductionAlreadyExists(state) {
      return function (employeeId) {
        const idx = state.deductions.find(
          (deduction) => deduction.employeeId === employeeId
        );

        if (idx >= 0) {
          return true;
        }
        return false;
      };
    }
  }
};
