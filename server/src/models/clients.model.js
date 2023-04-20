const db = require('../../database/db');

const clients = [];

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
  return clients.find((client) => (client.id === id));
}

module.exports = { loadClients, getAllClients, getClientById };
