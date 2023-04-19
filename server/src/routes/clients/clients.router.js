const express = require('express');

const { httpGetAllClients } = require('./clients.controller');

const clientsRouter = express.Router();

clientsRouter.get('/', httpGetAllClients);

module.exports = clientsRouter;
