import { httpGetClients } from '../../requests/requests';

export default {
  namespaced: true,
  state() {
    return {
      clients: []
    };
  },
  mutations: {
    setClients(state, newClients) {
      state.clients = newClients;
    },
    addClient(state, newClient) {
      state.clients.push(newClient);
    },
    archiveClient(state, clientId) {
      const index = state.clients.findIndex(
        (client) => client.id === clientId
      );
      state.clients.splice(index, 1);
    },
    editClient(state, newClientDetails) {
      const client = state.clients.find(
        (client) => client.id === newClientDetails.id
      );
      
      client.company_name = newClientDetails.company_name;
      client.address = newClientDetails.address;
      client.contact_person = newClientDetails.contact_person;
      client.contact_number = newClientDetails.contact_number;
      client.email = newClientDetails.email;
      client.contract_number = newClientDetails.contract_number;
    }
  },
  actions: {
    async loadClients(context) {
      const loadedClients = await httpGetClients();
      context.commit('setClients', loadedClients);
    },
    addClient(context, newClient) {
      context.commit('addClient', newClient);
    },
    archiveClient(context, clientId) {
      context.commit('archiveClient', clientId);
    },
    editClient(context, newClientDetails) {
      context.commit('editClient', newClientDetails);
    }
  },
  getters: {
    clients(state) {
      return state.clients;
    }
  }
};
