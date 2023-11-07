const db = require('../../database/db');

const billings = [];

function getAllBillings() {
  return billings;
}

function addNewBilling(newBilling) {
  return billings.push(newBilling);
}

module.exports = {
  getAllBillings,
  addNewBilling
};
