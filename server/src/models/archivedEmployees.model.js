const db = require('../../database/db');

const archivedEmployees = [];

function loadArchivedEmployees() {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM archivedEmployees';

    db.all(sql, [], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        rows.forEach((row) => archivedEmployees.push(row));
        resolve();
      }
    });
  });
}

function getAllArchivedEmployees() {
  return archivedEmployees;
}

function addNewArchivedEmployee(newArchivedEmployee) {
  return archivedEmployees.push(newArchivedEmployee);
}

module.exports = {
  loadArchivedEmployees,
  getAllArchivedEmployees,
  addNewArchivedEmployee
}