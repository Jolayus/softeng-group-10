const path = require('path');

const express = require('express');

const app = express();

app.use(express.json());

// Serve all our client side files
app.use(express.static(path.join(__dirname, '..', 'public')));

// Let the client decide for routing
app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

module.exports = app;
