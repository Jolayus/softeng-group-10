const express = require('express');

const {
  httpGetAllClients,
  httpPostNewClient,
  httpEditEmployee
} = require('./clients.controller');

const clientsRouter = express.Router();

clientsRouter.get('/', httpGetAllClients);
clientsRouter.post('/', httpPostNewClient);
clientsRouter.patch('/', httpEditEmployee);

module.exports = clientsRouter;
