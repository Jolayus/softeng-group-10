<script>
import SearchIcon from '../components/Icons/SearchIcon.vue';
import EditIcon from '../components/Icons/EditIcon.vue';
import TrashIcon from '../components/Icons/TrashIcon.vue';
import Modal from '../components/Modal.vue';

import {
  httpCreateEmployee,
  httpUpdateEmployee,
  httpArchiveEmployee,
  httpDeleteBatch,
  httpDeletePayrollEmployees,
  httpDeleteSalaries,
  httpDeleteDeductions,
  httpDeleteExternalSalaries,
  httpDeleteExternalDeductions
} from '../requests/requests';

export default {
  name: 'Employee',
  components: {
    SearchIcon,
    EditIcon,
    TrashIcon,
    Modal
  },
  data() {
    return {
      selectedEmployee: null,
      searchInput: '',

      // CREATE MODAL
      employeeNameInput: '',
      employeeRoleInput: '',
      employeeDriverNameInput: '',
      employeeTypeInput: '',
      employeeDateHiredInput: '',
      employeeVehicleTypeInput: '',
      employeePlateNumberInput: '',
      employeeEmailInput: '',
      employeeContactNumberInput: '',

      // EDIT MODAL
      editEmployeeNameInput: '',
      editEmployeeDateHiredInput: '',
      editEmployeeRoleInput: '',
      editEmployeeTypeInput: '',
      editEmployeeVehicleTypeInput: '',
      editEmployeePlateNumberInput: '',
      editEmployeeEmailInput: '',
      editEmployeeContactNumberInput: '',
      editEmployeeDriverNameInput: '',
      editEmployeeId: '',

      currentModal: ''
    };
  },
  methods: {
    isEmailValid(email) {
      const mailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
      if (email.match(mailFormat)) {
        return true;
      }
      return false;
    },
    async archiveEmployee(id) {
      const archivedEmployee = await httpArchiveEmployee(id);
      this.$store.dispatch('employees/archiveEmployee', archivedEmployee.id);

      // REMOVE BATCH row with the provided employeeId
      await httpDeleteBatch(id);
      this.$store.dispatch('batches/removeBatch', id);

      // REMOVE payrollEmployee row with the provided employeeId
      await httpDeletePayrollEmployees(id);
      this.$store.dispatch('payrollEmployees/removePayrollEmployee', id);

      if (archivedEmployee.type === 'Internal') {
        // REMOVE salary/deduction row with the provided employeeId
        await httpDeleteSalaries(id);
        this.$store.dispatch('salaries/removeSalaries', id);

        await httpDeleteDeductions(id);
        this.$store.dispatch('deductions/removeDeductions', id)
      } else if (archivedEmployee.type === 'External') {
        // REMOVE externalSalary/externalDeduction row with the provided employeeId
        await httpDeleteExternalSalaries(id);
        this.$store.dispatch('externalSalaries/removeSalaries', id);

        await httpDeleteExternalDeductions(id);
        this.$store.dispatch('externalDeductions/removeDeductions', id);
      }
    },
    async addNewEmployee() {
      const options = { day: 'numeric', month: 'short', year: '2-digit' };

      const name = this.employeeNameInput.trim();
      const role = this.employeeRoleInput.trim();
      const type = this.employeeTypeInput.trim();
      const date_hired = new Date(this.employeeDateHiredInput)
        .toLocaleDateString('en-GB', options)
        .replace(/\s/g, '-');
      const vehicle_type = this.employeeVehicleTypeInput.trim() || '-';
      const plate_number = this.employeePlateNumberInput.trim() || '-';
      const driver_name = this.employeeDriverNameInput.trim() || '-';
      const email = this.employeeEmailInput.trim();
      const contact_number = this.employeeContactNumberInput.trim();

      // Creating new employee
      const newEmployee = {
        name,
        role,
        type,
        date_hired,
        role,
        vehicle_type,
        plate_number,
        email,
        contact_number,
        driver_name
      };

      const employee = await httpCreateEmployee(newEmployee);
      this.$store.dispatch('employees/addEmployee', employee);

      this.clearAddEmployeeInputs();
    },
    onEdit(employee) {
      this.currentModal = 'EDIT';

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
      } = employee;

      const date = new Date(date_hired);

      const year = date.getFullYear();
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');

      const formatDate = `${year}-${month}-${day}`;

      this.editEmployeeId = id;
      this.editEmployeeNameInput = name;
      this.editEmployeeDateHiredInput = formatDate;
      this.editEmployeeRoleInput = role;
      this.editEmployeeTypeInput = type;
      this.editEmployeeVehicleTypeInput = vehicle_type;
      this.editEmployeePlateNumberInput = plate_number;
      this.editEmployeeEmailInput = email;
      this.editEmployeeContactNumberInput = contact_number;
      this.editEmployeeDriverNameInput = driver_name;
    },
    async saveChanges() {
      // Copy the selected employee to be edited
      const prevDetails = { ...this.getEmployeeById(this.editEmployeeId) };

      const options = { day: 'numeric', month: 'short', year: '2-digit' };
      const date = new Date(this.editEmployeeDateHiredInput)
        .toLocaleDateString('en-GB', options)
        .replace(/\s/g, '-');

      const newDetails = {
        id: this.editEmployeeId,
        name: this.editEmployeeNameInput,
        date_hired: date,
        role: this.editEmployeeRoleInput,
        type: this.editEmployeeTypeInput,
        driver_name:
          this.editEmployeeTypeInput.toLowerCase() === 'internal'
            ? '-'
            : this.editEmployeeDriverNameInput,
        vehicle_type:
          this.editEmployeeRoleInput === 'Admin'
            ? '-'
            : this.editEmployeeVehicleTypeInput,
        plate_number:
          this.editEmployeeRoleInput === 'Admin'
            ? '-'
            : this.editEmployeePlateNumberInput,
        email: this.editEmployeeEmailInput,
        contact_number: this.editEmployeeContactNumberInput
      };

      await httpUpdateEmployee(newDetails);
      this.$store.dispatch('employees/editEmployee', {
        prevDetails,
        newDetails
      });
    },

    getEmployeeById(id) {
      return this.$store.getters['employees/getEmployeeById'](id);
    },

    markAsModified(employee) {
      employee.modified = true;
      return employee;
    },

    clearAddEmployeeInputs() {
      this.employeeNameInput = '';
      this.employeeRoleInput = '';
      this.employeeTypeInput = '';
      this.employeeDateHiredInput = '';
      this.employeeEmailInput = '';
      this.employeeContactNumberInput = '';
      this.employeeVehicleTypeInput = '';
      this.employeePlateNumberInput = '';
      this.employeeDriverNameInput = '';
    },
    onPageChange() {
      this.clearAddEmployeeInputs();
    },
    onClickAddEmployeeHandler() {
      this.clearAddEmployeeInputs();
      this.currentModal = 'ADD';
    }
  },
  computed: {
    employees() {
      return this.$store.getters['employees/employees'];
    },
    filteredEmployees() {
      const employees = this.employees.filter((employee) =>
        employee.name.toLowerCase().includes(this.searchInput.toLowerCase())
      );

      return employees;
    },
    isFormInvalid() {
      if (this.currentModal === 'ADD') {
        const name = this.employeeNameInput.trim();
        const role = this.employeeRoleInput.trim();
        const type = this.employeeTypeInput.trim();
        const email = this.employeeEmailInput.trim();
        const phone = this.employeeContactNumberInput.trim();
        const date_hired = this.employeeDateHiredInput.trim();
        const vehicle_type = this.employeeVehicleTypeInput.trim();
        const plate_number = this.employeePlateNumberInput.trim();
        const driverName = this.employeeDriverNameInput.trim();

        if (
          this.employeeRoleInput === 'Admin' ||
          this.employeeRoleInput === ''
        ) {
          if (
            name.length === 0 ||
            date_hired.length === 0 ||
            role.length === 0 ||
            type.length === 0 ||
            email.length === 0 ||
            !this.isEmailValid(email) ||
            phone.length === 0
          ) {
            return true;
          }
          return false;
        } else if (
          this.employeeRoleInput === 'Driver' ||
          this.employeeRoleInput === 'Helper'
        ) {
          if (
            name.length === 0 ||
            date_hired.length === 0 ||
            role.length === 0 ||
            type.length === 0 ||
            email.length === 0 ||
            !this.isEmailValid(email) ||
            phone.length === 0 ||
            vehicle_type.length === 0 ||
            plate_number.length === 0
          ) {
            return true;
          }
          return false;
        } else if (this.employeeRoleInput === 'Contractor') {
          if (
            name.length === 0 ||
            date_hired.length === 0 ||
            role.length === 0 ||
            type.length === 0 ||
            email.length === 0 ||
            !this.isEmailValid(email) ||
            phone.length === 0 ||
            driverName.length === 0
          ) {
            return true;
          }
          return false;
        }
      } else if (this.currentModal === 'EDIT') {
        const name = this.editEmployeeNameInput.trim();
        const role = this.editEmployeeRoleInput.trim();
        const type = this.editEmployeeTypeInput.trim();
        const email = this.editEmployeeEmailInput.trim();
        const phone = this.editEmployeeContactNumberInput.trim();
        const date_hired = this.editEmployeeDateHiredInput.trim();
        const vehicle_type = this.editEmployeeVehicleTypeInput.trim();
        const plate_number = this.editEmployeePlateNumberInput.trim();
        const driverName = this.editEmployeeDriverNameInput.trim();

        if (
          this.employeeRoleInput === 'Admin' ||
          this.employeeRoleInput === ''
        ) {
          if (
            name.length === 0 ||
            date_hired.length === 0 ||
            role.length === 0 ||
            type.length === 0 ||
            email.length === 0 ||
            !this.isEmailValid(email) ||
            phone.length === 0
          ) {
            return true;
          }
          return false;
        } else if (
          this.employeeRoleInput === 'Driver' ||
          this.employeeRoleInput === 'Helper'
        ) {
          if (
            name.length === 0 ||
            date_hired.length === 0 ||
            role.length === 0 ||
            type.length === 0 ||
            email.length === 0 ||
            !this.isEmailValid(email) ||
            phone.length === 0 ||
            vehicle_type.length === 0 ||
            plate_number.length === 0
          ) {
            return true;
          }
          return false;
        } else if (this.employeeRoleInput === 'Contractor') {
          if (
            name.length === 0 ||
            date_hired.length === 0 ||
            role.length === 0 ||
            type.length === 0 ||
            email.length === 0 ||
            !this.isEmailValid(email) ||
            phone.length === 0 ||
            driverName.length === 0
          ) {
            return true;
          }
          return false;
        }
      }
    },
    isEmployeeRoleInputIsAdmin() {
      return this.employeeRoleInput === 'Admin';
    },

    // For editing employee
    isEditEmployeeRoleInputIsAdmin() {
      return this.editEmployeeRoleInput === 'Admin';
    },

    isEmployeeTypeInputIsInternal() {
      return this.employeeTypeInput === 'Internal';
    },
    isEditEmployeeTypeInputIsInternal() {
      return this.editEmployeeTypeInput === 'Internal';
    }
  },
  watch: {
    employeeTypeInput(newType) {
      if (newType === 'External') {
        this.employeeRoleInput = 'Contractor';
      }
    },
    editEmployeeTypeInput(newType) {
      if (newType === 'External') {
        this.editEmployeeRoleInput = 'Contractor';
      }
    }
  },
  beforeRouteLeave() {
    // When the user selects other page
    this.clearAddEmployeeInputs();
  }
};
</script>

