const express = require('express');

const {
  httpGetAllExternalDeductions,
  httpPostNewExternalDeduction,
  httpEditExternalDeduction,
  httpDeleteExternalDeductions
} = require('./externalDeductions.controller');

const externalDeductionsRouter = express.Router();

externalDeductionsRouter.get('/', httpGetAllExternalDeductions);
externalDeductionsRouter.post('/', httpPostNewExternalDeduction);
externalDeductionsRouter.patch('/', httpEditExternalDeduction);
externalDeductionsRouter.delete('/', httpDeleteExternalDeductions);

module.exports = externalDeductionsRouter;
