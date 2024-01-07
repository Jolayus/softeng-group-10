const express = require('express');

const {
  httpGetAllSalaries,
  httpPostNewSalary,
  httpEditSalary,
  httpDeleteSalaries
} = require('./salaries.controller');

const salariesRouter = express.Router();

salariesRouter.get('/', httpGetAllSalaries);
salariesRouter.post('/', httpPostNewSalary);
salariesRouter.patch('/', httpEditSalary);
salariesRouter.delete('/', httpDeleteSalaries);

module.exports = salariesRouter;
