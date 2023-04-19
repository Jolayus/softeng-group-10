const express = require('express');

const { 
  httpGetAllEmployees,
  httpPostNewEmployee,
  httpArchiveEmployee
} = require('./employees.controller');

const employeesRouter = express.Router();

employeesRouter.get('/', httpGetAllEmployees);
employeesRouter.post('/', httpPostNewEmployee);
employeesRouter.delete('/', httpArchiveEmployee);

module.exports = employeesRouter;