const express = require('express');

const {
  httpGetAllExternalSalaries,
  httpPostNewExternalSalary,
  httpEditExternalSalary,
  httpDeleteExternalSalaries
} = require('./externalSalaries.controller');

const externalSalariesRouter = express.Router();

externalSalariesRouter.get('/', httpGetAllExternalSalaries);
externalSalariesRouter.post('/', httpPostNewExternalSalary);
externalSalariesRouter.patch('/', httpEditExternalSalary);
externalSalariesRouter.delete('/', httpDeleteExternalSalaries);

module.exports = externalSalariesRouter;
