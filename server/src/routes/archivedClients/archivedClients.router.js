const express = require('express');

const {
  httpGetAllArchivedClients,
  httpDeleteArchivedClient
} = require('./archivedClients.controller');

const archivedClientsRouter = express.Router();

archivedClientsRouter.get('/', httpGetAllArchivedClients);
archivedClientsRouter.delete('/', httpDeleteArchivedClient);

module.exports = archivedClientsRouter;
