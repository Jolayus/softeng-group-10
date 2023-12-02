const express = require('express');

const { httpGetAllBillingTrips } = require('./billingTrips.controller');

const billingTripsRouter = express.Router();

billingTripsRouter.get('', httpGetAllBillingTrips);

module.exports = billingTripsRouter;
