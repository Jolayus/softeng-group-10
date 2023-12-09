const express = require('express');

const {
  httpGetAllDeductions,
  httpPostNewDeduction
} = require('./deductions.controller');

const deductionsRouter = express.Router();

deductionsRouter.get('/', httpGetAllDeductions);
deductionsRouter.post('/', httpPostNewDeduction);

module.exports = deductionsRouter;
