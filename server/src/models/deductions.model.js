const db = require('../../database/db');

let deductions = [];

function loadDeductions() {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM deduction';

    db.all(sql, [], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        rows.forEach((row) => deductions.push(row));
        resolve();
      }
    });
  });
}

function getAllDeductions() {
  return deductions;
}

function addNewDeduction(newDeduction) {
  return deductions.push(newDeduction);
}

function getDeductionById(id) {
  return deductions.find((deduction) => deduction.id === id);
}

function editDeduction(newDetails) {
  const {
    cashAdvance,
    pagibig,
    SSS,
    philhealth,
    late,
    damages,
    others,
    total,
    id
  } = newDetails;

  const updatedDeduction = getDeductionById(id);
  console.log(deductions);
  console.log(id);

  updatedDeduction.cashAdvance = cashAdvance;
  updatedDeduction.pagibig = pagibig;
  updatedDeduction.SSS = SSS;
  updatedDeduction.philhealth = philhealth;
  updatedDeduction.late = late;
  updatedDeduction.damages = damages;
  updatedDeduction.others = others;
  updatedDeduction.total = total;

  return updatedDeduction;
}

function removeDeductionsByEmployeeId(employeeId) {
  const filteredDeductions = deductions.filter(
    (deduction) => deduction.employeeId !== employeeId
  );
  deductions = filteredDeductions;
}

module.exports = {
  loadDeductions,
  getAllDeductions,
  addNewDeduction,
  editDeduction,
  removeDeductionsByEmployeeId
};
