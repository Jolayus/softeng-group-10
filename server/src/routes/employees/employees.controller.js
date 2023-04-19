const db = require('../../../database/db');

const {
  getAllEmployees,
  loadEmployees,
  setEmployeesModel
} = require('../../models/employees.model');

// GET ALL EMPLOYEES
function httpGetAllEmployees(req, res) {
  return res.status(200).json(getAllEmployees());
}

// CREATE NEW EMPLOYEE
function httpPostNewEmployee(req, res) {
  const { name, role, email, contact_number } = req.body;

  if (!name || !role || !email || !contact_number) {
    return res.status(400).json({ error: 'Invalid input' });
  }

  const sql = `INSERT INTO employees (name, role, email, contact_number) VALUES ('${name}', '${role}', '${email}', '${contact_number}')`;

  db.run(sql, [], (err) => {
    if (err) {
      console.log(err);
    }
  });

  loadEmployees();

  return res.status(201).json({
    name,
    role,
    email,
    contact_number
  });
}

// ARCHIVE EXISTING EMPLOYEE
function httpArchiveEmployee(req, res) {
  const { id } = req.body;

  if (id === undefined || id <= 0) {
    return res.status(400).json({ error: 'invalid id' });
  }

  const promise = new Promise((resolve, reject) => {
    const sql = `SELECT * FROM employees WHERE employees.id=${id}`;
    let archivedEmployee;

    db.all(sql, [], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        archivedEmployee = rows.find((row) => row.id === id);

        if (archivedEmployee === undefined) {
          return reject('id does not exist');
        }

        setEmployeesModel(
          getAllEmployees().filter(
            (employee) => employee.id !== archivedEmployee.id
          )
        );

        addEmployeeToArchive(archivedEmployee);
        removeEmployeeById(id);
        resolve(archivedEmployee);
      }
    });
  });

  promise
    .then((employee) => {
      return res.status(200).json(employee);
    })
    .catch((err) => {
      return res.status(500).json({ error: err });
    });
}

// DELETE EMPLOYEE FROM THE DATABASE BY ID
function removeEmployeeById(id) {
  const sql = `DELETE FROM employees WHERE employees.id=${id}`;
  db.run(sql, [], (err) => {
    console.log(err);
  });
}

function addEmployeeToArchive(employee) {
  const { id, name, role, email, contact_number } = employee;
  const sql = `INSERT INTO archivedEmployees (id, name, role, email, contact_number) VALUES (?, ?, ?, ?, ?)`;

  db.run(sql, [id, name, role, email, contact_number], (err) => {
    if (err) {
      console.log(err);
    }
  });
}

module.exports = {
  httpGetAllEmployees,
  httpPostNewEmployee,
  httpArchiveEmployee
};
