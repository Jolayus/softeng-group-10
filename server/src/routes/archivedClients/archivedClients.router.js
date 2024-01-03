const express = require('express');

const {
  httpGetAllArchivedClients,
  httpDeleteArchivedClient,
  httpRecoverArchivedClient
} = require('./archivedClients.controller');

const archivedClientsRouter = express.Router();

archivedClientsRouter.get('/', httpGetAllArchivedClients);
archivedClientsRouter.delete('/', httpDeleteArchivedClient);
archivedClientsRouter.patch('/', httpRecoverArchivedClient);

module.exports = archivedClientsRouter;
