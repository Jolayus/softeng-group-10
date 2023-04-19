const { getAllClients } = require('../../models/clients.model');

function httpGetAllClients(req, res) {
  return res.status(200).json(getAllClients());
}

module.exports = {
  httpGetAllClients
};
