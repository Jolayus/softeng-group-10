const db = require('../../../database/db');

const { getAllSalaries, addNewSalary, editSalary } = require('../../models/salaries.model');

function httpGetAllSalaries(req, res) {
  return res.status(200).json(getAllSalaries());
}

function httpPostNewSalary(req, res) {
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
    total
  } = req.body;

  const promise = new Promise((resolve, reject) => {
    const sql = `INSERT INTO salary (employeeId, basicSalary, allowanceSalary, dailyRate, dailyAllowance, daysOfWork, semiBasicSalary, semiAllowanceSalary, serviceFee, overtimePay, others, total) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    db.run(
      sql,
      [
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
        total
      ],
      (err) => {
        if (err) {
          reject(err);
        } else {
          const sql = `SELECT * FROM salary ORDER BY id DESC LIMIT 1`;
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
    .then((newSalary) => {
      addNewSalary(newSalary);
      res.status(201).json(newSalary);
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
}

function httpEditSalary(req, res) {
  const {
    id,
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
    total
  } = req.body;

  console.log(req.body)
  const updatedSalary = editSalary(req.body);

  const sql = `UPDATE salary SET basicSalary=?, allowanceSalary=?, dailyRate=?, dailyAllowance=?, daysOfWork=?, semiBasicSalary=?, semiAllowanceSalary=?, serviceFee=?, overtimePay=?, others=?, total=? WHERE salary.id=?`;
  db.run(
    sql,
    [
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
    ],
    (err) => {
      if (err) {
        return res.status(500).json({ error: err });
      }
    }
  );
  return res.status(200).json(updatedSalary);
}

module.exports = {
  httpGetAllSalaries,
  httpPostNewSalary,
  httpEditSalary
};
