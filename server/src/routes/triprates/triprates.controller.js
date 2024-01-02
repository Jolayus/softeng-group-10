const db = require('../../../database/db');

const {
  getAllTripRates,
  addNewTripRate,
  removeTripRate
} = require('../../models/triprates.model');

function httpGetAllTripRates(req, res) {
  return res.status(200).json(getAllTripRates());
}

// CREATE NEW TRIP RATES
function httpPostNewTripRate(req, res) {
  const {
    clientId,
    date_created,
    branch,
    province,
    city,
    auv,
    four_wheeler,
    six_wheeler_elf,
    six_wheeler_forward,
    ten_wheeler
  } = req.body;

  const promise = new Promise((resolve, reject) => {
    const sql =
      'INSERT INTO triprate (clientId, date_created, branch, province, city, auv, four_wheeler, six_wheeler_elf, six_wheeler_forward, ten_wheeler) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
    db.run(
      sql,
      [
        clientId,
        date_created,
        branch,
        province,
        city,
        auv,
        four_wheeler,
        six_wheeler_elf,
        six_wheeler_forward,
        ten_wheeler
      ],
      (err) => {
        if (err) {
          reject(err);
        } else {
          const sql = `SELECT * FROM triprate ORDER BY id DESC LIMIT 1`;
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

  return promise
    .then((newTripRate) => {
      res.status(201).json(newTripRate);
      addNewTripRate(newTripRate);
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
}

function httpDeleteTripRate(req, res) {
  const { id } = req.body;

  if (id === undefined) {
    return res.status(400).json({ error: 'Invalid ID' });
  }

  const promise = new Promise((resolve, reject) => {
    const sql = 'DELETE FROM triprate WHERE triprate.id = ?';
    db.run(sql, [id], (err) => {
      if (err) {
        reject(err);
      } else {
        resolve(removeTripRate(id));
      }
    });
  });

  promise
    .then((removedTripRate) => {
      res.status(200).json(removedTripRate);
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
}

module.exports = {
  httpGetAllTripRates,
  httpPostNewTripRate,
  httpDeleteTripRate,
};
