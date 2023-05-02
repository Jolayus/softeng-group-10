const db = require('../../../database/db');

const {
  getAllEmployees,
  getEmployeeById,
  addNewEmployee
} = require('../../models/employees.model');

// GET ALL EMPLOYEES
function httpGetAllEmployees(req, res) {
  return res.status(200).json(getAllEmployees());
}

function isEmailValid(email) {
  const mailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  if (email.match(mailFormat)) {
    return true;
  }
  return false;
}

// CREATE NEW EMPLOYEE
function httpPostNewEmployee(req, res) {
  const { name, role, email, contact_number } = req.body;

  if (!name || !role || !isEmailValid(email) || !contact_number) {
    return res.status(400).json({ error: 'Invalid input' });
  }

  const promise = new Promise((resolve, reject) => {
    const sql = `INSERT INTO employees (name, role, email, contact_number) VALUES (?, ?, ?, ?)`;
    db.run(sql, [name, role, email, contact_number], (err) => {
      if (err) {
        reject(err);
      } else {
        const sql = `SELECT * FROM employees ORDER BY id DESC LIMIT 1`;
        db.all(sql, [], (err, rows) => {
          if (err) {
            reject(err);
          } else {
            resolve(rows[0]);
          }
        });
      }
    });
  });

  promise
    .then((newClient) => {
      addNewEmployee(newClient);
      res.status(201).json(newClient);
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
}

// UPDATE EMPLOYEE
function httpEditEmployee(req, res) {
  const { id, name, role, email, contact_number } = req.body;

  const updatedEmployee = getEmployeeById(id);

  updatedEmployee.name = name;
  updatedEmployee.role = role;
  updatedEmployee.email = email;
  updatedEmployee.contact_number = contact_number;

  const sql = `UPDATE employees SET name=?, role=?, email=?, contact_number=? WHERE employees.id=?`;

  db.run(sql, [name, role, email, contact_number, id], (err) => {
    if (err) {
      return res.status(500).json({ error: err });
    }
  });

  return res.status(200).json(updatedEmployee);
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
    if (err) {
      console.log(err);
    }
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
  httpEditEmployee,
  httpArchiveEmployee
};