<template>
  <div class="d-flex flex-column justify-content-between h-100">
    <header class="mb-5">
      <h1>Employees</h1>
    </header>
    <main class="container flex-grow-1">
      <div class="d-flex justify-content-between mb-4" style="max-height: 35px">
        <div class="input-group mb-3 h-100 align-items-center gap-2">
          <label for="user-input">Search:</label>
          <input
            v-model="searchInput"
            type="text"
            class="form-control"
            placeholder="Employee's name"
            aria-label="Recipient's username"
            id="user-input"
            aria-describedby="basic-addon2"
          />
        </div>
        <button
          type="button"
          data-bs-toggle="modal"
          data-bs-target="#employeeModal"
          class="btn tms-btn text-light d-flex align-items-center h-100"
          @click="onClickAddEmployeeHandler"
        >
          Add new employee
        </button>
      </div>
      <table class="table">
        <thead class="tbl-header text-light rounded">
          <tr>
            <th class="align-middle" scope="col">Name</th>
            <th class="w-8 align-middle" scope="col">Date Hired</th>
            <th class="w-8 align-middle" scope="col">Role</th>
            <th class="align-middle" scope="col">Driver's name</th>
            <th class="w-8 align-middle" scope="col">Vehicle</th>
            <th class="align-middle" scope="col">Plate #</th>
            <th class="align-middle" scope="col">Email</th>
            <th class="align-middle" scope="col">Phone #</th>
            <th class="w-8 align-middle" scope="col">Actions</th>
          </tr>
        </thead>
        <tbody class="table-group-divider">
          <tr
            v-for="employee in filteredEmployees"
            :key="employee.id"
            :class="{
              'newly-added': employee.newlyAdded && !employee.modified,
              'bg-warning': employee.modified
            }"
          >
            <th class="align-middle" scope="row">{{ employee.name }}</th>
            <td class="align-middle">{{ employee.date_hired }}</td>
            <td class="align-middle">{{ employee.role }}</td>
            <td class="align-middle">{{ employee.driver_name }}</td>
            <td class="align-middle">{{ employee.vehicle_type }}</td>
            <td class="align-middle">{{ employee.plate_number }}</td>
            <td class="align-middle">{{ employee.email }}</td>
            <td class="align-middle">{{ employee.contact_number }}</td>
            <td class="align-middle">
              <EditIcon
                data-bs-toggle="modal"
                data-bs-target="#editEmployeeModal"
                @click.prevent="onEdit(employee)"
                class="mx-2 text-primary"
                role="button"
              />
              <TrashIcon
                data-bs-toggle="modal"
                data-bs-target="#archiveEmployeeVerif"
                @click.prevent="selectedEmployee = employee.id"
                class="mx-2 text-danger"
                role="button"
              />
            </td>
          </tr>
        </tbody>
      </table>
    </main>
  </div>

  <Modal id="employeeModal">
    <template v-slot:modal-header>
      <div class="modal-header justify-content-center border-bottom-0">
        <h1 class="modal-title fs-5" id="employeeModalLabel">
          Employee's Information
        </h1>
      </div>
    </template>
    <template v-slot:modal-body>
      <div class="modal-body">
        <form id="employeeForm" @submit.prevent="addNewEmployee">
          <div class="mb-3">
            <label for="employeeName" class="form-label d-block text-start"
              >Name</label
            >
            <input
              v-model="employeeNameInput"
              type="text"
              class="form-control"
              id="employeeName"
              aria-describedby="employeeName"
              placeholder="Full Name"
            />
          </div>

          <div class="mb-3">
            <label for="employeeDateHired" class="form-label d-block text-start"
              >Date Hired</label
            >
            <input
              required
              v-model="employeeDateHiredInput"
              type="date"
              class="form-control"
              id="employeeDateHired"
              aria-describedby="employeeDateHired"
            />
          </div>

          <div class="mb-3">
            <label for="employeeType" class="form-label d-block text-start"
              >Type</label
            >
            <select
              v-model="employeeTypeInput"
              class="form-select"
              id="employeeType"
              aria-describedby="employeeType"
            >
              <option selected value="">Select Employee Type</option>
              <option value="Internal">Internal</option>
              <option value="External">Sub-Contractor</option>
            </select>
          </div>

          <div v-if="employeeTypeInput === 'External'" class="mb-3">
            <label
              for="employeeDriverName"
              class="form-label d-block text-start"
              >Driver's Name</label
            >
            <input
              v-model="employeeDriverNameInput"
              type="text"
              id="employeeDriverName"
              class="form-control"
              aria-describedby="employeeDriverName"
              placeholder="Driver's Full Name"
              required
            />
          </div>

          <div class="mb-3">
            <label for="employeeRole" class="form-label d-block text-start"
              >Role</label
            >
            <input
              v-if="employeeTypeInput === 'External'"
              type="text"
              v-model="employeeRoleInput"
              id="employeeRole"
              class="form-control"
              disabled
            />
            <select
              v-else
              v-model="employeeRoleInput"
              class="form-select"
              id="employeeRole"
              aria-describedby="employeeRole"
              :disabled="!isEmployeeTypeInputIsInternal"
            >
              <option selected value="">Select Role</option>
              <option value="Driver">Driver</option>
              <option value="Helper">Helper</option>
              <option value="Admin">Admin</option>
            </select>
          </div>

          <div class="mb-3" v-if="!isEmployeeRoleInputIsAdmin">
            <label for="employeeRole" class="form-label d-block text-start"
              >Vehicle Type</label
            >
            <select
              v-model="employeeVehicleTypeInput"
              class="form-select"
              id="employeeVehicleType"
              aria-describedby="employeeVehicleType"
            >
              <option selected value="">Select Vehicle Type</option>
              <option value="AUV">AUV</option>
              <option value="4W">4W</option>
              <option value="6W ELF">6W ELF</option>
              <option value="6WF">6WF</option>
              <option value="10W">10W</option>
            </select>
          </div>

          <div class="mb-3" v-if="!isEmployeeRoleInputIsAdmin">
            <label
              for="employeePlateNumber"
              class="form-label d-block text-start"
              >Plate number</label
            >
            <input
              v-model="employeePlateNumberInput"
              type="text"
              class="form-control"
              id="employeePlateNumber"
              placeholder="Plate Number"
              aria-describedby="employeePlateNumber"
            />
          </div>

          <div class="mb-3">
            <label for="employeeEmail" class="form-label d-block text-start"
              >Email address</label
            >
            <input
              v-model="employeeEmailInput"
              type="email"
              class="form-control"
              id="employeeEmail"
              placeholder="Email Address"
              aria-describedby="employeeEmail"
            />
          </div>
          <div class="mb-3">
            <label for="employeeContact" class="form-label d-block text-start"
              >Contact Number</label
            >
            <input
              v-model="employeeContactNumberInput"
              type="text"
              class="form-control"
              id="employeeContact"
              placeholder="Contact Number"
              aria-describedby="employeeContact"
            />
          </div>
        </form>
      </div>
    </template>
    <template v-slot:modal-footer>
      <div class="modal-footer border-top-0 justify-content-center">
        <button type="button" class="btn text-light" data-bs-dismiss="modal">
          Close
        </button>
        <button
          type="submit"
          class="btn tms-btn text-light"
          form="employeeForm"
          data-bs-dismiss="modal"
          :disabled="isFormInvalid"
        >
          Add Employee
        </button>
      </div>
    </template>
  </Modal>

  <Modal id="editEmployeeModal">
    <template v-slot:modal-header>
      <div class="modal-header justify-content-center border-bottom-0">
        <h1 class="modal-title fs-5" id="editEmployeeLabel">
          Edit Employee's Information
        </h1>
      </div>
    </template>
    <template v-slot:modal-body>
      <div class="modal-body">
        <form id="editEmployeeForm">
          <div class="mb-3">
            <label for="newEmployeeName" class="form-label d-block text-start"
              >Name</label
            >
            <input
              v-model="editEmployeeNameInput"
              type="text"
              class="form-control"
              id="newEmployeeName"
              aria-describedby="newEmployeeName"
            />
          </div>

          <div class="mb-3">
            <label
              for="editEmployeeDateHired"
              class="form-label d-block text-start"
              >Date Hired</label
            >
            <input
              required
              v-model="editEmployeeDateHiredInput"
              type="date"
              class="form-control"
              id="editEmployeeDateHired"
              aria-describedby="editEmployeeDateHired"
            />
          </div>

          <div class="mb-3">
            <label for="newEmployeeType" class="form-label d-block text-start"
              >Type</label
            >
            <select
              v-model="editEmployeeTypeInput"
              class="form-select"
              id="newEmployeeType"
              aria-describedby="newEmployeeType"
            >
              <option value="Internal">Internal</option>
              <option value="External">Sub-Contractor</option>
            </select>
          </div>

          <div v-if="editEmployeeTypeInput === 'External'" class="mb-3">
            <label
              for="editEmployeeDriverName"
              class="form-label d-block text-start"
              >Driver's Name</label
            >
            <input
              v-model="editEmployeeDriverNameInput"
              type="text"
              id="editEmployeeDriverName"
              class="form-control"
              aria-describedby="editEmployeeDriverName"
              placeholder="Driver's Full Name"
              required
            />
          </div>

          <div class="mb-3">
            <label for="employeeRole" class="form-label d-block text-start"
              >Role</label
            >
            <input
              v-if="editEmployeeTypeInput === 'External'"
              type="text"
              v-model="editEmployeeRoleInput"
              id="employeeRole"
              class="form-control"
              disabled
            />
            <select
              v-else
              v-model="editEmployeeRoleInput"
              class="form-select"
              id="employeeRole"
              aria-describedby="employeeRole"
              :disabled="!isEditEmployeeTypeInputIsInternal"
            >
              <option selected value="">Select Role</option>
              <option value="Driver">Driver</option>
              <option value="Helper">Helper</option>
              <option value="Admin">Admin</option>
            </select>
          </div>

          <div
            class="mb-3"
            v-if="
              (!isEditEmployeeRoleInputIsAdmin &&
                editEmployeeRoleInput === 'Operator') ||
              (isEditEmployeeTypeInputIsInternal &&
                (editEmployeeRoleInput === 'Driver' ||
                  editEmployeeRoleInput === 'Helper'))
            "
          >
            <label
              for="newEmployeeVehicleType"
              class="form-label d-block text-start"
              >Vehicle Type</label
            >
            <select
              v-model="editEmployeeVehicleTypeInput"
              class="form-select"
              id="newEmployeeVehicleType"
              aria-describedby="newEmployeeVehicleType"
            >
              <option selected value="-">Select Vehicle Type</option>
              <option value="AUV">AUV</option>
              <option value="4W">4W</option>
              <option value="6W ELF">6W ELF</option>
              <option value="6WF">6WF</option>
              <option value="10W">10W</option>
            </select>
          </div>

          <div
            class="mb-3"
            v-if="
              (!isEditEmployeeRoleInputIsAdmin &&
                editEmployeeRoleInput === 'Operator') ||
              (isEditEmployeeTypeInputIsInternal &&
                (editEmployeeRoleInput === 'Driver' ||
                  editEmployeeRoleInput === 'Helper'))
            "
          >
            <label
              for="newEmployeePlateNumber"
              class="form-label d-block text-start"
              >Plate number</label
            >
            <input
              v-model="editEmployeePlateNumberInput"
              type="email"
              class="form-control"
              id="newEmployeePlateNumber"
              aria-describedby="newEmployeePlateNumber"
            />
          </div>

          <div class="mb-3">
            <label for="employeeEmail" class="form-label d-block text-start"
              >Email address</label
            >
            <input
              v-model="editEmployeeEmailInput"
              type="email"
              class="form-control"
              id="newEmployeeEmail"
              aria-describedby="newEmployeeEmail"
            />
          </div>
          <div class="mb-3">
            <label
              for="newEmployeeContact"
              class="form-label d-block text-start"
              >Contact Number</label
            >
            <input
              v-model="editEmployeeContactNumberInput"
              type="text"
              class="form-control"
              id="newEmployeeContact"
              aria-describedby="newEmployeeContact"
            />
          </div>
        </form>
      </div>
    </template>
    <template v-slot:modal-footer>
      <div class="modal-footer justify-content-center border-top-0">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
          Close
        </button>
        <button
          @click.prevent="saveChanges"
          class="btn btn-primary tms-btn"
          form="editEmployeeForm"
          data-bs-dismiss="modal"
          :disabled="isFormInvalid"
        >
          Save changes
        </button>
      </div>
    </template>
  </Modal>

  <Modal id="archiveEmployeeVerif">
    <template v-slot:modal-header>
      <div class="modal-header justify-content-center border-bottom-0">
        <h1 class="modal-title fs-5" id="archiveEmployeeVerifLabel">
          Archive Employee
        </h1>
      </div>
    </template>
    <template v-slot:modal-body>
      <div class="modal-body">
        <p>Are you sure you want to archive this?</p>
      </div>
    </template>
    <template v-slot:modal-footer>
      <div class="modal-footer justify-content-center border-top-0">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
          Cancel
        </button>
        <button
          type="button"
          class="btn btn-primary tms-btn"
          data-bs-dismiss="modal"
          @click.prevent="archiveEmployee(selectedEmployee)"
        >
          Archive
        </button>
      </div>
    </template>
  </Modal>
</template>

<style scoped>
.newly-added {
  background-color: #c7dca7;
}

.input-group {
  width: 45%;
}

th {
  width: 13.59%;
}

.w-8 {
  width: 8%;
}

.modal-body label {
  text-transform: uppercase;
  font-weight: bold;
  color: #86b9b0;
}

.modal-footer button {
  background-color: #4c7273;
}
</style>
