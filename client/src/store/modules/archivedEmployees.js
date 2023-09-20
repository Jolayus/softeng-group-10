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
    }
  },
  getters: {
    archivedEmployees(state) {
      return state.archivedEmployees;
    }
  }
};