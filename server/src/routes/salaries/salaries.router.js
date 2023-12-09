const express = require('express');

const {
  httpGetAllSalaries,
  httpPostNewSalary,
  httpEditSalary
} = require('./salaries.controller');

const salariesRouter = express.Router();

salariesRouter.get('/', httpGetAllSalaries);
salariesRouter.post('/', httpPostNewSalary);
salariesRouter.patch('/', httpEditSalary);

module.exports = salariesRouter;
