const db = require('../../database/db');

const archivedEmployees = [];

function loadArchivedEmployees() {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM archivedEmployee';

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

function removeArchivedEmployee(archivedEmployeeId) {
  const idx = archivedEmployees.findIndex((archivedEmployee) => archivedEmployee.id === archivedEmployeeId);
  return archivedEmployees.splice(idx, 1);
} 

module.exports = {
  loadArchivedEmployees,
  getAllArchivedEmployees,
  addNewArchivedEmployee,
  removeArchivedEmployee
}