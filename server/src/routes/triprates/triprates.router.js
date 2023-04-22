const express = require('express');

const {
  httpGetAllTripRates,
  httpPostNewTripRates,
  httpEditTripRates,
  httpDeleteTripRates
} = require('./triprates.controller');

const tripRatesRouter = express.Router();

tripRatesRouter.get('/', httpGetAllTripRates);
tripRatesRouter.post('/', httpPostNewTripRates);
tripRatesRouter.patch('/', httpEditTripRates);
tripRatesRouter.delete('/', httpDeleteTripRates);

module.exports = tripRatesRouter;
