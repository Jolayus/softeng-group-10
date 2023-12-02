const db = require('../../../database/db');
const {
  getAllBillingTrips,
  addNewBillingTrip,
  deleteBillingTrip
} = require('../../models/billingTrips.model');

function httpGetAllBillingTrips(req, res) {
  return res.status(200).json(getAllBillingTrips());
}

function httpPostBillingTrip(req, res) {
  const { billingId, date, shipmentNumber, SPONumber, fee } = req.body;

  if (!billingId || !date || !shipmentNumber || !SPONumber || !fee) {
    return res.status(400).json({ error: 'Invalid input' });
  }

  const promise = new Promise((resolve, reject) => {
    const sql = `INSERT INTO billingTrips (billingId, date, shipmentNumber, SPONumber, fee) VALUES (?, ?, ?, ?, ?)`;
    db.run(sql, [billingId, date, shipmentNumber, SPONumber, fee], (err) => {
      if (err) {
        reject(err);
      } else {
        const sql = `SELECT * FROM billingTrips ORDER BY id DESC LIMIT 1`;
        db.all(sql, [], (err, rows) => {
          if (err) {
            reject(err);
          } else {
            resolve(rows[0]);
          }
        });
      }
    });
  });

  promise
    .then((newBillingTrip) => {
      addNewBillingTrip(newBillingTrip);
      res.status(201).json(newBillingTrip);
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
}

function httpDeleteBillingTrips(req, res) {
  const { billingId } = req.body;

  if (!billingId) {
    return res.status(400).json({ error: 'Invalid input' });
  }

  console.log(billingId)

  const promise = new Promise((resolve, reject) => {
    const sql = `SELECT * FROM billingTrips WHERE billingTrips.billingId=${billingId}`;
    let deletedBillingTrips = [];

    db.all(sql, [], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        rows.find((row) => {
          if (row.billingId === billingId) {
            deletedBillingTrips.push(row);
          }
        });

        deletedBillingTrips.forEach((deletedBillingTrip) => {
          deleteBillingTrip(deletedBillingTrip.billingId);
        });
        removeBillingTripsFromDatabase(billingId);
        resolve(deletedBillingTrips);
      }
    });
  });

  promise
    .then((client) => {
      return res.status(200).json(client);
    })
    .catch((err) => {
      return res.status(500).json({ error: err });
    });
}

function removeBillingTripsFromDatabase(billingId) {
  const sql = `DELETE FROM billingTrips WHERE billingTrips.billingId=${billingId}`;
  db.run(sql, [], (err) => {
    if (err) {
      console.log(err);
    }
  });
}

module.exports = {
  httpGetAllBillingTrips,
  httpPostBillingTrip,
  httpDeleteBillingTrips
};
