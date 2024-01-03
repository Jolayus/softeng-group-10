const express = require('express');

const {
  httpGetAllClients,
  httpPostNewClient,
  httpEditClient,
  httpArchiveClient,
  upload
} = require('./clients.controller');

const clientsRouter = express.Router();

clientsRouter.get('/', httpGetAllClients);
clientsRouter.post('/', upload.single('contract'), httpPostNewClient);
clientsRouter.patch('/', httpEditClient);
clientsRouter.delete('/', httpArchiveClient);

module.exports = clientsRouter;
