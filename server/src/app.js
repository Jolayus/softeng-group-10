const path = require('path');

const express = require('express');
const cors = require('cors');
require('dotenv').config();

const employeesRouter = require('./routes/employees/employees.router');
const clientsRouter = require('./routes/clients/clients.router');
const tripRatesRouter = require('./routes/triprates/triprates.router');
const archivedEmployeesRouter = require('./routes/archivedEmployees/archivedEmployees.router');
const archivedClientsRouter = require('./routes/archivedClients/archivedClients.router');
const billingsRouter = require('./routes/billings/billings.router');
const billingTripsRouter = require('./routes/billingTrips/billingTrips.router');
const batchesRouter = require('./routes/batches/batches.router');
const salariesRouter = require('./routes/salaries/salaries.router');
const deductionsRouter = require('./routes/deductions/deductions.router');
const externalSalariesRouter = require('./routes/externalSalaries/externalSalaries.router');
const externalDeductionsRouter = require('./routes/externalDeductions/externalDeductions.router');
const payrollEmployeesRouter = require('./routes/payrollEmployees/payrollEmployees.router');

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
app.use('/archivedEmployees', archivedEmployeesRouter);
app.use('/archivedClients', archivedClientsRouter);
app.use('/billings', billingsRouter);
app.use('/billingtrips', billingTripsRouter);
app.use('/batches', batchesRouter);
app.use('/salaries', salariesRouter);
app.use('/deductions', deductionsRouter);
app.use('/externalSalaries', externalSalariesRouter);
app.use('/externalDeductions', externalDeductionsRouter);
app.use('/payrollEmployees', payrollEmployeesRouter);

if (process.env.MODE === 'production') {
  // Serve all our client side files
  app.use(express.static(path.join(__dirname, '..', 'public')));

  // Let the client decide for routing
  app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
  });
}


app.use(express.static(path.join(__dirname, 'routes', 'clients', 'contracts')));

module.exports = app;
