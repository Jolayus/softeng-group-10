const db = require('../../database/db');

const billingTrips = [];

function loadBillingTrips() {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM billingTrips';

    db.all(sql, [], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        rows.forEach((row) => billingTrips.push(row));
        resolve();
      }
    });
  });
}

function getAllBillingTrips() {
  return billingTrips;
}

function getBillingTripById(id) {
  return billingTrips.find((billingTrip) => billingTrip.id === id);
}

function addNewBillingTrip(newBillingTrip) {
  return billingTrips.push(newBillingTrip);
}

function deleteBillingTrip(billingId) {
  const idx = billingTrips.findIndex((billingTrip) => billingTrip.billingId === billingId);
  billingTrips.splice(idx, 1);
}

module.exports = {
  loadBillingTrips,
  getAllBillingTrips,
  getBillingTripById,
  addNewBillingTrip,
  deleteBillingTrip
};
