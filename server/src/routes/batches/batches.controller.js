const db = require('../../../database/db');

const {
  getAllBatches,
  addNewBatch,
  removeBatchByEmployeeId
} = require('../../models/batches.model');

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

async function httpGetNextId(req, res) {
  const nextID = await getNextId();
  res.status(200).json({ nextID });
}

async function getNextId() {
  const promise = new Promise((resolve, reject) => {
    const tableName = 'batch';
    const sql =
      'SELECT (seq + 1) AS nextID FROM sqlite_sequence WHERE sqlite_sequence.name = ?';
    db.get(sql, [tableName], (err, rows) => {
      const { nextID } = rows;
      resolve(nextID);
    });
  });

  return await promise;
}

function httpDeleteBatch(req, res) {
  const { employeeId } = req.body;

  if (employeeId < 0 || employeeId === undefined || employeeId === null) {
    res.status(400).json({ error: 'Invalid employeeId' });
    return;
  }

  const sql = 'DELETE FROM batch WHERE batch.employeeId = ?';
  db.run(sql, [employeeId], (err) => {
    if (err) {
      res
        .status(400)
        .json({ error: 'Cannot delete batch with the given employeeId' });
      return;
    }

    res.status(200).json({
      message: `Successfully delete the batch row with the employeeId: ${employeeId}`
    });
    removeBatchByEmployeeId(employeeId);
  });
}

module.exports = {
  httpGetAllBatches,
  httpPostNewBatch,
  httpGetNextId,
  httpDeleteBatch
};
