const path = require('path');
const fileSystem = require('fs');

const {
  getAllBillings,
  addNewBilling
} = require('../../models/billings.model');

function httpGetBillings(req, res) {
  return res.status(200).json(getAllBillings());
}

function httpPostNewBilling(req, res) {
  const newBilling = req.body;
  addNewBilling(newBilling);

  return res.status(201).json(newBilling);
}

function httpGetFile(req, res) {
  res.download(path.join(__dirname, 'BILLING-FORMAT.xlsx'));
}

module.exports = {
  httpGetBillings,
  httpPostNewBilling,
  httpGetFile
};
