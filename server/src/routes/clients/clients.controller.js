const db = require('../../../database/db');

const { getAllClients, getClientById, setClientsModel } = require('../../models/clients.model');

function httpGetAllClients(req, res) {
  return res.status(200).json(getAllClients());
}

// CREATE NEW CLIENT
function httpPostNewClient(req, res) {
  const { company_name, contact_person, contact_number, address } = req.body;

  if (!company_name || !contact_person || !contact_number || !address) {
    return res.status(400).json({ error: 'Invalid input' });
  }

  const promise = new Promise((resolve, reject) => {
    const sql = `INSERT INTO clients (company_name, contact_person, contact_number, address) VALUES (?, ?, ?, ?)`;
    db.run(
      sql,
      [company_name, contact_person, contact_number, address],
      (err) => {
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
      }
    );
  });

  promise
    .then((newClient) => {
      res.status(201).json(newClient);
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
}

function httpEditEmployee(req, res) {
  const { id, company_name, contact_person, contact_number, address } =
    req.body;

  const updatedClient = getClientById(id);

  updatedClient.company_name = company_name;
  updatedClient.contact_person = contact_person;
  updatedClient.contact_number = contact_number;
  updatedClient.address = address;

  const sql = `UPDATE clients SET company_name=?, contact_person=?, contact_number=?, address=? WHERE clients.id=?`;

  db.run(
    sql,
    [company_name, contact_person, contact_number, address, id],
    (err) => {
      if (err) {
        return res.status(500).json({ error: err });
      }
    }
  );

  return res.status(200).json(updatedClient);
}

// ARCHIVE EXISTING EMPLOYEE
function httpArchiveClient(req, res) {
  const { id } = req.body;

  if (id === undefined || id <= 0) {
    return res.status(400).json({ error: 'invalid id' });
  }

  const promise = new Promise((resolve, reject) => {
    const sql = `SELECT * FROM clients WHERE clients.id=${id}`;
    let archivedClient;

    db.all(sql, [], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        archivedClient = rows.find((row) => row.id === id);

        if (archivedClient === undefined) {
          return reject('id does not exist');
        }

        setClientsModel(
          getAllClients().filter(
            (client) => client.id !== archivedClient.id
          )
        );

        addClientToArchive(archivedClient);
        removeClientById(id);
        resolve(archivedClient);
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

// DELETE EMPLOYEE FROM THE DATABASE BY ID
function removeClientById(id) {
  const sql = `DELETE FROM clients WHERE clients.id=${id}`;
  db.run(sql, [], (err) => {
    if (err) {
      console.log(err);
    }
  });
}

function addClientToArchive(client) {
  const { id, company_name, contact_person, contact_number, address } = client;
  const sql = `INSERT INTO archivedClients (id, company_name, contact_person, contact_number, address) VALUES (?, ?, ?, ?, ?)`;
  db.run(sql, [id, company_name, contact_person, contact_number, address], (err) => {
    if (err) {
      console.log(err);
    }
  });
}

module.exports = {
  httpGetAllClients,
  httpPostNewClient,
  httpEditEmployee,
  httpArchiveClient
};
