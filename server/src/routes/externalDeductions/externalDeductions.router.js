const express = require('express');

const {
  httpGetAllExternalDeductions,
  httpPostNewExternalDeduction,
  httpEditExternalDeduction
} = require('./externalDeductions.controller');

const externalDeductionsRouter = express.Router();

externalDeductionsRouter.get('/', httpGetAllExternalDeductions);
externalDeductionsRouter.post('/', httpPostNewExternalDeduction);
externalDeductionsRouter.patch('/', httpEditExternalDeduction);

module.exports = externalDeductionsRouter;
