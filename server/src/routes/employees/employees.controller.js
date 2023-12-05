const db = require('../../../database/db');

const {
  getAllEmployees,
  getEmployeeById,
  addNewEmployee,
  removeEmployee
} = require('../../models/employees.model');

const {
  addNewArchivedEmployee
} = require('../../models/archivedEmployees.model');

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
  const {
    name,
    role,
    type,
    date_hired,
    vehicle_type,
    plate_number,
    email,
    contact_number,
    driver_name
  } = req.body;

  if (
    !name ||
    !role ||
    !type ||
    !date_hired ||
    !vehicle_type ||
    !plate_number ||
    !isEmailValid(email) ||
    !contact_number ||
    !driver_name
  ) {
    return res.status(400).json({ error: 'Invalid input' });
  }

  const promise = new Promise((resolve, reject) => {
    const sql = `INSERT INTO employees (name, role, type, date_hired, vehicle_type, plate_number, email, contact_number, driver_name) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    db.run(
      sql,
      [
        name,
        role,
        type,
        date_hired,
        vehicle_type,
        plate_number,
        email,
        contact_number,
        driver_name
      ],
      (err) => {
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
      }
    );
  });

  promise
    .then((newEmployee) => {
      addNewEmployee(newEmployee);
      res.status(201).json(newEmployee);
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
}

// UPDATE EMPLOYEE
function httpEditEmployee(req, res) {
  const {
    id,
    name,
    role,
    type,
    date_hired,
    vehicle_type,
    plate_number,
    email,
    contact_number,
    driver_name
  } = req.body;

  if (
    !id ||
    !name ||
    !role ||
    !type ||
    !date_hired ||
    !vehicle_type ||
    !plate_number ||
    !email ||
    !contact_number ||
    !driver_name
  ) {
    return res.status(400).json({ error: 'Invalid input' });
  }

  const updatedEmployee = getEmployeeById(id);

  updatedEmployee.name = name;
  updatedEmployee.role = role;
  updatedEmployee.type = type;
  updatedEmployee.date_hired = date_hired;
  updatedEmployee.vehicle_type = vehicle_type;
  updatedEmployee.plate_number = plate_number;
  updatedEmployee.email = email;
  updatedEmployee.contact_number = contact_number;
  updatedEmployee.driver_name = driver_name;

  const sql = `UPDATE employees SET name=?, role=?, type=?, date_hired=?, vehicle_type=?, plate_number=?, email=?, contact_number=?, driver_name=? WHERE employees.id=?`;

  db.run(
    sql,
    [
      name,
      role,
      type,
      date_hired,
      vehicle_type,
      plate_number,
      email,
      contact_number,
      driver_name,
      id
    ],
    (err) => {
      if (err) {
        return res.status(500).json({ error: err });
      }
    }
  );
  return res.status(200).json(updatedEmployee);
}

// ARCHIVE EXISTING EMPLOYEE
function httpArchiveEmployee(req, res) {
  const { id } = req.body;

  if (id === undefined || id <= 0) {
    return res.status(400).json({ error: 'Invalid id' });
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

        removeEmployee(archivedEmployee.id);
        addEmployeeToArchive(archivedEmployee);
        removeEmployeeFromDatabase(id);
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
function removeEmployeeFromDatabase(id) {
  const sql = `DELETE FROM employees WHERE employees.id=${id}`;
  db.run(sql, [], (err) => {
    if (err) {
      console.log(err);
    }
  });
}

function addEmployeeToArchive(employee) {
  const {
    id,
    name,
    role,
    type,
    date_hired,
    vehicle_type,
    plate_number,
    email,
    contact_number
  } = employee;
  const sql = `INSERT INTO archivedEmployee (id, name, role, type, date_hired, vehicle_type, plate_number, email, contact_number) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  addNewArchivedEmployee(employee);

  db.run(
    sql,
    [
      id,
      name,
      role,
      type,
      date_hired,
      vehicle_type,
      plate_number,
      email,
      contact_number
    ],
    (err) => {
      if (err) {
        console.log(err);
      }
    }
  );
}

module.exports = {
  httpGetAllEmployees,
  httpPostNewEmployee,
  httpEditEmployee,
  httpArchiveEmployee
};
