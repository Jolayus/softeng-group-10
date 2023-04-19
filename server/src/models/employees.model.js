const db = require('../../database/db');

const employees = [];

function loadEmployees() {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      db.each('SELECT * FROM employees', (err, employee) => {
        if (err) {
          reject(err);
        } else {
          employees.push(employee);
          resolve();
        }
      });
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
