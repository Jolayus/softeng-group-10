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

      const { name, role, type, date_hired, vehicle_type, plate_number, email, contact_number } = newEmployeeDetails;

      const options = { day: 'numeric', month: 'short', year: '2-digit' };

      employee.name = name;
      employee.role = role;
      employee.type = type;
      employee.date_hired = new Date(date_hired).toLocaleDateString('en-GB', options).replace(/\s/g, '-');
      employee.vehicle_type = vehicle_type;
      employee.plate_number = plate_number;
      employee.email = email
      employee.contact_number = contact_number;
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
