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
    editSalary(state, newDetails) {
      const updatedSalary = state.salaries.find((salary) => salary.employeeId === newDetails.employeeId);

      const { basicSalary, allowanceSalary, dailyRate, dailyAllowance, daysOfWork, semiBasicSalary, semiAllowanceSalary, total, overtimePay } = newDetails;
      
      updatedSalary.basicSalary = basicSalary;
      updatedSalary.allowanceSalary = allowanceSalary;
      updatedSalary.dailyRate = dailyRate;
      updatedSalary.dailyAllowance = dailyAllowance;
      updatedSalary.semiBasicSalary = semiBasicSalary;
      updatedSalary.semiAllowanceSalary = semiAllowanceSalary;
      updatedSalary.overtimePay = overtimePay;
      updatedSalary.total = total;
    }
  },
  actions: {
    addSalary(context, newSalary) {
      context.commit('addSalary', newSalary);
    },
    editSalary(context, newDetails) {
      context.commit('editSalary', newDetails);
    }
  },
  getters: {
    salaries(state) {
      return state.salaries;
    },
    isSalaryAlreadyExist(state) {
      return function (employeeId) {
        const idx = state.salaries.find((salary) => salary.employeeId === employeeId);

        if (idx >= 0) {
          return true;
        }
        return false;
      }
    }
  }
}