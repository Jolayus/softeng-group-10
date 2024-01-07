const db = require('../../../database/db');

const {
  getAllDeductions,
  addNewDeduction,
  editDeduction,
  removeDeductionsByEmployeeId
} = require('../../models/deductions.model');

function httpGetAllDeductions(req, res) {
  return res.status(200).json(getAllDeductions());
}

function httpPostNewDeduction(req, res) {
  const {
    employeeId,
    cashAdvance,
    pagibig,
    SSS,
    philhealth,
    late,
    damages,
    others,
    total
  } = req.body;

  const promise = new Promise((resolve, reject) => {
    const sql = `INSERT INTO deduction (employeeId, cashAdvance, pagibig, SSS, philhealth, late, damages, others, total) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    db.run(
      sql,
      [
        employeeId,
        cashAdvance,
        pagibig,
        SSS,
        philhealth,
        late,
        damages,
        others,
        total
      ],
      (err) => {
        if (err) {
          reject(err);
        } else {
          const sql = `SELECT * FROM deduction ORDER BY id DESC LIMIT 1`;
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
    .then((newDeduction) => {
      addNewDeduction(newDeduction);
      res.status(201).json(newDeduction);
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
}

function httpEditSalary(req, res) {
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
  } = req.body;

  const updatedDeduction = editDeduction(req.body);

  const sql = `UPDATE deduction SET cashAdvance=?, pagibig=?, SSS=?, philhealth=?, late=?, damages=?, others=?, total=? WHERE deduction.id=?`;
  db.run(
    sql,
    [cashAdvance, pagibig, SSS, philhealth, late, damages, others, total, id],
    (err) => {
      if (err) {
        return res.status(500).json({ error: err });
      }
    }
  );
  return res.status(200).json(updatedDeduction);
}

function httpDeleteDeductions(req, res) {
  const { employeeId } = req.body;

  if (employeeId < 0 || employeeId === undefined || employeeId === null) {
    res.status(400).json({ error: 'Invalid employeeId' });
    return;
  }

  const sql = 'DELETE FROM deduction WHERE deduction.employeeId = ?';
  db.run(sql, [employeeId], (err) => {
    if (err) {
      res
        .status(500)
        .json({
          error: 'Cannot delete deduction row with the provided employeeId'
        });
      return;
    }

    res
      .status(200)
      .json({
        message: `Successfully deleted deduction row/s with the employeeId: ${employeeId}`
      });
    removeDeductionsByEmployeeId(employeeId);
  });
}

module.exports = {
  httpGetAllDeductions,
  httpPostNewDeduction,
  httpEditSalary,
  httpDeleteDeductions
};
