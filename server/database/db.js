const path = require('path');

const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database(path.join(__dirname, 'tms_roed.db'), sqlite3.OPEN_READWRITE, (err) => {
  console.log(err);
});

module.exports = db;