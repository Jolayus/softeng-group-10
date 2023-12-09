const express = require('express');

const {
  httpGetAllPayrollEmployees,
  httpPostNewPayrollEmployee
} = require('./payrollEmployees.controller');

const payrollEmployeesRouter = express.Router();

payrollEmployeesRouter.get('/', httpGetAllPayrollEmployees);
payrollEmployeesRouter.post('/', httpPostNewPayrollEmployee);

module.exports = payrollEmployeesRouter;
