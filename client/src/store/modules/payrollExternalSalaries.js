import { httpGetAllExternalSalaries } from '../../requests/requests';

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
        noOfTrips,
        clientTripRates,
        totalAmountOfTrips,
        dropRate,
        tollFee,
        passway,
        others,
        total
      } = newDetails;

      updatedSalary.noOfTrips = noOfTrips;
      updatedSalary.clientTripRates = clientTripRates;
      updatedSalary.totalAmountOfTrips = totalAmountOfTrips;
      updatedSalary.dropRate = dropRate;
      updatedSalary.tollFee = tollFee;
      updatedSalary.passway = passway;
      updatedSalary.others = others;
      updatedSalary.total = total;

      employee.salary = updatedSalary;
    },
    removeSalaries(state, employeeId) {
      state.salaries = state.salaries.filter(
        (salary) => salary.employeeId !== employeeId
      );
    }
  },
  actions: {
    async loadExternalSalaries(context) {
      const loadedExternalSalaries = await httpGetAllExternalSalaries();
      context.commit('setSalaries', loadedExternalSalaries);
    },
    addSalary(context, newSalary) {
      console.log(newSalary);
      context.commit('addSalary', newSalary);
    },
    editSalary(context, newDetails) {
      const employee = context.rootGetters['employees/getEmployeeById'](
        newDetails.employeeId
      );

      context.commit('editSalary', { newDetails, employee });
    },
    removeSalaries(context, employeeId) {
      context.commit('removeSalaries', employeeId);
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
    },
    getExternalSalaryByEmployeeId(state) {
      return function (employeeId) {
        return state.salaries.find(
          (salary) => salary.employeeId === employeeId
        );
      };
    }
  }
};
