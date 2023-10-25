import store from '../store';

async function getEmployeesModel() {
  await store.dispatch('clients/loadClients');

  return store.getters['clients/clients'];
} 

export { getEmployeesModel };
