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
    },
    deleteArchivedClient(state, archivedClientId) {
      const index = state.archivedClients.findIndex(
        (archivedClient) => archivedClient.id === archivedClientId
      );
      state.archivedClients.splice(index, 1);
    },
  },
  actions: {
    async loadArchivedClients(context) {
      const loadedArchivedClients = await httpGetArchivedClients();
      context.commit('setArchivedClients', loadedArchivedClients);
    },
    deleteArchivedClient(context, archivedClientId) {
      context.commit('deleteArchivedClient', archivedClientId);
    }
  },
  getters: {
    archivedClients(state) {
      return state.archivedClients;
    }
  }
};
