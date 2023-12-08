export default {
  namespaced: true,
  state() {
    return {
      salaries: []
    };
  },
  mutations: {
    setSalaries(state, newSalaries) {
      state.salaries = newSalaries;
    },
    addSalary(state, newSalary) {
      state.salaries.push(newSalary);
    },
    editSalary(state, { newDetails, employee }) {
      const updatedSalary = state.salaries.find(
        (salary) => salary.employeeId === newDetails.employeeId
      );

      const {
        basicSalary,
        allowanceSalary,
        dailyRate,
        dailyAllowance,
        daysOfWork,
        semiBasicSalary,
        semiAllowanceSalary,
        serviceFee,
        overtimePay,
        others,
        total
      } = newDetails;

      updatedSalary.basicSalary = basicSalary;
      updatedSalary.allowanceSalary = allowanceSalary;
      updatedSalary.dailyRate = dailyRate;
      updatedSalary.dailyAllowance = dailyAllowance;
      updatedSalary.daysOfWork = daysOfWork;
      updatedSalary.semiBasicSalary = semiBasicSalary;
      updatedSalary.semiAllowanceSalary = semiAllowanceSalary;
      updatedSalary.serviceFee = serviceFee;
      updatedSalary.overtimePay = overtimePay;
      updatedSalary.others = others;
      updatedSalary.total = total;

      employee.salary = updatedSalary;
    }
  },
  actions: {
    addSalary(context, newSalary) {
      context.commit('addSalary', newSalary);
    },
    editSalary(context, newDetails) {
      const employee = context.rootGetters['employees/getEmployeeById'](
        newDetails.employeeId
      );

      context.commit('editSalary', { newDetails, employee });
    }
  },
  getters: {
    salaries(state) {
      return state.salaries;
    },
    isSalaryAlreadyExist(state) {
      return function (employeeId) {
        const idx = state.salaries.find(
          (salary) => salary.employeeId === employeeId
        );

        if (idx >= 0) {
          return true;
        }
        return false;
      };
    }
  }
};
