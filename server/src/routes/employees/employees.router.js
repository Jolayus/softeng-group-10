const express = require('express');

const { httpGetAllEmployees } = require('./employees.controller');

const employeesRouter = express.Router();

employeesRouter.get('/', httpGetAllEmployees);

module.exports = employeesRouter;