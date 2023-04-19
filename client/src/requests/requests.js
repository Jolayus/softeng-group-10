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

// Archive employee
async function httpArchiveEmployee(id) {
  const response = await fetch(`${API_URL}/employees/${id}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ id })
  });
  return await response.json();
}

export {
  httpGetEmployees,
  httpCreateEmployee,
  httpArchiveEmployee
};