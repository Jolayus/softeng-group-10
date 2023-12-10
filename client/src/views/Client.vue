<script>
import SearchIcon from '../components/Icons/SearchIcon.vue';
import EditIcon from '../components/Icons/EditIcon.vue';
import TrashIcon from '../components/Icons/TrashIcon.vue';
import Modal from '../components/Modal.vue';
import { getClientsModel } from '../models/client.model';

import {
  httpCreateClient,
  httpUpdateClient,
  httpArchiveClient,
  httpEditClientName
} from '../requests/requests';

export default {
  name: 'Client',
  components: {
    SearchIcon,
    EditIcon,
    TrashIcon,
    Modal
  },
  data() {
    return {
      selectedClient: null,
      searchInput: '',
      clientCompanyNameInput: '',
      clientContactPersonInput: '',
      clientContactNumberInput: '',
      clientAddressInput: '',
      editClientCompanyNameInput: '',
      editClientContactPersonInput: '',
      editClientContactNumberInput: '',
      editClientAddressInput: '',
      editClientId: '',
      currentModal: ''
    };
  },
  methods: {
    archiveClient(id) {
      httpArchiveClient(id).then((archivedClient) => {
        this.$store.dispatch('clients/archiveClient', archivedClient.id);
      });
    },
    addNewClient() {
      const company_name = this.clientCompanyNameInput.trim();
      const contact_person = this.clientContactPersonInput.trim();
      const contact_number = this.clientContactNumberInput.trim();
      const address = this.clientAddressInput.trim();

      const newClient = {
        company_name,
        contact_person,
        contact_number,
        address
      };

      httpCreateClient(newClient).then((client) => {
        this.$store.dispatch('clients/addClient', client);
      });

      this.clientCompanyNameInput = '';
      this.clientContactPersonInput = '';
      this.clientContactNumberInput = '';
      this.clientAddressInput = '';
    },
    onEdit(client) {
      this.currentModal = 'EDIT';

      const { id, company_name, contact_person, contact_number, address } =
        client;

      this.editClientId = id;
      this.editClientCompanyNameInput = company_name;
      this.editClientContactPersonInput = contact_person;
      this.editClientContactNumberInput = contact_number;
      this.editClientAddressInput = address;
    },
    saveChanges() {
      const newDetails = {
        id: this.editClientId,
        company_name: this.editClientCompanyNameInput,
        contact_person: this.editClientContactPersonInput,
        contact_number: this.editClientContactNumberInput,
        address: this.editClientAddressInput
      };

      const client = this.clients.find(
        (client) => client.id === this.editClientId
      );

      const newName = this.editClientCompanyNameInput;
      const prevName = client.company_name;

      this.$store.dispatch('tripRates/updateTripClientName', {
        newName,
        prevName
      });

      httpEditClientName(newName, prevName);

      httpUpdateClient(newDetails);
      this.$store.dispatch('clients/editClient', newDetails);
    }
  },
  computed: {
    clients() {
      return this.$store.getters['clients/clients'];
    },
    tripRates() {
      return this.$store.getters['tripRates/tripRates'];
    },
    filteredClient() {
      return this.clients.filter((client) =>
        client.company_name
          .toLowerCase()
          .includes(this.searchInput.toLowerCase())
      );
    },
    isFormInvalid() {
      if (this.currentModal === 'ADD') {
        const company_name = this.clientCompanyNameInput.trim();
        const contact_person = this.clientContactPersonInput.trim();
        const contact_number = this.clientContactNumberInput.trim();
        const address = this.clientAddressInput.trim();

        if (
          company_name.length === 0 ||
          contact_person.length === 0 ||
          contact_number.length === 0 ||
          address.length === 0
        ) {
          return true;
        }
        return false;
      } else if (this.currentModal === 'EDIT') {
        const company_name = this.editClientCompanyNameInput.trim();
        const contact_person = this.editClientContactPersonInput.trim();
        const contact_number = this.editClientContactNumberInput.trim();
        const address = this.editClientAddressInput.trim();

        if (
          company_name.length === 0 ||
          contact_person.length === 0 ||
          contact_number.length === 0 ||
          address.length === 0
        ) {
          return true;
        }
        return false;
      }
    },
    isUniqueEditClientCompanyName() {
      const newCompanyName = this.editClientCompanyNameInput.toLowerCase();
      return this.clients.every((client) => {
        return (
          client.id === this.editClientId ||
          client.company_name.toLowerCase() !== newCompanyName
        );
      });
    },
    isUniqueNewClientCompanyName() {
      const newCompanyName = this.clientCompanyNameInput.toLowerCase();
      return this.clients.every((client) => {
        return client.company_name.toLowerCase() !== newCompanyName;
      });
    }
  }
};
</script>

