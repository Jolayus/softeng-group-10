let employeesModel;

async function httpGetEmployees() {
  const response = await fetch('https://jsonplaceholder.typicode.com/users');
  const employees = await response.json();

  // ADDING A ROLE (CAN BE REMOVE LATER)
  const roles = ['Driver', 'Helper', 'Admin'];
  let i = 0;
  employees.forEach((employee) => {
    if (i === 3) {
      i = 0;
    }
    employee.role = roles[i];
    i++
  });

  return employees;
}

employeesModel = await httpGetEmployees();

export default employeesModel;