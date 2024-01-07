<script>
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

import SearchIcon from '../components/Icons/SearchIcon.vue';
import RecoverIcon from '../components/Icons/RecoverIcon.vue';
import TrashIcon from '../components/Icons/TrashIcon.vue';
import Modal from '../components/Modal.vue';

import {
  httpCreateEmployee,
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
      selectedDeleteArchivedEmployeeId: null,
      searchInput: ''
    };
  },
  methods: {
    async recoverArchivedEmployee(archivedEmployeeId) {
      // The archived employee information to be recover
      const selectedArchivedEmployee = this.$store.getters[
        'archivedEmployees/archivedEmployees'
      ].find((archivedEmployee) => archivedEmployee.id === archivedEmployeeId);

      // Add the archived employee information to the employee database
      const recoveredArchivedEmployee = await httpCreateEmployee(
        selectedArchivedEmployee
      );

      // Add the archived employee information to the employees store
      this.$store.dispatch('employees/addEmployee', recoveredArchivedEmployee);

      // Removing archived employee information from archivedEmployee database and store
      this.deleteArchivedEmployee(archivedEmployeeId);
    },
    async deleteArchivedEmployee(archivedEmployeeId) {
      // Remove archived employee information to the archivedEmployee database
      await httpDeleteArchivedEmployee(archivedEmployeeId);

      // Remove archived employee information to the archivedEmployee store
      this.$store.dispatch(
        'archivedEmployees/deleteArchivedEmployee',
        archivedEmployeeId
      );
    },

    handleGenerateCopy() {
      const doc = new jsPDF({
        orientation: 'landscape'
      });

      const dateOptions = { day: 'numeric', month: 'short', year: '2-digit' };
      const currentDate = new Date()
        .toLocaleDateString('en-GB', dateOptions)
        .replace(/\s/g, '-');

      doc.text('List of Archived Employees', 15, 15);
      doc.text(`Date: ${currentDate}`, 15, 20);

      const columns = [
        [
          'Name',
          'Date Hired',
          'Role',
          'Driver Name',
          'Vehicle Type',
          'Plate Number',
          'Email',
          'Contact Number'
        ]
      ];
      const rows = [];

      for (const archivedEmployee of this.archivedEmployees) {
        const {
          name,
          date_hired,
          role,
          driver_name,
          vehicle_type,
          plate_number,
          email,
          contact_number
        } = archivedEmployee;
        const row = [
          name,
          date_hired,
          role,
          driver_name,
          vehicle_type,
          plate_number,
          email,
          contact_number
        ];
        rows.push(row);
      }

      autoTable(doc, {
        head: columns,
        body: rows,
        startY: 30
      });

      console.log(currentDate);
      doc.save(`archivedEmployees ${currentDate}.pdf`);
    }
  },
  computed: {
    archivedEmployees() {
      return this.$store.getters['archivedEmployees/archivedEmployees'];
    },
    isArchivedEmployeesEmpty() {
      return this.archivedEmployees.length === 0;
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
            :disabled="isArchivedEmployeesEmpty"
          />
        </div>
        <button
          class="btn tms-btn text-light px-5"
          @click="handleGenerateCopy"
          :disabled="isArchivedEmployeesEmpty"
        >
          Generate Copy
        </button>
      </div>
      <table class="table">
        <thead class="tbl-header text-light rounded">
          <tr>
            <th class="align-middle" scope="col">Name</th>
            <th class="align-middle" scope="col">Date Hired</th>
            <th class="align-middle" scope="col">Role</th>
            <th class="align-middle" scope="col">Driver's Name</th>
            <th class="align-middle" scope="col">Vehicle type</th>
            <th class="align-middle" scope="col">Plate #</th>
            <th class="align-middle" scope="col">Email</th>
            <th class="align-middle" scope="col">Phone #</th>
            <th class="align-middle" scope="col">Actions</th>
          </tr>
        </thead>
        <tbody class="table-group-divider">
          <tr v-for="employee in filteredEmployees" :key="employee.id">
            <th class="align-middle" scope="row">{{ employee.name }}</th>
            <td class="align-middle" scope="row">{{ employee.date_hired }}</td>
            <td class="align-middle">{{ employee.role }}</td>
            <td class="align-middle">{{ employee.driver_name }}</td>
            <td class="align-middle">{{ employee.vehicle_type }}</td>
            <td class="align-middle">{{ employee.plate_number }}</td>
            <td class="align-middle">{{ employee.email }}</td>
            <td class="align-middle">{{ employee.contact_number }}</td>
            <td class="align-middle">
              <RecoverIcon
                @click.prevent="recoverArchivedEmployee(employee.id)"
                class="mx-2"
                role="button"
              ></RecoverIcon>
              <TrashIcon
                data-bs-toggle="modal"
                data-bs-target="#deleteArchivedEmployee"
                class="mx-2"
                role="button"
                @click="selectedDeleteArchivedEmployeeId = employee.id"
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
          @click.prevent="
            deleteArchivedEmployee(selectedDeleteArchivedEmployeeId)
          "
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
  width: 11.11%;
}
</style>
