const express = require('express');

const {
  httpGetAllClients,
  httpPostNewClient
} = require('./clients.controller');

const clientsRouter = express.Router();

clientsRouter.get('/', httpGetAllClients);
clientsRouter.post('/', httpPostNewClient);

module.exports = clientsRouter;
