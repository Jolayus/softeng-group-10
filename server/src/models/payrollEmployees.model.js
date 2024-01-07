const db = require('../../database/db');

let payrollEmployees = [];

function loadPayrollEmployees() {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM payrollEmployee';

    db.all(sql, [], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        rows.forEach((row) => payrollEmployees.push(row));
        resolve();
      }
    });
  });
}

function getAllPayrollEmployees() {
  return payrollEmployees;
}

function addNewPayrollEmployee(newPayrollEmployee) {
  return payrollEmployees.push(newPayrollEmployee);
}

function removePayrollEmployeeByEmployeeId(employeeId) {
  const filteredPayrollEmployees = payrollEmployees.filter(
    (payrollEmployee) => payrollEmployee.employeeId !== employeeId
  );
  payrollEmployees = filteredPayrollEmployees;
}

module.exports = {
  loadPayrollEmployees,
  getAllPayrollEmployees,
  addNewPayrollEmployee,
  removePayrollEmployeeByEmployeeId
};
