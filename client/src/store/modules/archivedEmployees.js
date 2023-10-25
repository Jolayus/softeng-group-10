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
    },
    deleteArchivedEmployee(state, archivedEmployeeId) {
      const index = state.archivedEmployees.findIndex(
        (archivedEmployee) => archivedEmployee.id === archivedEmployeeId
      );
      state.archivedEmployees.splice(index, 1);
    },
  },
  actions: {
    async loadArchivedEmployees(context) {
      const loadedArchivedEmployees = await httpGetArchivedEmployees();
      context.commit('setArchivedEmployees', loadedArchivedEmployees);
    },
    deleteArchivedEmployee(context, archivedEmployeeId) {
      context.commit('deleteArchivedEmployee', archivedEmployeeId);
    }
  },
  getters: {
    archivedEmployees(state) {
      return state.archivedEmployees;
    }
  }
};
