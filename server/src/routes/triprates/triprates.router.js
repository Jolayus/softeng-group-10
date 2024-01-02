const express = require('express');

const {
  httpGetAllTripRates,
  httpPostNewTripRate,
  httpDeleteTripRate,
} = require('./triprates.controller');

const tripRatesRouter = express.Router();

tripRatesRouter.get('/', httpGetAllTripRates);
tripRatesRouter.post('/', httpPostNewTripRate);
tripRatesRouter.delete('/', httpDeleteTripRate);

module.exports = tripRatesRouter;
