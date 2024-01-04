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
    setModified(state, { employeeId, value }) {
      const selectedEmployee = state.employees.find(
        (employee) => employee.id === employeeId
      );
      selectedEmployee.modified = value;
    },
    editEmployee(state, { prevDetails, newDetails }) {
      const employee = state.employees.find(
        (employee) => employee.id === newDetails.id
      );

      const {
        name,
        role,
        type,
        date_hired,
        vehicle_type,
        plate_number,
        email,
        contact_number,
        driver_name
      } = newDetails;

      employee.name = name;
      employee.role = role;
      employee.type = type;
      employee.date_hired = date_hired;
      employee.vehicle_type = vehicle_type;
      employee.plate_number = plate_number;
      employee.email = email;
      employee.contact_number = contact_number;
      employee.driver_name = driver_name;

      if (
        prevDetails.name !== name ||
        prevDetails.date_hired !== date_hired ||
        prevDetails.role !== role ||
        prevDetails.type !== type ||
        prevDetails.driver_name !== driver_name ||
        prevDetails.vehicle_type !== vehicle_type ||
        prevDetails.plate_number !== plate_number ||
        prevDetails.email !== email ||
        prevDetails.contact_number !== contact_number
      ) {
        const currentTimestamp = Date.now();
        const key = `employee_${employee.id}_modified`;
        localStorage.setItem(key, currentTimestamp);
        employee.modified = true;

        const remainingMilliSeconds =
          currentTimestamp + 10000 - currentTimestamp;

        setTimeout(() => {
          employee.modified = false;
          localStorage.removeItem(key);
        }, remainingMilliSeconds);
      }
    }
  },
  actions: {
    async loadEmployees(context) {
      const loadedEmployees = await httpGetEmployees();

      // Highlight the employee's row if it is modified
      for (const loadedEmployee of loadedEmployees) {
        const key = `employee_${loadedEmployee.id}_modified`;
        const value = localStorage.getItem(key);

        if (value !== null) {
          const currentDate = new Date();
          const currentTimestamp = currentDate.getTime();

          const remainingSeconds =
            (parseInt(value) + 10000 - currentTimestamp) / 1000;

          // Check if there is a remaining seconds
          if (remainingSeconds > 0) {
            loadedEmployee.modified = true;

            setTimeout(() => {
              context.commit('setModified', {
                employeeId: loadedEmployee.id,
                value: false
              });
              localStorage.removeItem(key);
            }, remainingSeconds * 1000);
          } else {
            localStorage.removeItem(key);
          }
        }
      }

      context.commit('setEmployees', loadedEmployees);
    },
    addEmployee(context, newEmployee) {
      context.commit('addEmployee', newEmployee);
    },
    archiveEmployee(context, employeeId) {
      context.commit('archiveEmployee', employeeId);
    },
    editEmployee(context, prevAndNewDetails) {
      context.commit('editEmployee', prevAndNewDetails);
    }
  },
  getters: {
    employees(state) {
      return state.employees;
    },
    getEmployeeById(state) {
      return function (id) {
        return state.employees.find((employee) => employee.id === id);
      };
    }
  }
};
