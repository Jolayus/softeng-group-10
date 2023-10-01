import { httpGetArchivedEmployees } from '../../requests/requests';

export default {
  namespaced: true,
  state() {
    return {
      archivedEmployees: []
    };
  },
  mutations: {
    setArchivedEmployees(state, newArchivedEmployees) {
      state.archivedEmployees = newArchivedEmployees;
    }
  },
  actions: {
    async loadArchivedEmployees(context) {
      const loadedArchivedEmployees = await httpGetArchivedEmployees();
      context.commit('setArchivedEmployees', loadedArchivedEmployees);
    },
    deleteArchivedEmployee(context, employeeId) {
      const idx = context.state.archivedEmployees.findIndex(
        (archivedEmployee) => archivedEmployee.id === employeeId
      );
      const x = context.state.archivedEmployees.splice(idx, 1);
    }
  },
  getters: {
    archivedEmployees(state) {
      return state.archivedEmployees;
    }
  }
};
