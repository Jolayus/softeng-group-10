const express = require('express');

const {
  httpGetAllExternalSalaries,
  httpPostNewExternalSalary,
  httpEditExternalSalary
} = require('./externalSalaries.controller');

const externalSalariesRouter = express.Router();

externalSalariesRouter.get('/', httpGetAllExternalSalaries);
externalSalariesRouter.post('/', httpPostNewExternalSalary);
externalSalariesRouter.patch('/', httpEditExternalSalary);

module.exports = externalSalariesRouter;
