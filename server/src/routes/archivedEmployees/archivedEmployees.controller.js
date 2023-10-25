const db = require('../../../database/db');

const {
  getAllArchivedEmployees,
  removeArchivedEmployee
} = require('../../models/archivedEmployees.model');

function httpGetAllArchivedEmployees(req, res) {
  return res.status(200).json(getAllArchivedEmployees());
}

function httpRecoverEmployee(req, res) {
  const { id } = req.body;

  if (id === undefined || id <= 0) {
    return res.status(400).json({ error: 'Invalid id' });
  }

  const promise = new Promise((resolve, reject) => {
    const sql = `SELECT * FROM archivedEmployee WHERE archivedEmployee.id=${id}`;
    let recoveredArchivedEmployee;

    db.all(sql, [], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        recoveredArchivedEmployee = rows.find((row) => row.id === id);

        if (recoveredArchivedEmployee === undefined) {
          return reject('id does not exist');
        }

        // Remove archived employee from archivedEmployee model
        removeArchivedEmployee(recoveredArchivedEmployee.id);

        // Remove archived employee from archivedEmployee database
        removeEmployeeFromArchivedEmployeeTable(id);

        // Resolve the recovered archived employee
        resolve(recoveredArchivedEmployee);
      }
    });
  });

  promise
    .then((recoveredArchivedEmployee) => {
      res.status(200).json(recoveredArchivedEmployee);
    })
    .catch((err) => {
      return res.status(500).json({ error: err });
    });
}

function removeEmployeeFromArchivedEmployeeTable(id) {
  const sql = `DELETE FROM archivedEmployee WHERE archivedEmployee.id=${id}`;
  db.run(sql, [], (err) => {
    if (err) {
      console.log(err);
    }
  });
}

// DELETE ARCHIVED EMPLOYEE
function httpDeleteArchivedEmployee(req, res) {
  const { id } = req.body;

  if (id === undefined || id <= 0) {
    return res.status(400).json({ error: 'Invalid id' });
  }

  const promise = new Promise((resolve, reject) => {
    const sql = `SELECT * FROM archivedEmployee WHERE archivedEmployee.id=${id}`;
    let deletedArchivedEmployee;

    db.all(sql, [], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        deletedArchivedEmployee = rows.find((row) => row.id === id);

        if (deletedArchivedEmployee === undefined) {
          return reject('id does not exist');
        }

        removeArchivedEmployee(deletedArchivedEmployee.id);
        removeEmployeeFromArchivedEmployeeTable(deletedArchivedEmployee.id);
        resolve(deletedArchivedEmployee);
      }
    });
  });

  promise
    .then((deletedArchivedEmployee) => {
      res.status(200).json(deletedArchivedEmployee);
    })
    .catch((err) => {
      return res.status(500).json({ error: err });
    });
}

module.exports = {
  httpGetAllArchivedEmployees,
  httpRecoverEmployee,
  httpDeleteArchivedEmployee
};
