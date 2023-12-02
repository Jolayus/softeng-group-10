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

function deleteBilling(billingId) {
  const idx = billings.findIndex((billing) => billing.id === billingId);
  billings.splice(idx, 1);
}

module.exports = {
  loadBillings,
  getAllBillings,
  addNewBilling,
  deleteBilling
};
