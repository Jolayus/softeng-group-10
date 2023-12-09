const db = require('../../database/db');

const externalSalaries = [];

function loadExternalSalaries() {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM externalSalary';

    db.all(sql, [], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        rows.forEach((row) => externalSalaries.push(row));
        resolve();
      }
    });
  });
}

function getAllExternalSalaries() {
  return externalSalaries;
}

function addNewExternalSalary(newExternalSalary) {
  return externalSalaries.push(newExternalSalary);
}

module.exports = {
  loadExternalSalaries,
  getAllExternalSalaries,
  addNewExternalSalary
};
