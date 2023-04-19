const express = require('express');

const { 
  httpGetAllEmployees,
  httpPostNewEmployee,
  httpEditEmployee,
  httpArchiveEmployee
} = require('./employees.controller');

const employeesRouter = express.Router();

employeesRouter.get('/', httpGetAllEmployees);
employeesRouter.post('/', httpPostNewEmployee);
employeesRouter.patch('/', httpEditEmployee);
employeesRouter.delete('/', httpArchiveEmployee);

module.exports = employeesRouter;