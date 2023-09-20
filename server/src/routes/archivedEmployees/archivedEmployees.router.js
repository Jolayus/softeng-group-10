const express = require('express');

const { httpGetAllArchivedEmployees } = require('./archivedEmployees.controller');

const archivedEmployeesController = express.Router();

archivedEmployeesController.get('/', httpGetAllArchivedEmployees);

module.exports = archivedEmployeesController;