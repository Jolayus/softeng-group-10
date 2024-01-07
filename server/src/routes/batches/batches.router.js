const express = require('express');

const {
  httpGetAllBatches,
  httpGetNextId,
  httpPostNewBatch,
  httpDeleteBatch
} = require('./batches.controller');

const batchesRouter = express.Router();

batchesRouter.get('/', httpGetAllBatches);
batchesRouter.get('/get-next-id', httpGetNextId);
batchesRouter.post('/', httpPostNewBatch);
batchesRouter.delete('/', httpDeleteBatch);

module.exports = batchesRouter;
