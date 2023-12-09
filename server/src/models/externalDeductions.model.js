const db = require('../../database/db');

const externalDeductions = [];

function loadExternalDeductions() {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM externalDeduction';

    db.all(sql, [], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        rows.forEach((row) => externalDeductions.push(row));
        resolve();
      }
    });
  });
}

function getAllExternalDeductions() {
  return externalDeductions;
}

function addNewExternalDeduction(newExternalDeduction) {
  return externalDeductions.push(newExternalDeduction);
}

function getExternalDeductionById(id) {
  return externalDeductions.find((deduction) => deduction.id === id);
}

function editExternalDeduction(newDetails) {
  const {
    cashAdvance,
    marineInsuranceFee,
    uniform,
    penalties,
    total,
    id
  } = newDetails;

  const updatedDeduction = getExternalDeductionById(id);
  updatedDeduction.cashAdvance = cashAdvance;
  updatedDeduction.marineInsuranceFee = marineInsuranceFee;
  updatedDeduction.uniform = uniform;
  updatedDeduction.penalties = penalties;
  updatedDeduction.total = total;

  return updatedDeduction;
}

module.exports = {
  loadExternalDeductions,
  getAllExternalDeductions,
  addNewExternalDeduction,
  editExternalDeduction
};
