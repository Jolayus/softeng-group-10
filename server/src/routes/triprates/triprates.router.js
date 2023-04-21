const express = require('express');

const { httpGetAllTripRates } = require('./triprates.controller');

const tripRatesRouter = express.Router();

tripRatesRouter.get('/', httpGetAllTripRates);

module.exports = tripRatesRouter;