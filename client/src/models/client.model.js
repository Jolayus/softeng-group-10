import { httpGetClients } from '../requests/requests';

const clientsModel = [];

clientsModel.push(...(await httpGetClients()));

function getClientsModel() {
  return clientsModel;
}

export { getClientsModel };
