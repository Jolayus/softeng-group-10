const db = require('../../database/db');

const employees = [];

function loadEmployees() {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM employees';

    db.all(sql, [], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        rows.forEach(row => employees.push(row));
        resolve();
      }
    });
  });
}

function getAllEmployees() {
  return employees;
}

module.exports = {
  loadEmployees,
  getAllEmployees
};
