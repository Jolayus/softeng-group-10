const db = require('../../../database/db');

const { getAllClients } = require('../../models/clients.model');

function httpGetAllClients(req, res) {
  return res.status(200).json(getAllClients());
}

// CREATE NEW EMPLOYEE
function httpPostNewClient(req, res) {
  const { company_name, contact_person, contact_number, address } = req.body;

  if (!company_name || !contact_person || !contact_number || !address) {
    return res.status(400).json({ error: 'Invalid input' });
  }

  const promise = new Promise((resolve, reject) => {
    const sql = `INSERT INTO clients (company_name, contact_person, contact_number, address) VALUES (?, ?, ?, ?)`;
    db.run(sql, [company_name, contact_person, contact_number, address], (err) => {
      if (err) {
        reject(err);
      } else {
        const sql = `SELECT * FROM clients ORDER BY id DESC LIMIT 1`;
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
    .then((newClient) => {
      res.status(201).json(newClient);
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
}

module.exports = {
  httpGetAllClients,
  httpPostNewClient
};
