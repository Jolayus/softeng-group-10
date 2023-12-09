const db = require('../../database/db');

const externalDeductions = [];

function loadExternalDeductions() {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM externalDeduction';

    db.all(sql, [], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        rows.forEach((row) => externalDeductions.push(row));
        resolve();
      }
    });
  });
}

function getAllExternalDeductions() {
  return externalDeductions;
}

function addNewExternalDeduction(newExternalDeduction) {
  return externalDeductions.push(newExternalDeduction);
}

module.exports = {
  loadExternalDeductions,
  getAllExternalDeductions,
  addNewExternalDeduction
};
