<script>
import SearchIcon from '../components/Icons/SearchIcon.vue';
import { getClientsModel } from '../models/client.model';

export default {
    name: 'ArchivedClient',
    components: {
        SearchIcon,
    },
    data() {
        return {
            clientsModel: getClientsModel(),
            selectedClient: null,
            currentClientId: 0,
            searchInput: '',
        };
    },
    computed: {
        filteredClient() {
            return this.clientsModel.filter((client) =>
                client.company_name
                    .toLowerCase()
                    .includes(this.searchInput.toLowerCase())
            );
        },
    },
    mounted() {
        this.currentClientId = this.clientsModel.length;
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
                <th scope="col">Company Name</th>
                <th scope="col">Contact Person</th>
                <th scope="col">Contact Number</th>
                <th scope="col">Address</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody class="table-group-divider">
              <tr v-for="client in filteredClient" :key="client.id">
                <th scope="row">{{ client.company_name }}</th>
                <td>{{ client.contact_person }}</td>
                <td>{{ client.contact_number }}</td>
                <td>{{ client.address }}</td>
                <td>

                </td>
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