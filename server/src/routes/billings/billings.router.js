const express = require('express');

const {
  httpGetBillings,
  httpPostNewBilling
} = require('./billings.controller');

const billingsRouter = express.Router();

billingsRouter.get('/', httpGetBillings);
billingsRouter.post('/', httpPostNewBilling);

module.exports = billingsRouter;
