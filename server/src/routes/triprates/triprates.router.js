const express = require('express');

const {
  httpGetAllTripRates,
  httpPostNewTripRates
} = require('./triprates.controller');

const tripRatesRouter = express.Router();

tripRatesRouter.get('/', httpGetAllTripRates);
tripRatesRouter.post('/', httpPostNewTripRates);

module.exports = tripRatesRouter;
