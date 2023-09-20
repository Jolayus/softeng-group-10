const { getAllArchivedClients } = require('../../models/archivedClients.model');

function httpGetAllArchivedClients(req, res) {
  return res.status(200).json(getAllArchivedClients());
}

module.exports = {
  httpGetAllArchivedClients
};
