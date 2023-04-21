const { getAllTripRates } = require('../../models/triprates.model');

function httpGetAllTripRates(req, res) {
  res.status(200).json(getAllTripRates());
}

module.exports = { httpGetAllTripRates }