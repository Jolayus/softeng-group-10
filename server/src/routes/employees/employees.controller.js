const { getAllEmployees } = require('../../models/employees.model');

function httpGetAllEmployees(req, res) {
  return res.status(200).json(getAllEmployees());
}

module.exports = {
  httpGetAllEmployees
};