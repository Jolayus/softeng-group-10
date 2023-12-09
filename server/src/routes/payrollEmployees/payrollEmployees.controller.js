const db = require('../../../database/db');

const {
  getAllPayrollEmployees,
  addNewPayrollEmployee
} = require('../../models/payrollEmployees.model');

function httpGetAllPayrollEmployees(req, res) {
  return res.status(200).json(getAllPayrollEmployees());
}

function httpPostNewPayrollEmployee(req, res) {
  const {
    batchCodeId,
    employeeId,
    salaryId,
    deductionId,
    type
  } = req.body;

  const promise = new Promise((resolve, reject) => {
    const sql = `INSERT INTO payrollEmployee (batchCodeId, employeeId, salaryId, deductionId, type) VALUES (?, ?, ?, ?, ?)`;
    db.run(
      sql,
      [
        batchCodeId,
        employeeId,
        salaryId,
        deductionId,
        type
      ],
      (err) => {
        if (err) {
          reject(err);
        } else {
          const sql = `SELECT * FROM payrollEmployee ORDER BY id DESC LIMIT 1`;
          db.all(sql, [], (err, rows) => {
            if (err) {
              reject(err);
            } else {
              resolve(rows[0]);
            }
          });
        }
      }
    );
  });

  promise
    .then((newPayrollEmployee) => {
      addNewPayrollEmployee(newPayrollEmployee);
      res.status(201).json(newPayrollEmployee);
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
}

module.exports = {
  httpGetAllPayrollEmployees,
  httpPostNewPayrollEmployee
};
