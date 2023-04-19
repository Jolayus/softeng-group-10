const employeesModel = [];

async function httpGetEmployees() {
  const response = await fetch('http://localhost:8000/employees');
  const employees = await response.json();

  return employees;
}

employeesModel.push(...(await httpGetEmployees()));

function getEmployeesModel() {
  return employeesModel;
}

export {
  getEmployeesModel,
};