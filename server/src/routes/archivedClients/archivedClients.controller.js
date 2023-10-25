const db = require('../../../database/db');
const {
  getAllArchivedClients,
  removeArchivedClient
} = require('../../models/archivedClients.model');

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

module.exports = {
  httpGetAllArchivedClients,
  httpDeleteArchivedClient
};
