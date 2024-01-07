const db = require('../../../database/db');

const {
  getAllExternalSalaries,
  addNewExternalSalary,
  editExternalSalary,
  removeExternalSalariesByEmployeId
} = require('../../models/externalSalaries.model');

function httpGetAllExternalSalaries(req, res) {
  return res.status(200).json(getAllExternalSalaries());
}

function httpPostNewExternalSalary(req, res) {
  const {
    employeeId,
    noOfTrips,
    clientTripRates,
    totalAmountOfTrips,
    dropRate,
    tollFee,
    passway,
    others,
    total
  } = req.body;

  const promise = new Promise((resolve, reject) => {
    const sql = `INSERT INTO externalSalary (employeeId, noOfTrips, clientTripRates, totalAmountOfTrips, dropRate, tollFee, passway, others, total) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    db.run(
      sql,
      [
        employeeId,
        noOfTrips,
        clientTripRates,
        totalAmountOfTrips,
        dropRate,
        tollFee,
        passway,
        others,
        total
      ],
      (err) => {
        if (err) {
          reject(err);
        } else {
          const sql = `SELECT * FROM externalSalary ORDER BY id DESC LIMIT 1`;
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
    .then((newExternalSalary) => {
      addNewExternalSalary(newExternalSalary);
      res.status(201).json(newExternalSalary);
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
}

function httpEditExternalSalary(req, res) {
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
  } = req.body;

  const updatedSalary = editExternalSalary(req.body);

  const sql = `UPDATE externalSalary SET noOfTrips=?, clientTripRates=?, totalAmountOfTrips=?, dropRate=?, tollFee=?, passway=?, others=?, total=? WHERE externalSalary.id=?`;
  db.run(
    sql,
    [
      noOfTrips,
      clientTripRates,
      totalAmountOfTrips,
      dropRate,
      tollFee,
      passway,
      others,
      total,
      id
    ],
    (err) => {
      if (err) {
        return res.status(500).json({ error: err });
      }
    }
  );
  return res.status(200).json(updatedSalary);
}

function httpDeleteExternalSalaries(req, res) {
  const { employeeId } = req.body;

  if (employeeId < 0 || employeeId === undefined || employeeId === null) {
    res.status(400).json({ error: 'Invalid employeeId' });
    return;
  }

  const sql = 'DELETE FROM externalSalary WHERE externalSalary.employeeId = ?';
  db.run(sql, [employeeId], (err) => {
    if (err) {
      res.status(500).json({ error: 'Cannot delete externalSalary with the provided employeeId' });
      return;
    }

    res.status(200).json({ message: `Successfully deleted externalSalaries with the employeeId: ${employeeId}` });
    removeExternalSalariesByEmployeId(employeeId);
  });
}

module.exports = {
  httpGetAllExternalSalaries,
  httpPostNewExternalSalary,
  httpEditExternalSalary,
  httpDeleteExternalSalaries
};
