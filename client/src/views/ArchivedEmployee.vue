<script>
import SearchIcon from '../components/Icons/SearchIcon.vue';
import RecoverIcon from '../components/Icons/RecoverIcon.vue';
import TrashIcon from '../components/Icons/TrashIcon.vue';
import Modal from '../components/Modal.vue';

import {
  httpCreateEmployee,
  httpRecoverArchivedEmployee,
  httpDeleteArchivedEmployee
} from '../requests/requests';

export default {
  name: 'ArchivedEmployee',
  components: {
    SearchIcon,
    RecoverIcon,
    TrashIcon,
    Modal
  },
  data() {
    return {
      selectedDeleteArchivedEmployee: null,
      searchInput: ''
    };
  },
  computed: {
    archivedEmployees() {
      return this.$store.getters['archivedEmployees/archivedEmployees'];
    },
    filteredEmployees() {
      const archivedEmployees = this.archivedEmployees.filter(
        (archivedEmployee) =>
          archivedEmployee.name
            .toLowerCase()
            .includes(this.searchInput.toLowerCase())
      );

      return archivedEmployees;
    }
  },
  methods: {
    async recoverEmployeeInformation(archivedEmployeeId) {
      const selectedArchivedEmployee = this.$store.getters[
        'archivedEmployees/archivedEmployees'
      ].find((archivedEmployee) => archivedEmployee.id === archivedEmployeeId);

      const recoveredEmployee = await httpCreateEmployee(
        selectedArchivedEmployee
      );
      this.$store.dispatch('employees/addEmployee', recoveredEmployee);
      this.removeArchivedEmployeeFromStore(archivedEmployeeId);
      httpRecoverArchivedEmployee(archivedEmployeeId);
    },
    removeArchivedEmployeeFromStore(employeeId) {
      this.$store.dispatch(
        'archivedEmployees/deleteArchivedEmployee',
        employeeId
      );
    },
    deleteArchivedEmployee(archivedEmployeeId) {
      httpDeleteArchivedEmployee(archivedEmployeeId)
      this.removeArchivedEmployeeFromStore(archivedEmployeeId);
    }
  },
  async mounted() {
    await this.$store.dispatch('archivedEmployees/loadArchivedEmployees');
  }
};
</script>

<template>
  <div class="d-flex flex-column justify-content-between h-100">
    <header class="mb-5">
      <h1>Archived Employees</h1>
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
      </div>
      <table class="table">
        <thead class="tbl-header text-light rounded">
          <tr>
            <th scope="col">Name</th>
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
            <td class="align-middle">{{ employee.role }}</td>
            <td class="align-middle">{{ employee.vehicle_type }}</td>
            <td class="align-middle">{{ employee.plate_number }}</td>
            <td class="align-middle">{{ employee.email }}</td>
            <td class="align-middle">{{ employee.contact_number }}</td>
            <td class="align-middle">
              <RecoverIcon
                @click.prevent="recoverEmployeeInformation(employee.id)"
                class="mx-2"
                role="button"
              ></RecoverIcon>
              <TrashIcon
                data-bs-toggle="modal"
                data-bs-target="#deleteArchivedEmployee"
                class="mx-2"
                role="button"
                @click="selectedDeleteArchivedEmployee = employee.id"
              ></TrashIcon>
            </td>
          </tr>
        </tbody>
      </table>
    </main>
  </div>
  <Modal id="deleteArchivedEmployee">
    <template v-slot:modal-header>
      <div class="modal-header justify-content-center border-bottom-0">
        <h1 class="modal-title fs-5" id="deleteArchivedEmployeeLabel">
          Delete Archived Employee
        </h1>
      </div>
    </template>
    <template v-slot:modal-body>
      <div class="modal-body">
        <p>Are you sure you want to delete this?</p>
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
          @click.prevent="deleteArchivedEmployee(selectedDeleteArchivedEmployee)"
        >
          Delete
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
  width: 14%;
}
</style>
