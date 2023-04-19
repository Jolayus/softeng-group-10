const db = require('../../../database/db');

const { getAllEmployees, loadEmployees } = require('../../models/employees.model');

// GET ALL EMPLOYEES
function httpGetAllEmployees(req, res) {
  return res.status(200).json(getAllEmployees());
}

// CREATE NEW EMPLOYEE
function httpPostNewEmployee(req, res) {
  const { name, role, email, contact_number } = req.body;
  const sql = `INSERT INTO employees (name, role, email, contact_number) VALUES ('${name}', '${role}', '${email}', '${contact_number}')`;
  
  db.run(sql, [], (err) => {
    if (err) {
      console.log(err);
    }
  });

  res.status(201).json({
    name,
    role,
    email,
    contact_number
  });

  // LOAD THE LATEST DATA FROM THE DATABASE
  loadEmployees();

  return;
}

module.exports = {
  httpGetAllEmployees,
  httpPostNewEmployee
};