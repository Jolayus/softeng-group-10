const db = require('../../../database/db');

const { getAllTripRates } = require('../../models/triprates.model');

function httpGetAllTripRates(req, res) {
  return res.status(200).json(getAllTripRates());
}

// CREATE NEW TRIP RATES
function httpPostNewTripRates(req, res) {
  const {
    client_name,
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
      'INSERT INTO triprates (client_name, branch, province, city, auv, four_wheeler, six_wheeler_elf, six_wheeler_forward, ten_wheeler) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';

    db.run(
      sql,
      [
        client_name,
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
          const sql = 'SELECT * FROM triprates ORDER BY id DESC LIMIT 1';
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
    .then((newTripRates) => {
      res.status(201).json(newTripRates);
      getAllTripRates().push(newTripRates);
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
}

module.exports = { httpGetAllTripRates, httpPostNewTripRates };
