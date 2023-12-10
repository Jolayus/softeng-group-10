const db = require('../../../database/db');

const {
  getAllTripRates,
  getTripRate,
  getTripRateById,
  addNewTripRate,
  removeTripRate,
  loadTripRates
} = require('../../models/triprates.model');

function httpGetAllTripRates(req, res) {
  return res.status(200).json(getAllTripRates());
}

// CREATE NEW TRIP RATES
function httpPostNewTripRate(req, res) {
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
      addNewTripRate(newTripRates);
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
}

function httpDeleteTripRate(req, res) {
  const { branch, province, city } = req.body;

  if (!branch || !province || !city) {
    return res.status(400).json({ error: 'Invalid Input' });
  }

  const promise = new Promise((resolve, reject) => {
    const sql = `SELECT * FROM triprates WHERE triprates.branch="${branch}" AND triprates.province="${province}" AND triprates.city="${city}"`;
    let removedTripRates;

    db.all(sql, [], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        removedTripRates = rows.find((row) => {
          return (
            row.branch === branch &&
            row.province === province &&
            row.city === city
          );
        });

        if (removedTripRates === undefined) {
          return reject('Trip rate does not exist');
        }

        const { id } = removedTripRates;

        removeTripRate(id);
        removeTripRateFromDatabase(id);
        resolve(removedTripRates);
      }
    });
  });

  promise
    .then((employee) => {
      return res.status(200).json(employee);
    })
    .catch((err) => {
      return res.status(500).json({ error: err });
    });
}

// UPDATE trip rates
function httpEditTripRate(req, res) {
  const {
    branch,
    province,
    city,
    auv,
    four_wheeler,
    six_wheeler_elf,
    six_wheeler_forward,
    ten_wheeler
  } = req.body;

  const updatedTripRate = getTripRate(branch, province, city);

  updatedTripRate.auv = auv;
  updatedTripRate.four_wheeler = four_wheeler;
  updatedTripRate.six_wheeler_elf = six_wheeler_elf;
  updatedTripRate.six_wheeler_forward = six_wheeler_forward;
  updatedTripRate.ten_wheeler = ten_wheeler;

  const sql = `UPDATE triprates SET auv=?, four_wheeler=?, six_wheeler_elf=?, six_wheeler_forward=?, ten_wheeler=? WHERE triprates.branch="${branch}" AND triprates.province="${province}" AND triprates.city="${city}"`;

  db.run(
    sql,
    [auv, four_wheeler, six_wheeler_elf, six_wheeler_forward, ten_wheeler],
    (err) => {
      if (err) {
        return res.status(500).json({ error: err });
      }
    }
  );

  loadTripRates();
  return res.status(200).json(updatedTripRate);
}

function httpEditClientName(req, res) {
  const { newName, prevName } = req.body;

  if (!newName || !prevName) {
    return res.status(400).json({ error: 'Invalid inputs' });
  }

  const sql = 'UPDATE triprates SET client_name=? WHERE client_name=?';

  db.run(sql, [newName, prevName], (err) => {
    if (err) {
      return res.status(500).json({ error: err });
    }
  });

  loadTripRates();
}

// DELETE EMPLOYEE FROM THE DATABASE BY ID
function removeTripRateFromDatabase(id) {
  const sql = `DELETE FROM triprates WHERE triprates.id=${id}`;
  db.run(sql, [], (err) => {
    if (err) {
      console.log(err);
    }
  });
}

module.exports = {
  httpGetAllTripRates,
  httpPostNewTripRate,
  httpDeleteTripRate,
  httpEditTripRate,
  httpEditClientName
};
