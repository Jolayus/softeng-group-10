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

export {
  httpGetEmployees,
  httpCreateEmployee,
  httpUpdateEmployee,
  httpArchiveEmployee,
  httpGetClients,
  httpCreateClient
};
