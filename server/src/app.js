const path = require('path');

const express = require('express');

const employeesRouter = require('./routes/employees/employees.router');

const app = express();

app.use(express.json());

app.use('/employees', employeesRouter);

// Serve all our client side files
app.use(express.static(path.join(__dirname, '..', 'public')));

// Let the client decide for routing
app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

module.exports = app;
