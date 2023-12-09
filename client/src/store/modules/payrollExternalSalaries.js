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
    }
  },
  actions: {
    async loadExternalSalaries(context) {
      const loadedExternalSalaries = await httpGetAllExternalSalaries();
      context.commit('setSalaries', loadedExternalSalaries);
    },
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
