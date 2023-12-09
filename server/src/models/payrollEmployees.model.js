const db = require('../../database/db');

const payrollEmployees = [];

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

module.exports = {
  loadPayrollEmployees,
  getAllPayrollEmployees,
  addNewPayrollEmployee
};
