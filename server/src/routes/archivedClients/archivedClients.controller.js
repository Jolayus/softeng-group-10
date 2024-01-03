const fs = require('fs');
const path = require('path');
const db = require('../../../database/db');
const {
  getAllArchivedClients,
  removeArchivedClient
} = require('../../models/archivedClients.model');

const { loadTripRates } = require('../../models/triprates.model');

function httpGetAllArchivedClients(req, res) {
  return res.status(200).json(getAllArchivedClients());
}

// DELETE ARCHIVED CLIENT
function httpDeleteArchivedClient(req, res) {
  const { id } = req.body;

  if (id === undefined || id <= 0) {
    return res.status(400).json({ error: 'Invalid id' });
  }

  const promise = new Promise((resolve, reject) => {
    const sql = `SELECT * FROM archivedClients WHERE archivedClients.id=${id}`;
    let deletedArchivedClient;

    db.all(sql, [], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        deletedArchivedClient = rows.find((row) => row.id === id);

        if (deletedArchivedClient === undefined) {
          return reject('id does not exist');
        }

        removeArchivedClient(deletedArchivedClient.id);
        removeClientFromArchivedClientsTable(deletedArchivedClient.id);
        resolve(deletedArchivedClient);
      }
    });
  });

  promise
    .then((deletedArchivedClient) => {
      const filePath = path.resolve(
        __dirname,
        '..',
        'clients',
        'contracts',
        `${deletedArchivedClient.id}-contract.png`
      );
      fs.unlink(filePath, (err) => {
        if (err) {
          console.log('Error deleting files');
        }
      });
      res.status(200).json(deletedArchivedClient);
    })
    .catch((err) => {
      return res.status(500).json({ error: err });
    });
}

function removeClientFromArchivedClientsTable(id) {
  const sql = `DELETE FROM archivedClients WHERE archivedClients.id=${id}`;
  db.run(sql, [], (err) => {
    if (err) {
      console.log(err);
    }
  });
}

async function httpRecoverArchivedClient(req, res) {
  const { id } = req.body;

  if (typeof id !== 'number' || id < 0) {
    return res.status(400).json({ error: 'Invalid id' });
  }

  const promise = new Promise((resolve, reject) => {
    const sql = `SELECT * FROM archivedClients WHERE archivedClients.id=${id}`;
    let archivedClient;

    db.all(sql, [], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        archivedClient = rows.find((row) => row.id === id);

        if (archivedClient === undefined) {
          return reject('id does not exist');
        }

        removeArchivedClient(archivedClient.id);
        removeClientFromArchivedClientsTable(archivedClient.id);
        resolve(archivedClient);
      }
    });
  });

  const archivedClient = await promise;
  console.log(archivedClient);

  const formData = new FormData();
  formData.append('company_name', archivedClient.company_name);
  formData.append('address', archivedClient.address);
  formData.append('contact_person', archivedClient.contact_person);
  formData.append('contact_number', archivedClient.contact_number);
  formData.append('email', archivedClient.email);
  formData.append('contract_number', archivedClient.contract_number);

  async function httpCreateClient(formData) {
    const response = await fetch(`http://localhost:8000/clients`, {
      method: 'POST',
      body: formData
    });
    return await response.json();
  }
  const recoveredClient = await httpCreateClient(formData);

  // UPDATE THE CLIENT ID OF THE TRIP RATES FOR THE RECOVERED CLIENT
  updateClientIdTripRates(archivedClient.id, recoveredClient.id);

  console.log(archivedClient.id, recoveredClient.id);

  const oldFileName = path.resolve(
    __dirname,
    '..',
    'clients',
    'contracts',
    `${archivedClient.id}-contract.png`
  );

  const newFileName = path.resolve(
    __dirname,
    '..',
    'clients',
    'contracts',
    `${recoveredClient.id}-contract.png`
  );

  fs.rename(oldFileName, newFileName, (err) => {
    if (err) {
      console.log('Error renaming the file: ', err);
    } else {
      res.status(200).json(recoveredClient);
    }
  });
}

function updateClientIdTripRates(prevId, latestId) {
  const sql = 'UPDATE triprate SET clientId = ? WHERE clientId = ?';

  db.run(sql, [latestId, prevId], (err) => {
    if (err) {
      return res
        .status(500)
        .json({ error: 'Cannot update the clientId TripRates' });
    }
  });

  loadTripRates();
}

module.exports = {
  httpGetAllArchivedClients,
  httpDeleteArchivedClient,
  httpRecoverArchivedClient
};
