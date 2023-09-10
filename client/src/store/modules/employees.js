import { httpGetEmployees } from '../../requests/requests';

export default {
  namespaced: true,
  state() {
    return {
      employees: []
    };
  },
  mutations: {
    setEmployees(state, newEmployees) {
      state.employees = newEmployees;
    },
    addEmployee(state, newEmployee) {
      state.employees.push(newEmployee);
    },
    archiveEmployee(state, employeeId) {
      const index = state.employees.findIndex(
        (employee) => employee.id === employeeId
      );
      state.employees.splice(index, 1);
    },
    editEmployee(state, newEmployeeDetails) {
      const employee = state.employees.find(
        (employee) => employee.id === newEmployeeDetails.id
      );

      employee.name = newEmployeeDetails.name;
      employee.role = newEmployeeDetails.role;
      employee.email = newEmployeeDetails.email;
      employee.contact_number = newEmployeeDetails.contact_number;
    }
  },
  actions: {
    async loadEmployees(context) {
      const loadedEmployees = await httpGetEmployees();
      context.commit('setEmployees', loadedEmployees);
    },
    addEmployee(context, newEmployee) {
      context.commit('addEmployee', newEmployee);
    },
    archiveEmployee(context, employeeId) {
      context.commit('archiveEmployee', employeeId);
    },
    editEmployee(context, newEmployeeDetails) {
      context.commit('editEmployee', newEmployeeDetails);
    }
  },
  getters: {
    employees(state) {
      return state.employees;
    }
  }
};
