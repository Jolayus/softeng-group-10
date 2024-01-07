const express = require('express');

const {
  httpGetAllPayrollEmployees,
  httpPostNewPayrollEmployee,
  httpDeletePayrollEmployee
} = require('./payrollEmployees.controller');

const payrollEmployeesRouter = express.Router();

payrollEmployeesRouter.get('/', httpGetAllPayrollEmployees);
payrollEmployeesRouter.post('/', httpPostNewPayrollEmployee);
payrollEmployeesRouter.delete('/', httpDeletePayrollEmployee);

module.exports = payrollEmployeesRouter;
