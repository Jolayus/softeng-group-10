import { httpGetArchivedClients } from '../../requests/requests';

export default {
  namespaced: true,
  state() {
    return {
      archivedClients: []
    };
  },
  mutations: {
    setArchivedClients(state, newArchivedClients) {
      state.archivedClients = newArchivedClients;
    }
  },
  actions: {
    async loadArchivedClients(context) {
      const loadedArchivedClients = await httpGetArchivedClients();
      context.commit('setArchivedClients', loadedArchivedClients);
    }
  },
  getters: {
    archivedClients(state) {
      return state.archivedClients;
    }
  }
};
