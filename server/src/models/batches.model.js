const db = require('../../database/db');

const batches = [];

function loadBatches() {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM batch';

    db.all(sql, [], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        rows.forEach((row) => batches.push(row));
        resolve();
      }
    });
  });
}

function getAllBatches() {
  return batches;
}

function addNewBatch(newBatch) {
  return batches.push(newBatch);
}

function removeBatchByEmployeeId(employeeId) {
  const idx = batches.findIndex((batch) => (batch.employeeId = employeeId));
  batches.splice(idx, 1);
}

module.exports = {
  loadBatches,
  getAllBatches,
  addNewBatch,
  removeBatchByEmployeeId
};
