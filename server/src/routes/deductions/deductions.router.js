const express = require('express');

const {
  httpGetAllDeductions,
  httpPostNewDeduction,
  httpEditSalary,
  httpDeleteDeductions
} = require('./deductions.controller');

const deductionsRouter = express.Router();

deductionsRouter.get('/', httpGetAllDeductions);
deductionsRouter.post('/', httpPostNewDeduction);
deductionsRouter.patch('/', httpEditSalary);
deductionsRouter.delete('/', httpDeleteDeductions);

module.exports = deductionsRouter;
