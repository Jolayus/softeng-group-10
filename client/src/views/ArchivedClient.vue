<script>
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

import Modal from '../components/Modal.vue';
import RecoverIcon from '../components/Icons/RecoverIcon.vue';
import TrashIcon from '../components/Icons/TrashIcon.vue';

import {
  httpRecoverArchivedClient,
  httpDeleteArchivedClient
} from '../requests/requests';

export default {
  name: 'ArchivedClient',
  components: {
    Modal,
    RecoverIcon,
    TrashIcon
  },
  data() {
    return {
      searchInput: '',
      selectedDeleteArchivedClientId: null
    };
  },
  methods: {
    async recoverArchivedClient(archivedClientId) {
      const recoveredClient = await httpRecoverArchivedClient(archivedClientId);
      this.$store.dispatch('clients/addClient', recoveredClient);
      this.$store.dispatch(
        'archivedClients/deleteArchivedClient',
        archivedClientId
      );
    },
    async deleteArchivedClient(archivedClientId) {
      // Remove archived client information to the archivedClient database
      await httpDeleteArchivedClient(archivedClientId);

      // Remove archived client information to the archivedClient store
      this.$store.dispatch(
        'archivedClients/deleteArchivedClient',
        archivedClientId
      );
    },
    handleGenerateCopy() {
      const doc = new jsPDF({
        orientation: 'landscape'
      });

      const columns = [
        [
          'Company Name',
          'Address',
          'Contact Person',
          'Contact Number',
          'Email',
          'Contract Number'
        ]
      ];
      const rows = [];

      for (const archivedClient of this.archivedClients) {
        const {
          company_name,
          address,
          contact_person,
          contact_number,
          email,
          contract_number
        } = archivedClient;
        const row = [
          company_name,
          address,
          contact_person,
          contact_number,
          email,
          contract_number
        ];
        rows.push(row);
      }

      autoTable(doc, {
        head: columns,
        body: rows,
        startY: 20
      });

      const dateOptions = { day: 'numeric', month: 'short', year: '2-digit' };
      const currentDate = new Date()
        .toLocaleDateString('en-GB', dateOptions)
        .replace(/\s/g, '-');

      doc.save(`archivedEmployees ${currentDate}.pdf`);
    }
  },
  computed: {
    archivedClients() {
      return this.$store.getters['archivedClients/archivedClients'];
    },
    isArchivedClientsEmpty() {
      return this.archivedClients.length === 0;
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
            :disabled="isArchivedClientsEmpty"
          />
        </div>
        <button
          class="btn tms-btn text-light px-5"
          @click="handleGenerateCopy"
          :disabled="isArchivedClientsEmpty"
        >
          Generate Copy
        </button>
      </div>
      <table class="table">
        <thead class="tbl-header text-light rounded">
          <tr>
            <th scope="col">Company Name</th>
            <th scope="col">Address</th>
            <th scope="col">Contact Person</th>
            <th scope="col">Contact Number</th>
            <th scope="col">Email</th>
            <th scope="col">Contract Number</th>
            <th scope="col">Actions</th>
          </tr>
        </thead>
        <tbody class="table-group-divider">
          <tr v-for="client in filteredClient" :key="client.id">
            <th class="align-middle" scope="row">{{ client.company_name }}</th>
            <td class="align-middle">{{ client.address }}</td>
            <td class="align-middle">{{ client.contact_person }}</td>
            <td class="align-middle">{{ client.contact_number }}</td>
            <td class="align-middle">{{ client.email }}</td>
            <td class="align-middle">{{ client.contract_number }}</td>
            <td class="align-middle">
              <RecoverIcon
                @click.prevent="recoverArchivedClient(client.id)"
                class="mx-2"
                role="button"
              ></RecoverIcon>
              <TrashIcon
                data-bs-toggle="modal"
                data-bs-target="#deleteArchiveClient"
                class="mx-2"
                role="button"
                @click="selectedDeleteArchivedClientId = client.id"
              ></TrashIcon>
            </td>
          </tr>
        </tbody>
      </table>
    </main>
  </div>
  <Modal id="deleteArchiveClient">
    <template v-slot:modal-header>
      <div class="modal-header justify-content-center border-bottom-0">
        <h1 class="modal-title fs-5" id="deleteArchivedClientLabel">
          Delete Archived Client
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
          @click.prevent="deleteArchivedClient(selectedDeleteArchivedClientId)"
        >
          Delete
        </button>
      </div>
    </template>
  </Modal>
</template>

<style scoped>
th {
  width: 14.28%;
}

.input-group {
  width: 45%;
}
</style>
