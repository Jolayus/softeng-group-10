const express = require('express');

const { httpGetAllSalaries, httpPostNewSalary } = require('./salaries.controller');

const salariesRouter = express.Router();

salariesRouter.get('/', httpGetAllSalaries);
salariesRouter.post('/', httpPostNewSalary);

module.exports = salariesRouter;
