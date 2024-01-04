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
      const index = state.clients.findIndex((client) => client.id === clientId);
      state.clients.splice(index, 1);

      const key = `client_${clientId}_modified`;
      const value = localStorage.getItem(key);

      if (value !== null) {
        localStorage.removeItem(key);
      }
    },
    setModified(state, { clientId, value }) {
      const selectedClient = state.clients.find(
        (client) => client.id === clientId
      );
      selectedClient.modified = value;
    },
    editClient(state, { prevDetails, newDetails }) {
      const client = state.clients.find(
        (client) => client.id === newDetails.id
      );

      const {
        company_name,
        address,
        contact_person,
        contact_number,
        email,
        contract_number
      } = newDetails;

      client.company_name = company_name;
      client.address = address;
      client.contact_person = contact_person;
      client.contact_number = contact_number;
      client.email = email;
      client.contract_number = contract_number;

      if (
        prevDetails.company_name !== company_name ||
        prevDetails.address !== address ||
        prevDetails.contact_person !== contact_person ||
        prevDetails.contact_number !== contact_number ||
        prevDetails.email !== email ||
        prevDetails.contract_number !== contract_number
      ) {
        const currentTimestamp = Date.now();
        const key = `client_${client.id}_modified`;
        localStorage.setItem(key, currentTimestamp);
        client.modified = true;

        const remainingMilliSeconds =
          currentTimestamp + 10000 - currentTimestamp;

        setTimeout(() => {
          client.modified = false;
          localStorage.removeItem(key);
        }, remainingMilliSeconds);
      }
    }
  },
  actions: {
    async loadClients(context) {
      const loadedClients = await httpGetClients();

      // Highlight the clients's row if it is modified
      for (const loadedClient of loadedClients) {
        const key = `client_${loadedClient.id}_modified`;
        const value = localStorage.getItem(key);

        if (value !== null) {
          const currentDate = new Date();
          const currentTimestamp = currentDate.getTime();

          const remainingSeconds =
            (parseInt(value) + 10000 - currentTimestamp) / 1000;

          // Check if there is a remaining seconds
          if (remainingSeconds > 0) {
            loadedClient.modified = true;

            setTimeout(() => {
              context.commit('setModified', {
                clientId: loadedClient.id,
                value: false
              });
              localStorage.removeItem(key);
            }, remainingSeconds * 1000);
          } else {
            localStorage.removeItem(key);
          }
        }
      }

      context.commit('setClients', loadedClients);
    },
    addClient(context, newClient) {
      context.commit('addClient', newClient);
    },
    archiveClient(context, clientId) {
      context.commit('archiveClient', clientId);
    },
    editClient(context, prevAndNewDetails) {
      context.commit('editClient', prevAndNewDetails);
    }
  },
  getters: {
    clients(state) {
      return state.clients;
    },
    getClientById(state) {
      return function (id) {
        return state.clients.find((client) => client.id === id);
      };
    }
  }
};
