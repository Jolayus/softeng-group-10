const express = require('express');

const {
  httpGetBillings,
  httpPostNewBilling,
  httpGetFile
} = require('./billings.controller');

const billingsRouter = express.Router();

billingsRouter.get('/', httpGetBillings);
billingsRouter.post('/', httpPostNewBilling);
billingsRouter.get('/getFile', httpGetFile)

module.exports = billingsRouter;
