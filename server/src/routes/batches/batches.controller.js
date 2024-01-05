const db = require('../../../database/db');

const { getAllBatches, addNewBatch } = require('../../models/batches.model');

function httpGetAllBatches(req, res) {
  return res.status(200).json(getAllBatches());
}

function httpPostNewBatch(req, res) {
  const { batchCode, batchPeriodCoverFrom, batchPeriodCoverTo, employeeId } =
    req.body;

  if (
    !batchCode ||
    !batchPeriodCoverFrom ||
    !batchPeriodCoverTo ||
    !employeeId
  ) {
    return res.status(400).json({ error: 'Invalid input' });
  }

  const promise = new Promise((resolve, reject) => {
    const sql = `INSERT INTO batch (batchCode, batchPeriodCoverFrom, batchPeriodCoverTo, employeeId) VALUES (?, ?, ?, ?)`;
    db.run(
      sql,
      [batchCode, batchPeriodCoverFrom, batchPeriodCoverTo, employeeId],
      (err) => {
        if (err) {
          reject(err);
        } else {
          const sql = `SELECT * FROM batch ORDER BY id DESC LIMIT 1`;
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
    .then((newBatch) => {
      addNewBatch(newBatch);
      res.status(201).json(newBatch);
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
}

function httpGetNextId(req, res) {
  const sql = 'SELECT MAX(id) + 1 AS nextID FROM batch';
  db.get(sql, (err, row) => {
    if (err) {
      res.status(500).json({ error: 'Cannot get the nextId' });
      return;
    }

    const nextID = row ? row.nextID : null;

    if (nextID === null) {
      res.status(500).json({ error: 'Cannot get the nextId' });
      return;
    }

    res.status(200).json({ nextID });
  });
}

module.exports = {
  httpGetAllBatches,
  httpPostNewBatch,
  httpGetNextId
};