<template>
  <div class="d-flex flex-column justify-content-between h-100">
    <header class="mb-5">
      <h1>Client</h1>
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
        <button
          type="button"
          data-bs-toggle="modal"
          data-bs-target="#clientModal"
          class="btn tms-btn text-light d-flex align-items-center h-100"
          @click="currentModal = 'ADD'"
        >
          Add new client
        </button>
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
          <tr class="f-flex" v-for="client in filteredClient" :key="client.id">
            <th class="align-middle" scope="row">{{ client.company_name }}</th>
            <td class="align-middle">{{ client.contact_person }}</td>
            <td class="align-middle">{{ client.contact_number }}</td>
            <td class="align-middle">{{ client.address }}</td>
            <td class="align-middle">
              <EditIcon
                data-bs-toggle="modal"
                data-bs-target="#editClientModal"
                @click.prevent="onEdit(client)"
                class="mx-2 text-primary"
                role="button"
              />
              <TrashIcon
                data-bs-toggle="modal"
                data-bs-target="#archiveClientVerif"
                @click.prevent="selectedClient = client.id"
                class="mx-2 text-danger"
                role="button"
              />
            </td>
          </tr>
        </tbody>
      </table>
    </main>
  </div>

  <Modal id="clientModal">
    <template v-slot:modal-header>
      <div class="modal-header justify-content-center border-bottom-0">
        <h1 class="modal-title fs-5" id="clientModalLabel">
          Client's Information
        </h1>
      </div>
    </template>
    <template v-slot:modal-body>
      <div class="modal-body">
        <form id="clientForm" @submit.prevent="addNewClient">
          <div class="mb-3">
            <label for="clientCompanyName" class="form-label d-block text-start"
              >Company Name</label
            >
            <input
              v-model="clientCompanyNameInput"
              type="text"
              class="form-control"
              id="clientCompanyName"
              aria-describedby="clientCompanyName"
            />
            <p class="fw-bold text-danger" v-if="!isUniqueNewClientCompanyName">
              The new client name is already existing!
            </p>
          </div>
          <div class="mb-3">
            <label
              for="clientContactPerson"
              class="form-label d-block text-start"
              >Contact Person</label
            >
            <input
              v-model="clientContactPersonInput"
              type="text"
              class="form-control"
              id="clientContactPerson"
              aria-describedby="clientContactPerson"
            />
          </div>
          <div class="mb-3">
            <label
              for="clientContactNumber"
              class="form-label d-block text-start"
              >Contact Number</label
            >
            <input
              v-model="clientContactNumberInput"
              type="text"
              class="form-control"
              id="clientContactNumber"
              aria-describedby="clientContactNumber"
            />
          </div>
          <div class="mb-3">
            <label for="clientAddress" class="form-label d-block text-start"
              >Address</label
            >
            <input
              v-model="clientAddressInput"
              type="text"
              class="form-control"
              id="clientAddress"
              aria-describedby="clientAddress"
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
          form="clientForm"
          data-bs-dismiss="modal"
          :disabled="isFormInvalid || !isUniqueNewClientCompanyName"
        >
          Add Client
        </button>
      </div>
    </template>
  </Modal>

  <Modal id="editClientModal">
    <template v-slot:modal-header>
      <div class="modal-header justify-content-center border-bottom-0">
        <h1 class="modal-title fs-5" id="editClientLabel">
          Edit Client's Information
        </h1>
      </div>
    </template>
    <template v-slot:modal-body>
      <div class="modal-body">
        <form id="editClientForm" @submit.prevent="saveChanges">
          <div class="mb-3">
            <label
              for="newClientCompanyName"
              class="form-label d-block text-start"
              >Company Name</label
            >
            <input
              v-model="editClientCompanyNameInput"
              type="text"
              class="form-control"
              id="newClientCompanyName"
              aria-describedby="newClientCompanyName"
            />
            <p
              class="fw-bold text-danger"
              v-if="!isUniqueEditClientCompanyName"
            >
              The edited client name is already existing!
            </p>
          </div>
          <div class="mb-3">
            <label
              for="newClientContactPerson"
              class="form-label d-block text-start"
              >Contact Person</label
            >
            <input
              v-model="editClientContactPersonInput"
              type="text"
              class="form-control"
              id="newClientContactPerson"
              aria-describedby="newClientContactPerson"
            />
          </div>
          <div class="mb-3">
            <label
              for="newClienContactNumber"
              class="form-label d-block text-start"
              >Contact Number</label
            >
            <input
              v-model="editClientContactNumberInput"
              type="text"
              class="form-control"
              id="newClienContactNumber"
              aria-describedby="newClienContactNumber"
            />
          </div>
          <div class="mb-3">
            <label for="newClientAddress" class="form-label d-block text-start"
              >Address</label
            >
            <input
              v-model="editClientAddressInput"
              type="text"
              class="form-control"
              id="newClientAddress"
              aria-describedby="newClientAddress"
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
          form="editClientForm"
          data-bs-dismiss="modal"
          :disabled="isFormInvalid || !isUniqueEditClientCompanyName"
        >
          Save changes
        </button>
      </div>
    </template>
  </Modal>

  <Modal id="archiveClientVerif">
    <template v-slot:modal-header>
      <div class="modal-header justify-content-center border-bottom-0">
        <h1 class="modal-title fs-5" id="archiveClientVerifLabel">
          Archive Client
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
          @click.prevent="archiveClient(selectedClient)"
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
