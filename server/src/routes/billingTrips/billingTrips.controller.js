const { getAllBillingTrips } = require('../../models/billingTrips.model');

function httpGetAllBillingTrips(req, res) {
  return res.status(200).json(getAllBillingTrips());
}

module.exports = {
  httpGetAllBillingTrips
};
