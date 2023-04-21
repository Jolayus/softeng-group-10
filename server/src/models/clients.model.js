const db = require('../../database/db');

let clients = [];

function loadClients() {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM clients';

    db.all(sql, [], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        rows.forEach((row) => clients.push(row));
        resolve();
      }
    });
  });
}

function getAllClients() {
  return clients;
}

function getClientById(id) {
  return clients.find((client) => client.id === id);
}

function setClientsModel(newModel) {
  clients = newModel;
}

module.exports = { loadClients, getAllClients, getClientById, setClientsModel };
