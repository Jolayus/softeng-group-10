const express = require('express');

const {
  httpGetAllTripRates,
  httpPostNewTripRate,
  httpEditClientName
} = require('./triprates.controller');

const tripRatesRouter = express.Router();

tripRatesRouter.get('/', httpGetAllTripRates);
tripRatesRouter.post('/', httpPostNewTripRate);
tripRatesRouter.patch('/update', httpEditClientName);

module.exports = tripRatesRouter;
