<script>
import SearchIcon from '../components/Icons/SearchIcon.vue';
import EditIcon from '../components/Icons/EditIcon.vue';
import TrashIcon from '../components/Icons/TrashIcon.vue';
import Modal from '../components/Modal.vue';

import {
  httpCreateEmployee,
  httpUpdateEmployee,
  httpArchiveEmployee
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
    archiveEmployee(id) {
      httpArchiveEmployee(id).then((archivedEmployee) => {
        this.$store.dispatch('employees/archiveEmployee', archivedEmployee.id);
      });
    },
    async addNewEmployee() {
      const options = { day: 'numeric', month: 'short', year: '2-digit' };

      const name = this.employeeNameInput.trim();
      const role = this.employeeRoleInput.trim();
      const type = this.employeeTypeInput.trim();
      const date_hired = new Date(this.employeeDateHiredInput).toLocaleDateString('en-GB', options).replace(/\s/g, '-');
      const vehicle_type = this.employeeVehicleTypeInput.trim() || '-';
      const plate_number = this.employeePlateNumberInput.trim() || '-';
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
        contact_number
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
        contact_number
      } = employee;

      const date = new Date(date_hired);

      const year = date.getFullYear();
      const day = date.getDate();
      const month = (date.getMonth() + 1).toString().padStart(2, '0');

      const formatDate = `${ year }-${ month }-${ day }` 

      this.editEmployeeId = id;
      this.editEmployeeNameInput = name;
      this.editEmployeeDateHiredInput = formatDate;
      this.editEmployeeRoleInput = role;
      this.editEmployeeTypeInput = type;
      this.editEmployeeVehicleTypeInput = vehicle_type;
      this.editEmployeePlateNumberInput = plate_number;
      this.editEmployeeEmailInput = email;
      this.editEmployeeContactNumberInput = contact_number;

    },
    async saveChanges() {
      const newDetails = {
        id: this.editEmployeeId,
        name: this.editEmployeeNameInput,
        date_hired: this.editEmployeeDateHiredInput,
        role: this.editEmployeeRoleInput,
        type: this.editEmployeeTypeInput,
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
      this.$store.dispatch('employees/editEmployee', newDetails);
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
    },
    onPageChange() {
      this.clearAddEmployeeInputs();
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

        if (
          name.length === 0 ||
          role.length === 0 ||
          type.length === 0 ||
          email.length === 0 ||
          !this.isEmailValid(email) ||
          phone.length === 0
        ) {
          return true;
        }
        return false;
      } else if (this.currentModal === 'EDIT') {
        const name = this.editEmployeeNameInput.trim();
        const role = this.editEmployeeRoleInput.trim();
        const type = this.editEmployeeTypeInput.trim();
        const email = this.editEmployeeEmailInput.trim();
        const phone = this.editEmployeeContactNumberInput.trim();

        if (
          name.length === 0 ||
          role.length === 0 ||
          type.length === 0 ||
          email.length === 0 ||
          !this.isEmailValid(email) ||
          phone.length === 0
        ) {
          return true;
        }
        return false;
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
    },
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
          @click="currentModal = 'ADD'"
        >
          Add new employee
        </button>
      </div>
      <table class="table">
        <thead class="tbl-header text-light rounded">
          <tr>
            <th scope="col">Name</th>
            <th scope="col">Date Hired</th>
            <th scope="col">Role</th>
            <th scope="col">Vehicle type</th>
            <th scope="col">Plate #</th>
            <th scope="col">Email</th>
            <th scope="col">Phone #</th>
            <th scope="col">Actions</th>
          </tr>
        </thead>
        <tbody class="table-group-divider">
          <tr v-for="employee in filteredEmployees" :key="employee.id">
            <th class="align-middle" scope="row">{{ employee.name }}</th>
            <td class="align-middle">{{ employee.date_hired }}</td>
            <td class="align-middle">{{ employee.role }}</td>
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
              <option value="Internal">Internal</option>
              <option value="External">Sub-Contractor</option>
            </select>
          </div>

          <div class="mb-3">
            <label for="employeeRole" class="form-label d-block text-start"
              >Role</label
            >
            <select
              v-model="employeeRoleInput"
              class="form-select"
              id="employeeRole"
              aria-describedby="employeeRole"
            >
              <option v-if="!isEmployeeTypeInputIsInternal" value="Operator">Operator</option>
              <option value="Driver">Driver</option>
              <option v-if="isEmployeeTypeInputIsInternal" value="Helper">Helper</option>
              <option v-if="isEmployeeTypeInputIsInternal" value="Admin">Admin</option>
            </select>
          </div>

          <div
            class="mb-3"
            v-if="((!isEmployeeRoleInputIsAdmin && employeeRoleInput !== '') && employeeRoleInput === 'Operator')  || ((isEmployeeTypeInputIsInternal && employeeRoleInput !== '') && employeeRoleInput === 'Driver' || employeeRoleInput === 'Helper')"
          >
            <label for="employeeRole" class="form-label d-block text-start"
              >Vehicle Type</label
            >
            <select
              v-model="employeeVehicleTypeInput"
              class="form-select"
              id="employeeVehicleType"
              aria-describedby="employeeVehicleType"
            >
              <option value="AUV">AUV</option>
              <option value="4W">4W</option>
              <option value="6W ELF">6W ELF</option>
              <option value="6WF">6WF</option>
              <option value="10W">10W</option>
            </select>
          </div>

          <div
            class="mb-3"
            v-if="((!isEmployeeRoleInputIsAdmin && employeeRoleInput !== '') && employeeRoleInput === 'Operator')  || ((isEmployeeTypeInputIsInternal && employeeRoleInput !== '') && employeeRoleInput === 'Driver' || employeeRoleInput === 'Helper')"
          >
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
              aria-describedby="employeePlateNumber"
            />
          </div>

          <div
            class="mb-3"
            v-if="(!isEmployeeRoleInputIsAdmin && employeeRoleInput !== '') && !isEmployeeTypeInputIsInternal && employeeRoleInput === 'Driver'"
          >
            <label for="employeeDriverOperator" class="form-label d-block text-start"
              >Operator</label
            >
            <select
              v-model="employeeDriverOperatorInput"
              class="form-select"
              id="employeeDriverOperator"
              aria-describedby="employeeDriverOperator"
            >

            </select>
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
              <label for="editEmployeeDateHired" class="form-label d-block text-start"
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

          <div class="mb-3">
            <label for="newEmployeeRole" class="form-label d-block text-start"
              >Role</label
            >
            <select
              v-model="editEmployeeRoleInput"
              class="form-select"
              id="newEmployeeRole"
              aria-describedby="newEmployeeRole"
            >
              <option v-if="!isEditEmployeeTypeInputIsInternal" value="Operator">Operator</option>
              <option value="Driver">Driver</option>
              <option v-if="isEditEmployeeTypeInputIsInternal" value="Helper">Helper</option>
              <option v-if="isEditEmployeeTypeInputIsInternal" value="Admin">Admin</option>
            </select>
          </div>
          
          <div class="mb-3" v-if="(!isEditEmployeeRoleInputIsAdmin && editEmployeeRoleInput === 'Operator') || (isEditEmployeeTypeInputIsInternal && (editEmployeeRoleInput === 'Driver' || editEmployeeRoleInput === 'Helper'))">
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
              <option value="AUV">AUV</option>
              <option value="4W">4W</option>
              <option value="6W ELF">6W ELF</option>
              <option value="6WF">6WF</option>
              <option value="10W">10W</option>
            </select>
          </div>

          <div class="mb-3" v-if="(!isEditEmployeeRoleInputIsAdmin  && editEmployeeRoleInput === 'Operator') || (isEditEmployeeTypeInputIsInternal && (editEmployeeRoleInput === 'Driver' || editEmployeeRoleInput === 'Helper'))">
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

          <div class="mb-3" v-if="!isEditEmployeeTypeInputIsInternal && editEmployeeRoleInput === 'Driver'">
            <label
              for="newEmployeeDriverOperator"
              class="form-label d-block text-start"
              >Operator</label
            >
            <select
              v-model="editEmployeeDriverOperatorInput"
              class="form-select"
              id="newEmployeeDriverOperator"
              aria-describedby="newEmployeeDriverOperator"
            >

            </select>
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
.input-group {
  width: 45%;
}

th {
  width: 12.5%;
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
