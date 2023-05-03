const db = require('../../database/db');

const tripRates = [];

function loadTripRates() {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM triprates';

    db.all(sql, [], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        rows.forEach((row) => tripRates.push(row));
        resolve();
      }
    });
  });
}

function getAllTripRates() {
  return tripRates;
}

function getTripRateById(id) {
  return tripRates.find((tripRate) => tripRate.id === id);
}

function addNewTripRate(newTripRate) {
  return tripRates.push(newTripRate);
}

function removeTripRate(tripRateId) {
  const idx = tripRates.findIndex((tripRate) => tripRate.id === tripRateId);
  return tripRates.splice(idx, 1);
}

module.exports = {
  loadTripRates,
  getAllTripRates,
  getTripRateById,
  addNewTripRate,
  removeTripRate
};
