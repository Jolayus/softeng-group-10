const express = require('express');

const {
  httpGetAllDeductions,
  httpPostNewDeduction,
  httpEditSalary
} = require('./deductions.controller');

const deductionsRouter = express.Router();

deductionsRouter.get('/', httpGetAllDeductions);
deductionsRouter.post('/', httpPostNewDeduction);
deductionsRouter.patch('/', httpEditSalary);

module.exports = deductionsRouter;
