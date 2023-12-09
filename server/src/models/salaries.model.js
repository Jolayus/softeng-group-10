const db = require('../../database/db');

const salaries = [];

function loadSalaries() {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM salary';

    db.all(sql, [], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        rows.forEach((row) => salaries.push(row));
        resolve();
      }
    });
  });
}

function getAllSalaries() {
  return salaries;
}

function addNewSalary(newSalary) {
  return salaries.push(newSalary);
}

module.exports = {
  loadSalaries,
  getAllSalaries,
  addNewSalary
};
