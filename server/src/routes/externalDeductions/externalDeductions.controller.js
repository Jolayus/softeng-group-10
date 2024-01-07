const db = require('../../../database/db');

const {
  getAllExternalDeductions,
  addNewExternalDeduction,
  editExternalDeduction,
  removeExternalDeductionsByEmployeeId
} = require('../../models/externalDeductions.model');

function httpGetAllExternalDeductions(req, res) {
  return res.status(200).json(getAllExternalDeductions());
}

function httpPostNewExternalDeduction(req, res) {
  const {
    employeeId,
    cashAdvance,
    marineInsuranceFee,
    uniform,
    penalties,
    total
  } = req.body;

  const promise = new Promise((resolve, reject) => {
    const sql = `INSERT INTO externalDeduction (employeeId, cashAdvance, marineInsuranceFee, uniform, penalties, total) VALUES (?, ?, ?, ?, ?, ?)`;
    db.run(
      sql,
      [employeeId, cashAdvance, marineInsuranceFee, uniform, penalties, total],
      (err) => {
        if (err) {
          reject(err);
        } else {
          const sql = `SELECT * FROM externalDeduction ORDER BY id DESC LIMIT 1`;
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
    .then((newExternalDeduction) => {
      addNewExternalDeduction(newExternalDeduction);
      res.status(201).json(newExternalDeduction);
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
}

function httpEditExternalDeduction(req, res) {
  const { cashAdvance, marineInsuranceFee, uniform, penalties, total, id } =
    req.body;

  const updatedDeduction = editExternalDeduction(req.body);

  const sql = `UPDATE externalDeduction SET cashAdvance=?, marineInsuranceFee=?, uniform=?, penalties=?, total=? WHERE externalDeduction.id=?`;
  db.run(
    sql,
    [cashAdvance, marineInsuranceFee, uniform, penalties, total, id],
    (err) => {
      if (err) {
        return res.status(500).json({ error: err });
      }
    }
  );
  return res.status(200).json(updatedDeduction);
}

function httpDeleteExternalDeductions(req, res) {
  const { employeeId } = req.body;

  if (employeeId < 0 || employeeId === undefined || employeeId === null) {
    res.status(400).json({ error: 'Invalid employeeId' });
    return;
  }

  const sql =
    'DELETE FROM externalDeduction WHERE externalDeduction.employeeId = ?';
  db.run(sql, [employeeId], (err) => {
    if (err) {
      res.status(500).json({
        error:
          'Cannot delete externalDeductions row with the provided employeeId'
      });
      return;
    }

    res.status(200).json({
      message: `Successfully deleted externalDeductions row with the employeeId: ${employeeId}`
    });
    removeExternalDeductionsByEmployeeId(employeeId);
  });
}

module.exports = {
  httpGetAllExternalDeductions,
  httpPostNewExternalDeduction,
  httpEditExternalDeduction,
  httpDeleteExternalDeductions
};
