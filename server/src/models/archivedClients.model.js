const db = require('../../database/db');

const archivedClients = [];

function loadArchivedClients() {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM archivedClients';

    db.all(sql, [], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        rows.forEach((row) => archivedClients.push(row));
        resolve();
      }
    });
  });
}

function getAllArchivedClients() {
  return archivedClients;
}

function addNewArchivedClient(newArchivedClient) {
  return archivedClients.push(newArchivedClient);
}

function removeArchivedClient(archivedClientId) {
  const idx = archivedClients.find(
    (archivedClient) => archivedClient.id === archivedClientId
  );
  return archivedClients.splice(idx, 1);
}

module.exports = {
  loadArchivedClients,
  getAllArchivedClients,
  addNewArchivedClient,
  removeArchivedClient
};
