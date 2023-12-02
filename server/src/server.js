const http = require('http');

const app = require('./app');

const { loadEmployees } = require('./models/employees.model');
const { loadClients } = require('./models/clients.model');
const { loadTripRates } = require('./models/triprates.model');
const { loadArchivedEmployees } = require('./models/archivedEmployees.model');
const { loadArchivedClients } = require('./models/archivedClients.model');
const { loadBillings } = require('./models/billings.model');
const { loadBillingTrips } = require('./models/billingTrips.model');

const PORT = process.env.PORT || 8000;

const server = http.createServer(app);

async function startServer() {
  await loadEmployees();
  await loadClients();
  await loadTripRates();
  await loadArchivedEmployees();
  await loadArchivedClients();
  await loadBillings();
  await loadBillingTrips();

  server.listen(PORT, () => {
    console.log(`Listening on port: ${PORT}`);
  });
}

startServer();
