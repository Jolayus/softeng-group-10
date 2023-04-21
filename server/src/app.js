const path = require('path');

const express = require('express');
const cors = require('cors');

const employeesRouter = require('./routes/employees/employees.router');
const clientsRouter = require('./routes/clients/clients.router');
const tripRatesRouter = require('./routes/triprates/triprates.router');

const app = express();

app.use(
  cors({
    origin: 'http://localhost:5173'
  })
);

app.use(express.json());

app.use('/employees', employeesRouter);
app.use('/clients', clientsRouter);
app.use('/rates', tripRatesRouter);

// Serve all our client side files
app.use(express.static(path.join(__dirname, '..', 'public')));

// Let the client decide for routing
app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

module.exports = app;
