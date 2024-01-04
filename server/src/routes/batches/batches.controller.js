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
  const sql =
    'INSERT INTO batch (batchCode, batchPeriodCoverFrom, batchPeriodCoverTo) VALUES (?, ?, ?)';
  db.run(sql, ['1', '2024-01-01', '2024-01-02'], function (err) {
    if (err) {
      res.status(500).json({ error: 'Cannot add dummy data to batch table' });
      return;
    }

    const lastID = this.lastID;

    db.run('DELETE FROM batch WHERE batch.id = ?', [lastID], (err) => {
      if (err) {
        res
          .status(500)
          .json({ error: 'Cannot delete dummy data from batch table' });
        return;
      } else {
        res.status(200).json({ nextID: lastID });
      }
    });
  });
}

module.exports = {
  httpGetAllBatches,
  httpPostNewBatch,
  httpGetNextId
};
