const employeesModelArchive = [];

function getEmployeesModelArchive() {
  return employeesModelArchive;
}

function addEmployeeArchive(employee) {
  employeesModelArchive.push(employee);
}

export {
  getEmployeesModelArchive,
  addEmployeeArchive
}