<script>
import * as XLSX from 'xlsx';

import CompanyTab from '../components/CompanyTab.vue';
import TabPane from '../components/TabPane.vue';
import Footer from '../components/Footer.vue';
import FloatingActionButtonVue from '../components/FloatingActionButton.vue';
import Modal from '../components/Modal.vue';

import { getClientModel } from '../model/client.model';

export default {
  name: 'Trip Rates',
  data() {
    return {
      clients: getClientModel(),
      startRow: undefined,
      endRow: undefined,
      startColumn: undefined,
      endColumn: undefined
    };
  },
  components: {
    CompanyTab,
    TabPane,
    Footer,
    FloatingActionButtonVue,
    Modal
  },
  methods: {
    onFileUpload() {
      const file = this.$refs.fileInput.files[0];
      const reader = new FileReader();
      reader.readAsBinaryString(file);

      reader.addEventListener('load', (event) => {
        const data = event.target.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[1];
        const worksheet = workbook.Sheets[sheetName];

        const range = `${this.startColumn}${this.startRow}:${this.endColumn}${this.endRow}`;
        const json = XLSX.utils.sheet_to_json(worksheet, {
          range
        });

        const result = json.map(row => {
          return {
            'province': row['PROVINCE'],
            'city': row['CITY / MUNICIPALITY'],
            'AUV': row['AUV'] ? Math.ceil(row['AUV'] * 100) / 100 : undefined,
            '4W': row['4W'] ? Math.ceil(row['4W'] * 100) / 100 : undefined,
            '6WF': row['6WF'] ? Math.ceil(row['6WF'] * 100) / 100 : undefined,
            '6W ELF': row['6W ELF'] ? Math.ceil(row['6W ELF'] * 100) / 100 : undefined,
            '10W': row['10W'] ? Math.ceil(row['10W'] * 100) / 100 : undefined
          };  
        });

        console.log(json);
        console.log(result);

      });
    }
  }
};
</script>

<template>
  <h1>Clients - Trip Rates</h1>
  <ul class="nav nav-pills mb-3 gap-2" id="pills-tab" role="tablist">
    <CompanyTab
      v-for="client in clients"
      :classes="client === clients[0] ? 'active' : ''"
      :id="'pills-' + client.companyName.split(' ').join('') + '-tab'"
      :target="'#pills-' + client.id"
      :selected="client === clients[0] ? true : false"
    >
      {{ client.companyName }}
    </CompanyTab>
  </ul>
  <div class="tab-content" id="pills-tabContent">
    <TabPane
      v-for="client in clients"
      :classes="client === clients[0] ? 'active show' : ''"
      :id="'pills-' + client.id"
    >
      {{ client.companyName }}
    </TabPane>
  </div>

  <Modal id="uploadFileModal">
    <template v-slot:modal-header>
      <div class="modal-header justify-content-center border-bottom-0">
        <h1 class="modal-title fs-5" id="uploadFileLabel">
          Upload Excel File
        </h1>
      </div>
    </template>
    <template v-slot:modal-body>
      <div class="modal-body">
        <form id="uploadFileForm" @submit.prevent="this.onFileUpload">
          <div class="mb-3">
            <label for="file" class="form-label d-block text-start"
              >File:</label
            >
            <input
              type="file"
              class="form-control"
              id="file"
              ref="fileInput"
            />
          </div>
          <div class="mb-3">
            <label for="startRow" class="form-label d-block text-start"
              >Start Row:</label
            >
            <input
              type="number"
              class="form-control"
              id="startRow"
              v-model="startRow"
            />
          </div>
          <div class="mb-3">
            <label for="endRow" class="form-label d-block text-start"
              >End Row:</label
            >
            <input
              type="number"
              class="form-control"
              id="endRow"
              v-model="endRow"
            />
          </div>
          <div class="mb-3">
            <label for="startColumn" class="form-label d-block text-start"
              >Start Column:</label
            >
            <input
              type="text"
              class="form-control"
              id="startColumn"
              v-model="startColumn"
            />
          </div>
          <div class="mb-3">
            <label for="endColumn" class="form-label d-block text-start"
              >End Column:</label
            >
            <input
              type="text"
              class="form-control"
              id="endColumn"
              v-model="endColumn"
            />
          </div>
        </form>
      </div>
    </template>
    <template v-slot:modal-footer>
      <div class="modal-footer justify-content-center border-top-0">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
          Cancel
        </button>
        <button
          type="submit"
          class="btn btn-primary tms-btn"
          form="uploadFileForm"
        >
          Upload
        </button>
      </div>
    </template>
  </Modal>
  <FloatingActionButtonVue isForTripRates="true" uploadModalId="uploadFileModal" />
</template>
