const express = require('express');

const {
  httpGetAllBatches,
  httpGetNextId,
  httpPostNewBatch
} = require('./batches.controller');

const batchesRouter = express.Router();

batchesRouter.get('/', httpGetAllBatches);
batchesRouter.get('/get-next-id', httpGetNextId);
batchesRouter.post('/', httpPostNewBatch);

module.exports = batchesRouter;
