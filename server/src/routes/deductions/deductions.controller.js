const db = require('../../../database/db');

const {
  getAllDeductions,
  addNewDeduction,
  editDeduction
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

module.exports = {
  httpGetAllDeductions,
  httpPostNewDeduction,
  httpEditSalary
};
