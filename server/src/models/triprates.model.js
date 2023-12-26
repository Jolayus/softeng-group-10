const db = require('../../database/db');

const tripRates = [];

function loadTripRates() {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM triprate';

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

function getTripRate(branch, province, city) {
  return tripRates.find((tripRate) => (
    tripRate.branch === branch &&
    tripRate.province === province &&
    tripRate.city === city
  ));
}

function addNewTripRate(newTripRate) {
  return tripRates.push(newTripRate);
}

function removeTripRate(tripRateId) {
  const idx = tripRates.findIndex((tripRate) => tripRate.id === tripRateId);
  return tripRates.splice(idx, 1)[0];
}

module.exports = {
  loadTripRates,
  getAllTripRates,
  getTripRate,
  addNewTripRate,
  removeTripRate
};
