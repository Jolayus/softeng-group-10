<script>
import SearchIcon from '../components/Icons/SearchIcon.vue';
import EditIcon from '../components/Icons/EditIcon.vue';
import TrashIcon from '../components/Icons/TrashIcon.vue';
import Footer from '../components/Footer.vue';
import Modal from '../components/Modal.vue';
import { getEmployeesModel } from '../model/employees.model';
import { addEmployeeArchive } from '../model/employeesArchive.model';

export default {
  name: 'Employee',
  components: {
    SearchIcon,
    EditIcon,
    TrashIcon,
    Footer,
    Modal
  },
  data() {
    return {
      employeesModel: getEmployeesModel(),
      selectedEmployee: null,
      currentEmployeeId: 0,
      searchInput: '',
      employeeNameInput: '',
      employeeRoleInput: '',
      employeeEmailInput: '',
      employeePhoneInput: '',
      editEmployeeNameInput: '',
      editEmployeeRoleInput: '',
      editEmployeeEmailInput: '',
      editEmployeePhoneInput: '',
      editEmployeeId: '',
      currentModal: ''
    };
  },
  methods: {
    archiveEmployee(id) {
      const toBeArchiveEmployee = this.employeesModel.find(
        (employee) => employee.id === id
      );
      this.employeesModel = this.employeesModel.filter(
        (employee) => employee !== toBeArchiveEmployee
      );

      addEmployeeArchive({
        id: toBeArchiveEmployee.id,
        name: toBeArchiveEmployee.name,
        role: toBeArchiveEmployee.role,
        email: toBeArchiveEmployee.email,
        phone: toBeArchiveEmployee.phone
      });
    },
    addNewEmployee() {
      const name = this.employeeNameInput.trim();
      const role = this.employeeRoleInput.trim();
      const email = this.employeeEmailInput.trim();
      const phone = this.employeePhoneInput.trim();

      // Increment the current id for new employee
      this.currentEmployeeId++;

      // Creating new employee
      const newEmployee = {
        id: this.currentEmployeeId,
        name,
        role,
        email,
        phone
      };

      this.employeesModel.push(newEmployee);

      // Clear input
      this.clearInput();
    },
    clearInput() {
      this.employeeNameInput = '';
      this.employeeRoleInput = '';
      this.employeeEmailInput = '';
      this.employeePhoneInput = '';
    },
    onEdit(employee) {
      this.currentModal = 'EDIT';

      const { id, name, role, email, phone } = employee;

      this.editEmployeeId = id;
      this.editEmployeeNameInput = name;
      this.editEmployeeRoleInput = role;
      this.editEmployeeEmailInput = email;
      this.editEmployeePhoneInput = phone;
    },
    saveChanges() {
      const employee = this.employeesModel.find(
        (employee) => employee.id === this.editEmployeeId
      );

      employee.name = this.editEmployeeNameInput;
      employee.role = this.editEmployeeRoleInput;
      employee.email = this.editEmployeeEmailInput;
      employee.phone = this.editEmployeePhoneInput;
    }
  },
  computed: {
    filteredEmployees() {
      return this.employeesModel.filter((employee) =>
        employee.name.includes(this.searchInput)
      );
    },
    isFormInvalid() {
      if (this.currentModal === 'ADD') {
        const name = this.employeeNameInput.trim();
        const role = this.employeeRoleInput.trim();
        const email = this.employeeEmailInput.trim();
        const phone = this.employeePhoneInput.trim();

        if (
          name.length === 0 ||
          role.length === 0 ||
          email.length === 0 ||
          !email.includes('@') ||
          phone.length === 0
        ) {
          return true;
        }
        return false;
      } else if (this.currentModal === 'EDIT') {
        const name = this.editEmployeeNameInput.trim();
        const role = this.editEmployeeRoleInput.trim();
        const email = this.editEmployeeEmailInput.trim();
        const phone = this.editEmployeePhoneInput.trim();

        if (
          name.length === 0 ||
          role.length === 0 ||
          email.length === 0 ||
          !email.includes('@') ||
          phone.length === 0
        ) {
          return true;
        }
        return false;
      }
    }
  },
  mounted() {
    this.currentEmployeeId = this.employeesModel.length;
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
            <th scope="col">Role</th>
            <th scope="col">Email</th>
            <th scope="col">Phone #</th>
            <th scope="col">Actions</th>
          </tr>
        </thead>
        <tbody class="table-group-divider">
          <tr v-for="employee in filteredEmployees" :key="employee.id">
            <th scope="row">{{ employee.name }}</th>
            <td>{{ employee.role }}</td>
            <td>{{ employee.email }}</td>
            <td>{{ employee.phone }}</td>
            <td>
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
    <Footer>
      <div>
        <img src="../assets/company_logo.png" height="30" alt="company logo" />
        <span>RO-ED Trucking Management System</span>
      </div>
      <div>
        <em>
          <small
            >Introduce opportunities for our Partner Operators and offer
            solution</small
          >
        </em>
      </div>
    </Footer>
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
            <label for="employeeRole" class="form-label d-block text-start"
              >Role</label
            >
            <input
              v-model="employeeRoleInput"
              type="text"
              class="form-control"
              id="employeeRole"
              aria-describedby="employeeRole"
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
              aria-describedby="employeeEmail"
            />
          </div>
          <div class="mb-3">
            <label for="employeeContact" class="form-label d-block text-start"
              >Contact Number</label
            >
            <input
              v-model="employeePhoneInput"
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
        <form id="editEmployeeForm" @submit.prevent="saveChanges">
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
            <label for="newEmployeeRole" class="form-label d-block text-start"
              >Role</label
            >
            <input
              v-model="editEmployeeRoleInput"
              type="text"
              class="form-control"
              id="newEmployeeRole"
              aria-describedby="newEmployeeRole"
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
              v-model="editEmployeePhoneInput"
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
          type="submit"
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

.modal-body label {
  text-transform: uppercase;
  font-weight: bold;
  color: #86b9b0;
}

.modal-footer button {
  background-color: #4c7273;
}
</style>
