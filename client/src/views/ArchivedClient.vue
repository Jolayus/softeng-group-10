<script>
import SearchIcon from '../components/Icons/SearchIcon.vue';
import { getClientsModel } from '../models/client.model';

export default {
  name: 'ArchivedClient',
  components: {
    SearchIcon
  },
  data() {
    return {
      clientsModel: getClientsModel(),
      searchInput: ''
    };
  },
  computed: {
    archivedClients() {
      return this.$store.getters['archivedClients/archivedClients'];
    },
    filteredClient() {
      return this.archivedClients.filter((archivedClient) =>
        archivedClient.company_name
          .toLowerCase()
          .includes(this.searchInput.toLowerCase())
      );
    }
  },
  async mounted() {
    await this.$store.dispatch('archivedClients/loadArchivedClients');
  }
};
</script>

<template>
  <div class="d-flex flex-column justify-content-between h-100">
    <header class="mb-5">
      <h1>Archived Clients</h1>
    </header>
    <main class="container flex-grow-1">
      <div class="d-flex justify-content-between mb-4" style="max-height: 35px">
        <div class="input-group mb-3 h-100 align-items-center gap-2">
          <label for="user-input">Search:</label>
          <input
            v-model="searchInput"
            type="text"
            class="form-control"
            placeholder="Client's name"
            aria-label="Recipient's username"
            id="user-input"
            aria-describedby="basic-addon2"
          />
        </div>
      </div>
      <table class="table">
        <thead class="tbl-header text-light rounded">
          <tr>
            <th class="w-20" scope="col">Company Name</th>
            <th class="w-20" scope="col">Contact Person</th>
            <th class="w-20" scope="col">Contact Number</th>
            <th class="w-20" scope="col">Address</th>
            <th class="w-20" scope="col">Actions</th>
          </tr>
        </thead>
        <tbody class="table-group-divider">
          <tr v-for="client in filteredClient" :key="client.id">
            <th class="align-middle" scope="row">{{ client.company_name }}</th>
            <td class="align-middle">{{ client.contact_person }}</td>
            <td class="align-middle">{{ client.contact_number }}</td>
            <td class="align-middle">{{ client.address }}</td>
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
