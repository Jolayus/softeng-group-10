const express = require('express');

const {
  httpGetAllBillingTrips,
  httpPostBillingTrip
} = require('./billingTrips.controller');

const billingTripsRouter = express.Router();

billingTripsRouter.get('', httpGetAllBillingTrips);
billingTripsRouter.post('', httpPostBillingTrip);

module.exports = billingTripsRouter;
