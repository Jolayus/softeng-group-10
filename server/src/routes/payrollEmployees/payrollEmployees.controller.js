const db = require('../../../database/db');

const {
  getAllPayrollEmployees,
  addNewPayrollEmployee,
  removePayrollEmployeeByEmployeeId
} = require('../../models/payrollEmployees.model');

function httpGetAllPayrollEmployees(req, res) {
  return res.status(200).json(getAllPayrollEmployees());
}

function httpPostNewPayrollEmployee(req, res) {
  const { batchCodeId, employeeId, salaryId, deductionId, type } = req.body;

  const promise = new Promise((resolve, reject) => {
    const sql = `INSERT INTO payrollEmployee (batchCodeId, employeeId, salaryId, deductionId, type) VALUES (?, ?, ?, ?, ?)`;
    db.run(
      sql,
      [batchCodeId, employeeId, salaryId, deductionId, type],
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

async function httpDeletePayrollEmployee(req, res) {
  const { employeeId } = req.body;

  if (employeeId < 0 || employeeId === undefined || employeeId === null) {
    res.status(400).json({ error: 'Invalid employeeId' });
    return;
  }

  const sql =
    'DELETE FROM payrollEmployee WHERE payrollEmployee.employeeId = ?';
  db.run(sql, [employeeId], (err) => {
    if (err) {
      res.status(500).json({
        error: 'Cannot delete payrollEmployee row with the provided employeeId'
      });
      return;
    }

    res.status(200).json({
      message: `Successfully deleted all payrollEmployees row with the employeeId: ${employeeId}`
    });
    removePayrollEmployeeByEmployeeId(employeeId);
  });
}

module.exports = {
  httpGetAllPayrollEmployees,
  httpPostNewPayrollEmployee,
  httpDeletePayrollEmployee
};
