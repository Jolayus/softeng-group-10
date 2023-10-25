export default {
  namespaced: true,
  state() {
    return {
      billings: []
    };
  },
  mutations: {
    setBillings(state, newBillings) {
      state.billings = newBillings;
    },
    addBilling(state, newBilling) {
      state.billings.push(newBilling);
    }
  },
  actions: {
    // async loadArchivedClients(context) {
    //   const loadedArchivedClients = await httpGetArchivedClients();
    //   context.commit('setArchivedClients', loadedArchivedClients);
    // },
    // deleteArchivedClient(context, archivedClientId) {
    //   context.commit('deleteArchivedClient', archivedClientId);
    // }
    addBilling(context, newBilling) {
      context.commit('addBilling', newBilling);
    }
  },
  getters: {
    billings(state) {
      return state.billings;
    }
  }
};
