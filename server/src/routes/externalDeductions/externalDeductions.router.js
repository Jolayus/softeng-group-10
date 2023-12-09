const express = require('express');

const {
  httpGetAllExternalDeductions,
  httpPostNewExternalDeduction
} = require('./externalDeductions.controller');

const externalDeductionsRouter = express.Router();

externalDeductionsRouter.get('/', httpGetAllExternalDeductions);
externalDeductionsRouter.post('/', httpPostNewExternalDeduction);

module.exports = externalDeductionsRouter;
