const db = require('../../database/db');

const billings = [];

function loadBillings() {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM billings';

    db.all(sql, [], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        rows.forEach((row) => billings.push(row));
        resolve();
      }
    });
  });
}

function getAllBillings() {
  return billings;
}

function addNewBilling(newBilling) {
  return billings.push(newBilling);
}

module.exports = {
  loadBillings,
  getAllBillings,
  addNewBilling
};
