const express = require('express');

const { httpGetAllArchivedClients } = require('./archivedClients.controller');

const archivedClientsRouter = express.Router();

archivedClientsRouter.get('/', httpGetAllArchivedClients);

module.exports = archivedClientsRouter;