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
  httpCreateBilling
};
