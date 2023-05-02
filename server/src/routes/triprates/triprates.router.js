const express = require('express');

const {
  httpGetAllTripRates,
  httpPostNewTripRate,
  httpEditTripRate,
  httpDeleteTripRate
} = require('./triprates.controller');

const tripRatesRouter = express.Router();

tripRatesRouter.get('/', httpGetAllTripRates);
tripRatesRouter.post('/', httpPostNewTripRate);
tripRatesRouter.patch('/', httpEditTripRate);
tripRatesRouter.delete('/', httpDeleteTripRate);

module.exports = tripRatesRouter;
