const API_URL = 'http://localhost:8000';

// Get all employees
async function httpGetEmployees() {
  const response = await fetch(`${API_URL}/employees`);
  const employees = await response.json();

  return employees;
}

// Create new employee
async function httpCreateEmployee(newEmployee) {
  const response = await fetch(`${API_URL}/employees`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(newEmployee)
  });
  return await response.json();
}

// Update information of an employee
async function httpUpdateEmployee(employee) {
  const response = await fetch(`${API_URL}/employees`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(employee)
  });
  return await response.json();
}

// Archive employee
async function httpArchiveEmployee(id) {
  const response = await fetch(`${API_URL}/employees`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ id })
  });
  return await response.json();
}

// CLIENTS
// Get all clients
async function httpGetClients() {
  const response = await fetch(`${API_URL}/clients`);
  const clients = await response.json();

  return clients;
}

// Create new client
async function httpCreateClient(newClient) {
  const response = await fetch(`${API_URL}/clients`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(newClient)
  });
  return await response.json();
}

// Update information of a client
async function httpUpdateClient(client) {
  const response = await fetch(`${API_URL}/clients`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(client)
  });
  return await response.json();
}

// Archive client
async function httpArchiveClient(id) {
  const response = await fetch(`${API_URL}/clients`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ id })
  });
  return await response.json();
}

// TRIP RATES
// GET all trip rates
async function httpGetAllTripRates() {
  const response = await fetch(`${API_URL}/rates`);
  const employees = await response.json();

  return employees;
}

// Create new trip rates
async function httpCreateTripRates(triprates) {
  const response = await fetch(`${API_URL}/rates`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(triprates)
  });
  return await response.json();
}

// Update information of trip rates
async function httpUpdateTripRates(tripRates) {
  const response = await fetch(`${API_URL}/rates`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(tripRates)
  });
  return await response.json();
}

// DELETE trip rates
async function httpDeleteTripRates(tripRateToBeDeleted) {
  const response = await fetch(`${API_URL}/rates`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(tripRateToBeDeleted)
  });
  return await response.json();
}

// ARCHIVED EMPLOYEES

// GET Archived Employees
async function httpGetArchivedEmployees() {
  const response = await fetch(`${API_URL}/archivedEmployees`);
  const archivedEmployees = await response.json();

  return archivedEmployees;
}

async function httpDeleteArchivedEmployee(id) {
  const response = await fetch(`${API_URL}/archivedEmployees`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ id })
  });
  return await response.json();
}

// ARCHIVED CLIENTS

// GET Archived Clients
async function httpGetArchivedClients() {
  const response = await fetch(`${API_URL}/archivedClients`);
  const archivedClients = await response.json();

  return archivedClients;
}

async function httpDeleteArchivedClient(archivedClientId) {
  const response = await fetch(`${API_URL}/archivedClients`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ id: archivedClientId })
  });
  return await response.json();
}

// BILLING
async function httpGetAllBillings() {
  const response = await fetch(`${API_URL}/billings`);
  const billings = await response.json();

  return billings;
}

async function httpCreateBilling(newBilling) {
  const response = await fetch(`${API_URL}/billings`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(newBilling)
  });

  return await response.json();
}

async function httpDeleteBilling(billingId) {
  const response = await fetch(`${API_URL}/billings`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ billingId })
  });

  return await response.json();
}

// BILLING TRIPS
async function httpGetAllBillingTrips() {
  const response = await fetch(`${API_URL}/billingtrips`);
  const billingTrips = await response.json();

  return billingTrips;
}

async function httpPostBillingTrip(newBillingTrip) {
  const response = await fetch(`${API_URL}/billingtrips`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(newBillingTrip)
  });

  return await response.json();
}

async function httpDeleteBillingTrips(billingId) {
  const response = await fetch(`${API_URL}/billingtrips`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ billingId })
  });

  return await response.json();
}

// BATCHES
async function httpGetAllBatches() {
  const response = await fetch(`${API_URL}/batches`);
  const batches = response.json();

  return batches;
}

async function httpPostNewBatch(newBatch) {
  const response = await fetch(`${API_URL}/batches`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(newBatch)
  });

  return await response.json();
}

// SALARIES
async function httpGetAllSalaries() {
  const response = await fetch(`${API_URL}/salaries`);
  const salaries = response.json();

  return salaries;
}

async function httpPostNewSalary(newSalary) {
  const response = await fetch(`${API_URL}/salaries`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(newSalary)
  });

  return await response.json();
}

// DEDUCTIONS
async function httpGetAllDeductions() {
  const response = await fetch(`${API_URL}/deductions`);
  const deductions = response.json();

  return deductions;
}

async function httpPostNewDeduction(newDeduction) {
  const response = await fetch(`${API_URL}/deductions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(newDeduction)
  });

  return await response.json();
}

export {
  httpGetEmployees,
  httpCreateEmployee,
  httpUpdateEmployee,
  httpArchiveEmployee,
  httpGetClients,
  httpCreateClient,
  httpUpdateClient,
  httpArchiveClient,
  httpGetAllTripRates,
  httpCreateTripRates,
  httpUpdateTripRates,
  httpDeleteTripRates,
  httpGetArchivedEmployees,
  httpDeleteArchivedEmployee,
  httpGetArchivedClients,
  httpDeleteArchivedClient,
  httpGetAllBillings,
  httpCreateBilling,
  httpDeleteBilling,
  httpGetAllBillingTrips,
  httpPostBillingTrip,
  httpDeleteBillingTrips,
  httpGetAllBatches,
  httpPostNewBatch,
  httpGetAllSalaries,
  httpPostNewSalary,
  httpGetAllDeductions,
  httpPostNewDeduction
};
