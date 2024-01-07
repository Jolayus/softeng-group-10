const db = require('../../database/db');

let salaries = [];

function loadSalaries() {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM salary';

    db.all(sql, [], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        rows.forEach((row) => salaries.push(row));
        resolve();
      }
    });
  });
}

function getAllSalaries() {
  return salaries;
}

function addNewSalary(newSalary) {
  return salaries.push(newSalary);
}

function getSalaryById(id) {
  return salaries.find((salary) => salary.id === id);
}

function editSalary(newDetails) {
  const {
    employeeId,
    basicSalary,
    allowanceSalary,
    dailyRate,
    dailyAllowance,
    daysOfWork,
    semiBasicSalary,
    semiAllowanceSalary,
    serviceFee,
    overtimePay,
    others,
    total,
    id
  } = newDetails;

  const updatedSalary = getSalaryById(id);

  updatedSalary.basicSalary = basicSalary;
  updatedSalary.allowanceSalary = allowanceSalary;
  updatedSalary.dailyRate = dailyRate;
  updatedSalary.dailyAllowance = dailyAllowance;
  updatedSalary.daysOfWork = daysOfWork;
  updatedSalary.semiBasicSalary = semiBasicSalary;
  updatedSalary.semiAllowanceSalary = semiAllowanceSalary;
  updatedSalary.serviceFee = serviceFee;
  updatedSalary.overtimePay = overtimePay;
  updatedSalary.others = others;
  updatedSalary.total = total;

  return updatedSalary;
}

function removeSalaryByEmployeeId(employeeId) {
  const filteredSalaries = salaries.filter(
    (salary) => salary.employeeId !== employeeId
  );
  salaries = filteredSalaries;
}

module.exports = {
  loadSalaries,
  getAllSalaries,
  addNewSalary,
  editSalary,
  removeSalaryByEmployeeId
};
