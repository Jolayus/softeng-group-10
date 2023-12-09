const express = require('express');

const {
  httpGetAllExternalSalaries,
  httpPostNewExternalSalary
} = require('./externalSalaries.controller');

const externalSalariesRouter = express.Router();

externalSalariesRouter.get('/', httpGetAllExternalSalaries);
externalSalariesRouter.post('/', httpPostNewExternalSalary);

module.exports = externalSalariesRouter;
