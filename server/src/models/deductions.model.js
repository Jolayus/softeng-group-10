const db = require('../../database/db');

const deductions = [];

function loadDeductions() {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM deduction';

    db.all(sql, [], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        rows.forEach((row) => deductions.push(row));
        resolve();
      }
    });
  });
}

function getAllDeductions() {
  return deductions;
}

function addNewDeduction(newDeduction) {
  return deductions.push(newDeduction);
}

module.exports = {
  loadDeductions,
  getAllDeductions,
  addNewDeduction
};
