const express = require('express');

const {
  httpGetAllTripRates,
  httpPostNewTripRates,
  httpDeleteTripRates
} = require('./triprates.controller');

const tripRatesRouter = express.Router();

tripRatesRouter.get('/', httpGetAllTripRates);
tripRatesRouter.post('/', httpPostNewTripRates);
tripRatesRouter.delete('/', httpDeleteTripRates);

module.exports = tripRatesRouter;
