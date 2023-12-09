const db = require('../../../database/db');

const {
  getAllDeductions,
  addNewDeduction
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

module.exports = {
  httpGetAllDeductions,
  httpPostNewDeduction
};
