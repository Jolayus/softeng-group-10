const express = require('express');

const { httpGetAllBatches, httpPostNewBatch } = require('./batches.controller');

const batchesRouter = express.Router();

batchesRouter.get('/', httpGetAllBatches);
batchesRouter.post('/', httpPostNewBatch);

module.exports = batchesRouter;
