const db = require('../../database/db');

let externalSalaries = [];

function loadExternalSalaries() {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM externalSalary';

    db.all(sql, [], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        rows.forEach((row) => externalSalaries.push(row));
        resolve();
      }
    });
  });
}

function getAllExternalSalaries() {
  return externalSalaries;
}

function addNewExternalSalary(newExternalSalary) {
  return externalSalaries.push(newExternalSalary);
}

function getExternalSalaryById(id) {
  return externalSalaries.find((salary) => salary.id === id);
}

function editExternalSalary(newDetails) {
  const {
    noOfTrips,
    clientTripRates,
    totalAmountOfTrips,
    dropRate,
    tollFee,
    passway,
    others,
    total,
    id
  } = newDetails;

  const updatedSalary = getExternalSalaryById(id);
  updatedSalary.noOfTrips = noOfTrips;
  updatedSalary.clientTripRates = clientTripRates;
  updatedSalary.dropRate = dropRate;
  updatedSalary.tollFee = tollFee;
  updatedSalary.passway = passway;
  updatedSalary.others = others;
  updatedSalary.total = total;

  return updatedSalary;
}

function removeExternalSalariesByEmployeId(employeeId) {
  const filteredExternalSalaries = externalSalaries.filter(
    (externalSalary) => externalSalary.employeeId !== employeeId
  );
  externalSalaries = filteredExternalSalaries;
}

module.exports = {
  loadExternalSalaries,
  getAllExternalSalaries,
  addNewExternalSalary,
  editExternalSalary,
  removeExternalSalariesByEmployeId
};
