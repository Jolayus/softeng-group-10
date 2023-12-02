const express = require('express');

const {
  httpGetBillings,
  httpPostNewBilling,
  httpGetFile,
  httpDeleteBilling
} = require('./billings.controller');

const billingsRouter = express.Router();

billingsRouter.get('/', httpGetBillings);
billingsRouter.post('/', httpPostNewBilling);
billingsRouter.post('/getFile', httpGetFile)
billingsRouter.delete('/', httpDeleteBilling);

module.exports = billingsRouter;
