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
    },
    deleteBilling(state, billingId) {
      const idx = state.billings.findIndex((billing) => billing.id === billingId);
      state.billings.splice(idx, 1);
    }
  },
  actions: {
    // async loadArchivedClients(context) {
    //   const loadedArchivedClients = await httpGetArchivedClients();
    //   context.commit('setArchivedClients', loadedArchivedClients);
    // },
    // deleteArchivedClient(context, archivedClientId) {
    //   context.commit('deleteArchivedClient', archivedClientId);
    // },
    addBilling(context, newBilling) {
      context.commit('addBilling', newBilling);
    },
    deleteBilling(context, billingId) {
      context.commit('deleteBilling', billingId);
    }
  },
  getters: {
    billings(state) {
      return state.billings;
    }
  }
};
