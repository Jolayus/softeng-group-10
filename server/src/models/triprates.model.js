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

module.exports = {
  loadTripRates,
  getAllTripRates,
  getTripRateById
};
