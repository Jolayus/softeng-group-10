const db = require('../../../database/db');
const multer = require('multer');
const sharp = require('sharp');
const path = require('path');

const {
  getAllClients,
  getClientById,
  addNewClient,
  removeClient
} = require('../../models/clients.model');

const { addNewArchivedClient } = require('../../models/archivedClients.model');

function httpGetAllClients(req, res) {
  return res.status(200).json(getAllClients());
}

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// CREATE NEW CLIENT
function httpPostNewClient(req, res) {
  const {
    company_name,
    address,
    contact_person,
    contact_number,
    email,
    contract_number
  } = req.body;

  if (
    !company_name ||
    !address ||
    !contact_person ||
    !contact_number ||
    !email ||
    !contract_number
  ) {
    return res.status(400).json({ error: 'Invalid input' });
  }

  const promise = new Promise((resolve, reject) => {
    const sql = `INSERT INTO clients (company_name, address, contact_person, contact_number, email, contract_number) VALUES (?, ?, ?, ?, ?, ?)`;
    db.run(
      sql,
      [
        company_name,
        address,
        contact_person,
        contact_number,
        email,
        contract_number
      ],
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
      addNewClient(newClient);

      sharp(req.file.buffer)
        .png()
        .toFile(
          path.join(__dirname, 'contracts', `${newClient.id}-contract.png`),
          (err, info) => {
            if (err) {
              return res
                .status(500)
                .json({ error: 'Error processing the image' });
            }
          }
        );

      res.status(201).json(newClient);
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
}
function httpEditClient(req, res) {
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
    return res.status(400).json({ error: 'Invalid id' });
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

        removeClient(archivedClient.id);
        addClientToArchive(archivedClient);
        removeClientFromDatabase(id);
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
function removeClientFromDatabase(id) {
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

  addNewArchivedClient(client);

  db.run(
    sql,
    [id, company_name, contact_person, contact_number, address],
    (err) => {
      if (err) {
        console.log(err);
      }
    }
  );
}

module.exports = {
  httpGetAllClients,
  httpPostNewClient,
  httpEditClient,
  httpArchiveClient,
  upload
};
