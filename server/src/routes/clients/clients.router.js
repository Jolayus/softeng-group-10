const express = require('express');

const {
  httpGetAllClients,
  httpPostNewClient,
  httpEditClient,
  httpArchiveClient
} = require('./clients.controller');

const clientsRouter = express.Router();

clientsRouter.get('/', httpGetAllClients);
clientsRouter.post('/', httpPostNewClient);
clientsRouter.patch('/', httpEditClient);
clientsRouter.delete('/', httpArchiveClient);

module.exports = clientsRouter;
