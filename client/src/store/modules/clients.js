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

      const client = state.clients.find((client) => client.id === newClient.id);

      const currentTimestamp = Date.now();
      const key = `client_${client.id}_newlyAdded`;
      localStorage.setItem(key, currentTimestamp);
      client.newlyAdded = true;

      const remainingMilliSeconds = currentTimestamp + 10000 - currentTimestamp;

      setTimeout(() => {
        client.newlyAdded = false;
        localStorage.removeItem(key);
      }, remainingMilliSeconds);
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
    setNewlyAdded(state, { clientId, value }) {
      const selectedClient = state.clients.find(
        (client) => client.id === clientId
      );
      selectedClient.newlyAdded = value;
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
        const newlyAddedKey = `client_${loadedClient.id}_newlyAdded`;
        const newlyAddedValue = localStorage.getItem(newlyAddedKey);

        if (newlyAddedValue !== null) {
          const currentTimestamp = Date.now();

          const remainingSeconds =
            (parseInt(newlyAddedValue) + 10000 - currentTimestamp) / 1000;

          if (remainingSeconds > 0) {
            loadedClient.newlyAdded = true;

            setTimeout(() => {
              context.commit('setNewlyAdded', {
                clientId: loadedClient.id,
                value: false
              });
              localStorage.removeItem(newlyAddedKey);
            }, remainingSeconds * 1000);
          } else {
            localStorage.removeItem(newlyAddedKey);
          }
        }

        const modifiedKey = `client_${loadedClient.id}_modified`;
        const modifiedValue = localStorage.getItem(modifiedKey);

        if (modifiedValue !== null) {
          const currentTimestamp = Date.now();

          const remainingSeconds =
            (parseInt(modifiedValue) + 10000 - currentTimestamp) / 1000;

          // Check if there is a remaining seconds
          if (remainingSeconds > 0) {
            loadedClient.modified = true;

            setTimeout(() => {
              context.commit('setModified', {
                clientId: loadedClient.id,
                value: false
              });
              localStorage.removeItem(modifiedKey);
            }, remainingSeconds * 1000);
          } else {
            localStorage.removeItem(modifiedKey);
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
