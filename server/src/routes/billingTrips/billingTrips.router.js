const express = require('express');

const {
  httpGetAllBillingTrips,
  httpPostBillingTrip,
  httpDeleteBillingTrips
} = require('./billingTrips.controller');

const billingTripsRouter = express.Router();

billingTripsRouter.get('/', httpGetAllBillingTrips);
billingTripsRouter.post('/', httpPostBillingTrip);
billingTripsRouter.delete('/', httpDeleteBillingTrips);

module.exports = billingTripsRouter;
