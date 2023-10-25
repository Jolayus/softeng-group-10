const express = require('express');

const {
  httpGetAllArchivedEmployees,
  httpRecoverEmployee,
  httpDeleteArchivedEmployee
} = require('./archivedEmployees.controller');

const archivedEmployeesRouter = express.Router();

archivedEmployeesRouter.get('/', httpGetAllArchivedEmployees);
archivedEmployeesRouter.post('/', httpRecoverEmployee);
archivedEmployeesRouter.delete('/', httpDeleteArchivedEmployee);

module.exports = archivedEmployeesRouter;
