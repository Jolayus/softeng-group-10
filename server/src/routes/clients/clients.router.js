const express = require('express');

const {
  httpGetAllClients,
  httpPostNewClient,
  httpEditEmployee,
  httpArchiveClient
} = require('./clients.controller');

const clientsRouter = express.Router();

clientsRouter.get('/', httpGetAllClients);
clientsRouter.post('/', httpPostNewClient);
clientsRouter.patch('/', httpEditEmployee);
clientsRouter.delete('/', httpArchiveClient);

module.exports = clientsRouter;
