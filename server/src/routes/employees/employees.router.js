const express = require('express');

const { 
  httpGetAllEmployees,
  httpPostNewEmployee
} = require('./employees.controller');

const employeesRouter = express.Router();

employeesRouter.get('/', httpGetAllEmployees);
employeesRouter.post('/', httpPostNewEmployee);

module.exports = employeesRouter;