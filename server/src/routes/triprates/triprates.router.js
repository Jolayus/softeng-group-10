const express = require('express');

const {
  httpGetAllTripRates,
  httpPostNewTripRate,
  httpDeleteTripRate,
  httpEditClientName
} = require('./triprates.controller');

const tripRatesRouter = express.Router();

tripRatesRouter.get('/', httpGetAllTripRates);
tripRatesRouter.post('/', httpPostNewTripRate);
tripRatesRouter.delete('/', httpDeleteTripRate);
tripRatesRouter.patch('/update', httpEditClientName);

module.exports = tripRatesRouter;
