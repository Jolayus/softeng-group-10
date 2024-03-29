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
async function httpCreateClient(formData) {
  const response = await fetch(`${API_URL}/clients`, {
    method: 'POST',
    body: formData
  });
  return await response.json();
}

// Update information of a client
async function httpUpdateClient(newDetails) {
  const response = await fetch(`${API_URL}/clients`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(newDetails)
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
async function httpCreateTripRates(tripRate) {
  const response = await fetch(`${API_URL}/rates`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(tripRate)
  });
  return await response.json();
}

// DELETE trip rates
async function httpDeleteTripRates(tripRateId) {
  const response = await fetch(`${API_URL}/rates`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ id: tripRateId })
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

async function httpRecoverArchivedClient(archivedClientId) {
  const response = await fetch(`${API_URL}/archivedClients`, {
    method: 'PATCH',
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

async function httpGetNextId() {
  const response = await fetch(`${API_URL}/batches/get-next-id`);
  const nextId = response.json();

  return nextId;
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

async function httpDeleteBatch(employeeId) {
  const response = await fetch(`${API_URL}/batches`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ employeeId })
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

async function httpUpdateSalary(newDetails) {
  const response = await fetch(`${API_URL}/salaries`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(newDetails)
  });
  return await response.json();
}

async function httpDeleteSalaries(employeeId) {
  const response = await fetch(`${API_URL}/salaries`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ employeeId })
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

async function httpUpdateDeduction(newDetails) {
  const response = await fetch(`${API_URL}/deductions`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(newDetails)
  });
  return await response.json();
}

async function httpDeleteDeductions(employeeId) {
  const response = await fetch(`${API_URL}/deductions`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ employeeId })
  });

  return await response.json();
}

// EXTERNAL SALARIES
async function httpGetAllExternalSalaries() {
  const response = await fetch(`${API_URL}/externalSalaries`);
  const externalSalaries = response.json();

  return externalSalaries;
}

async function httpPostNewExternalSalary(newExternalSalary) {
  const response = await fetch(`${API_URL}/externalSalaries`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(newExternalSalary)
  });

  return await response.json();
}

async function httpUpdateExternalSalary(newDetails) {
  const response = await fetch(`${API_URL}/externalSalaries`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(newDetails)
  });
  return await response.json();
}

async function httpDeleteExternalSalaries(employeeId) {
  const response = await fetch(`${API_URL}/externalSalaries`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ employeeId })
  });

  return await response.json();
}

// EXTERNAL DEDUCTIONS
async function httpGetAllExternalDeductions() {
  const response = await fetch(`${API_URL}/externalDeductions`);
  const externalDeductions = response.json();

  return externalDeductions;
}

async function httpPostNewExternalDeduction(newExternalDeduction) {
  const response = await fetch(`${API_URL}/externalDeductions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(newExternalDeduction)
  });

  return await response.json();
}

async function httpUpdateExternalDeduction(newDetails) {
  const response = await fetch(`${API_URL}/externalDeductions`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(newDetails)
  });
  return await response.json();
}

async function httpDeleteExternalDeductions(employeeId) {
  const response = await fetch(`${API_URL}/externalDeductions`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ employeeId })
  });

  return await response.json();
}

// PAYROLL EMPLOYEES
async function httpGetAllPayrollEmployees() {
  const response = await fetch(`${API_URL}/payrollEmployees`);
  const payrollEmployees = response.json();

  return payrollEmployees;
}

async function httpPostNewPayrollEmployee(newPayrollEmployee) {
  const response = await fetch(`${API_URL}/payrollEmployees`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(newPayrollEmployee)
  });

  return await response.json();
}

async function httpDeletePayrollEmployees(employeeId) {
  const response = await fetch(`${API_URL}/payrollEmployees`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ employeeId })
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
  httpDeleteTripRates,
  httpGetArchivedEmployees,
  httpDeleteArchivedEmployee,
  httpGetArchivedClients,
  httpDeleteArchivedClient,
  httpRecoverArchivedClient,
  httpGetAllBillings,
  httpCreateBilling,
  httpDeleteBilling,
  httpGetAllBillingTrips,
  httpPostBillingTrip,
  httpDeleteBillingTrips,
  httpGetAllBatches,
  httpGetNextId,
  httpPostNewBatch,
  httpDeleteBatch,
  httpGetAllSalaries,
  httpPostNewSalary,
  httpUpdateSalary,
  httpDeleteSalaries,
  httpGetAllDeductions,
  httpPostNewDeduction,
  httpUpdateDeduction,
  httpDeleteDeductions,
  httpGetAllExternalSalaries,
  httpPostNewExternalSalary,
  httpUpdateExternalSalary,
  httpDeleteExternalSalaries,
  httpGetAllExternalDeductions,
  httpPostNewExternalDeduction,
  httpUpdateExternalDeduction,
  httpDeleteExternalDeductions,
  httpGetAllPayrollEmployees,
  httpPostNewPayrollEmployee,
  httpDeletePayrollEmployees
};
