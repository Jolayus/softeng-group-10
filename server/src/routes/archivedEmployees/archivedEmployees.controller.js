const {
  getAllArchivedEmployees
} = require('../../models/archivedEmployees.model');

function httpGetAllArchivedEmployees(req, res) {
  return res.status(200).json(getAllArchivedEmployees());
}

module.exports = {
  httpGetAllArchivedEmployees
};
