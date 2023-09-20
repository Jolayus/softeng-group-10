<script>
import SearchIcon from '../components/Icons/SearchIcon.vue';

export default {
  name: 'ArchivedEmployee',
  components: {
    SearchIcon
  },
  data() {
    return {
      selectedEmployee: null,
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
            <th class="w-20" scope="col">Name</th>
            <th class="w-20" scope="col">Role</th>
            <th class="w-20" scope="col">Email</th>
            <th class="w-20" scope="col">Phone #</th>
            <th class="w-20" scope="col">Actions</th>
          </tr>
        </thead>
        <tbody class="table-group-divider">
          <tr v-for="employee in filteredEmployees" :key="employee.id">
            <th class="align-middle" scope="row">{{ employee.name }}</th>
            <td class="align-middle">{{ employee.role }}</td>
            <td class="align-middle">{{ employee.email }}</td>
            <td class="align-middle">{{ employee.contact_number }}</td>
            <td class="align-middle"></td>
          </tr>
        </tbody>
      </table>
    </main>
  </div>
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
