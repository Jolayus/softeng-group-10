const db = require('../../../database/db');

const {
  getAllTripRates,
  setTripRatesModel,
  getTripRatesById
} = require('../../models/triprates.model');

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

function httpDeleteTripRates(req, res) {
  const { id } = req.body;

  if (id === undefined || id <= 0) {
    return res.status(400).json({ error: 'invalid id' });
  }

  const promise = new Promise((resolve, reject) => {
    const sql = `SELECT * FROM triprates WHERE triprates.id=${id}`;
    let removedTripRates;

    db.all(sql, [], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        removedTripRates = rows.find((row) => row.id === id);

        if (removedTripRates === undefined) {
          return reject('id does not exist');
        }

        setTripRatesModel(
          getAllTripRates().filter(
            (triprates) => triprates.id !== removedTripRates.id
          )
        );

        removeTripRatesById(id);
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
function httpEditTripRates(req, res) {
  const {
    id,
    auv,
    four_wheeler,
    six_wheeler_elf,
    six_wheeler_forward,
    ten_wheeler
  } = req.body;

  const updatedTripRate = getTripRatesById(id);

  updatedTripRate.auv = auv;
  updatedTripRate.four_wheeler = four_wheeler;
  updatedTripRate.six_wheeler_elf = six_wheeler_elf;
  updatedTripRate.six_wheeler_forward = six_wheeler_forward;
  updatedTripRate.ten_wheeler = ten_wheeler;

  const sql = `UPDATE triprates SET auv=?, four_wheeler=?, six_wheeler_elf=?, six_wheeler_forward=?, ten_wheeler=? WHERE triprates.id=?`;

  db.run(
    sql,
    [auv, four_wheeler, six_wheeler_elf, six_wheeler_forward, ten_wheeler, id],
    (err) => {
      if (err) {
        return res.status(500).json({ error: err });
      }
    }
  );

  return res.status(200).json(updatedTripRate);
}

// DELETE EMPLOYEE FROM THE DATABASE BY ID
function removeTripRatesById(id) {
  const sql = `DELETE FROM triprates WHERE triprates.id=${id}`;
  db.run(sql, [], (err) => {
    if (err) {
      console.log(err);
    }
  });
}

module.exports = {
  httpGetAllTripRates,
  httpPostNewTripRates,
  httpDeleteTripRates,
  httpEditTripRates
};
