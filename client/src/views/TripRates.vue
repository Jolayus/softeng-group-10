<script>
import * as XLSX from 'xlsx';

import CompanyTab from '../components/CompanyTab.vue';
import TabPane from '../components/TabPane.vue';
import Footer from '../components/Footer.vue';
import FloatingActionButtonVue from '../components/FloatingActionButton.vue';
import Modal from '../components/Modal.vue';

import { getClientsModel } from '../models/client.model';
import { getTripRatesModel } from '../models/triprates.model';

export default {
  name: 'Trip Rates',
  data() {
    return {
      clients: getClientsModel(),
      tripRates: getTripRatesModel(),
      isValidFormat: undefined,
      currentTripRates: {},
      currentClient: {}
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
    // A method that formats the result from sheet_to_json method
    formatJson(json, branch) {
      const result = json.map((row) => {
        return {
          branch,
          client: this.currentClient.company_name,
          province: row['PROVINCE'],
          city: row['CITY / MUNICIPALITY'],
          AUV: row['AUV'] ? Math.ceil(row['AUV'] * 100) / 100 : undefined,
          '4W': row['4W'] ? Math.ceil(row['4W'] * 100) / 100 : undefined,
          '6WF': row['6WF'] ? Math.ceil(row['6WF'] * 100) / 100 : undefined,
          '6W ELF': row['6W ELF']
            ? Math.ceil(row['6W ELF'] * 100) / 100
            : undefined,
          '10W': row['10W'] ? Math.ceil(row['10W'] * 100) / 100 : undefined
        };
      });

      return result;
    },

    onFileSubmitHandler() {
      const file = this.$refs.fileInput.files[0];
      const reader = new FileReader();
      reader.readAsBinaryString(file);

      reader.addEventListener('load', (event) => {
        const data = event.target.result;
        const workbook = XLSX.read(data, { type: 'binary' });

        const { SheetNames } = workbook;

        SheetNames.forEach((SheetName) => {
          const worksheet = workbook.Sheets[SheetName];
          const range = 'A11:Z500'; // this range is valid if the user follow the given format
          const json = XLSX.utils.sheet_to_json(worksheet, {
            range
          });

          const result = this.formatJson(json, SheetName);

          const firstRow = result[0];
          try {
            if (
              firstRow === undefined ||
              firstRow.province === undefined ||
              firstRow.city === undefined
            ) {
              throw new Error('Invalid Format');
            }
            this.isValidFormat = true;
            this.tripRates.push(...result);
            this.currentTripRates = this.tripRates.filter(
              (tripRate) => tripRate.client === this.currentClient.company_name
            );
          } catch (err) {
            this.isValidFormat = false;
          }
        });
      });
    },

    // Used to re-assign the value of currentTripRates to be show
    tabChangeHandler(id) {
      this.currentClient = this.clients.find((client) => client.id === id);
      this.currentTripRates = this.tripRates.filter(
        (tripRate) => tripRate.client === this.currentClient.company_name
      );
    }
  },
  mounted() {
    this.currentClient = this.clients[0];
    this.currentTripRates = this.tripRates.filter(
      (tripRate) => tripRate.client === this.currentClient.company_name
    );
  }
};
</script>

<template>
  <h1>Clients - Trip Rates</h1>
  <ul class="nav nav-pills mb-3 gap-2" id="pills-tab" role="tablist">
    <CompanyTab
      v-for="client in clients"
      :classes="client === clients[0] ? 'active' : ''"
      :id="'pills-' + client.company_name.split(' ').join('') + '-tab'"
      :target="'#pills-' + client.id"
      :selected="client === clients[0] ? true : false"
      @tabChange="tabChangeHandler"
      :key="client.id"
      :clientId="client.id"
    >
      {{ client.company_name }}
    </CompanyTab>
  </ul>
  <div class="tab-content" id="pills-tabContent">
    <TabPane
      v-for="client in clients"
      :classes="client === clients[0] ? 'active show' : ''"
      :id="'pills-' + client.id"
      :key="client.id"
    >
      {{ currentTripRates }}
    </TabPane>
  </div>

  <Modal id="uploadFileModal">
    <template v-slot:modal-header>
      <div class="modal-header justify-content-center border-bottom-0">
        <h1 class="modal-title fs-5" id="uploadFileLabel">Upload Excel File</h1>
      </div>
    </template>
    <template v-slot:modal-body>
      <div class="modal-body">
        <div>
          <span>Trip Rates Format: </span>
          <a
            href="https://docs.google.com/spreadsheets/d/10RxQvNb0-a24lsKOUYv-1dzZEri5leVD/edit?usp=sharing&ouid=106127419470207496838&rtpof=true&sd=true"
            class="link-success"
            target="_blank"
            >Click here</a
          >
        </div>
        <form id="uploadFileForm" @submit.prevent="onFileSubmitHandler">
          <div class="mb-3">
            <label for="file" class="form-label d-block text-start"
              >File:</label
            >
            <input
              type="file"
              class="form-control"
              id="file"
              ref="fileInput"
              required
            />
          </div>
        </form>
      </div>
    </template>
    <template v-slot:modal-footer>
      <p v-show="isValidFormat === true" class="text-success">Valid Format</p>
      <p v-show="isValidFormat === false" class="text-danger">Invalid Format</p>
      <div class="modal-footer justify-content-center border-top-0">
        <button
          v-if="isValidFormat"
          type="button"
          class="btn btn-success"
          data-bs-dismiss="modal"
        >
          Continue
        </button>
        <div
          v-else
          style="min-width: 170px"
          class="d-flex justify-content-around"
        >
          <button
            type="button"
            class="btn btn-secondary"
            data-bs-dismiss="modal"
          >
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
      </div>
    </template>
  </Modal>
  <FloatingActionButtonVue
    isForTripRates="true"
    uploadModalId="uploadFileModal"
  />
</template>
