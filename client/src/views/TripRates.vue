<script>
import * as XLSX from 'xlsx';

import CompanyTab from '../components/CompanyTab.vue';
import TabPane from '../components/TabPane.vue';
import Footer from '../components/Footer.vue';
import FloatingActionButtonVue from '../components/FloatingActionButton.vue';
import Modal from '../components/Modal.vue';

import { getClientsModel } from '../models/client.model';
import { getTripRatesModel } from '../models/triprates.model';
import { httpCreateTripRates, httpDeleteTripRates } from '../requests/requests';

export default {
  name: 'Trip Rates',
  data() {
    return {
      clients: getClientsModel(),
      tripRates: getTripRatesModel(),
      currentTripRates: [],
      currentClient: getClientsModel()[0],
      isFileSubmitValidFormat: undefined,

      // Add Inputs
      addTripRatesClientNameInput: '',
      addTripRatesBranchInput: '',
      addTripRatesProvinceInput: '',
      addTripRatesCityInput: '',
      addTripRatesAUVInput: null,
      addTripRates4WInput: null,
      addTripRates6WElfInput: null,
      addTripRates6WFInput: null,
      addTripRates10WInput: null,

      // Delete Inputs
      deleteTripRatesBranchInput: '',
      deleteTripRatesProvinceInput: '',
      deleteTripRatesCityInput: ''
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
            this.isFileSubmitValidFormat = true;
            this.tripRates.push(...result);
            this.currentTripRates = this.tripRates.filter(
              (tripRate) =>
                tripRate.client_name === this.currentClient.company_name
            );
          } catch (err) {
            this.isFileSubmitValidFormat = false;
          }
        });
      });
    },

    // Used to re-assign the value of currentTripRates to be show
    tabChangeHandler(id) {
      this.currentClient = this.clients.find((client) => client.id === id);
      this.currentTripRates = this.tripRates.filter(
        (tripRate) => tripRate.client_name === this.currentClient.company_name
      );
    },

    // ADD TRIP RATES
    onSubmitAddTripRates() {
      const newTripRates = {
        client_name: this.addTripRatesClientNameInput,
        branch: this.addTripRatesBranchInput,
        province: this.addTripRatesProvinceInput,
        city: this.addTripRatesCityInput,
        auv: this.addTripRatesAUVInput,
        four_wheeler: this.addTripRates4WInput,
        six_wheeler_elf: this.addTripRates6WElfInput,
        six_wheeler_forward: this.addTripRates6WFInput,
        ten_wheeler: this.addTripRates10WInput
      };

      httpCreateTripRates(newTripRates)
        .then((tripRates) => {
          this.tripRates.push(tripRates);
          this.currentTripRates = this.tripRates.filter(
            (tripRate) =>
              tripRate.client_name === this.currentClient.company_name
          );
        })
        .catch((error) => {
          console.log(error);
        });
    },

    onSubmitDeleteTripRates() {
      const deletedTripRates = this.currentTripRates.find((tripRates) => {
        return (
          tripRates.branch.toLowerCase() ===
            this.deleteTripRatesBranchInput.toLowerCase() &&
          tripRates.province.toLowerCase() ===
            this.deleteTripRatesProvinceInput.toLowerCase() &&
          tripRates.city.toLowerCase() ===
            this.deleteTripRatesCityInput.toLowerCase()
        );
      });

      const { id } = deletedTripRates;
      httpDeleteTripRates(id)
        .then((id) => {
          this.tripRates = this.tripRates.filter((rate) => rate.id !== id);
          this.currentTripRates = this.currentTripRates.filter(
            (rate) => rate.id !== id
          );
        })
        .catch((error) => {
          console.log('Invalid inputs, trip rates not found based on input');
        });

      this.deleteTripRatesBranchInput = '';
      this.deleteTripRatesProvinceInput = '';
      this.deleteTripRatesCityInput = '';
    }
  },
  mounted() {
    this.currentTripRates = this.tripRates.filter(
      (tripRate) => tripRate.client_name === this.currentClient.company_name
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
      <p v-show="isFileSubmitValidFormat === true" class="text-success">
        Valid Format
      </p>
      <p v-show="isFileSubmitValidFormat === false" class="text-danger">
        Invalid Format
      </p>
      <div class="modal-footer justify-content-center border-top-0">
        <button
          v-if="isFileSubmitValidFormat"
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

  <Modal id="addTripRatesModal">
    <template v-slot:modal-header>
      <div class="modal-header justify-content-center border-bottom-0">
        <h1 class="modal-title fs-5" id="addTripRatesLabel">Add Trip Rates</h1>
      </div>
    </template>
    <template v-slot:modal-body>
      <div class="modal-body">
        <form id="addTripRatesForm" @submit.prevent="onSubmitAddTripRates">
          <div class="mb-3">
            <label
              for="addTripRatesClientName"
              class="form-label d-block text-start"
              >Client Name</label
            >
            <select
              class="form-select"
              aria-label="Default select example"
              v-model="addTripRatesClientNameInput"
            >
              <option v-for="client in clients" :value="client.company_name">
                {{ client.company_name }}
              </option>
            </select>
          </div>
          <div class="mb-3">
            <label
              for="addTripRatesBranch"
              class="form-label d-block text-start"
              >Branch</label
            >
            <input
              v-model="addTripRatesBranchInput"
              required
              type="text"
              class="form-control"
              id="addTripRatesBranch"
              aria-describedby="addTripRatesBranch"
            />
          </div>
          <div class="mb-3">
            <label
              for="addTripRatesProvince"
              class="form-label d-block text-start"
              >Province</label
            >
            <input
              v-model="addTripRatesProvinceInput"
              required
              type="text"
              class="form-control"
              id="addTripRatesProvince"
              aria-describedby="addTripRatesProvince"
            />
          </div>
          <div class="mb-3">
            <label for="addTripRatesCity" class="form-label d-block text-start"
              >City</label
            >
            <input
              v-model="addTripRatesCityInput"
              required
              type="text"
              class="form-control"
              id="addTripRatesCity"
              aria-describedby="addTripRatesCity"
            />
          </div>
          <div class="mb-3">
            <label for="addTripRatesAuv" class="form-label d-block text-start"
              >AUV</label
            >
            <input
              v-model="addTripRatesAUVInput"
              type="number"
              class="form-control"
              id="addTripRatesAuv"
              aria-describedby="addTripRatesAuv"
            />
          </div>
          <div class="mb-3">
            <label for="addTripRates4w" class="form-label d-block text-start"
              >4W</label
            >
            <input
              v-model="addTripRates4WInput"
              type="number"
              class="form-control"
              id="addTripRates4w"
              aria-describedby="addTripRates4w"
            />
          </div>
          <div class="mb-3">
            <label for="addTripRates6wElf" class="form-label d-block text-start"
              >6W ELF</label
            >
            <input
              v-model="addTripRates6WElfInput"
              type="number"
              class="form-control"
              id="addTripRates6wElf"
              aria-describedby="addTripRates6wElf"
            />
          </div>
          <div class="mb-3">
            <label for="addTripRates6wF" class="form-label d-block text-start"
              >6WF</label
            >
            <input
              v-model="addTripRates6WFInput"
              type="number"
              class="form-control"
              id="addTripRates6wF"
              aria-describedby="addTripRates6wF"
            />
          </div>
          <div class="mb-3">
            <label for="addTripRates10w" class="form-label d-block text-start"
              >10W</label
            >
            <input
              v-model="addTripRates10WInput"
              type="number"
              class="form-control"
              id="addTripRates10w"
              aria-describedby="addTripRates10w"
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
          form="addTripRatesForm"
          class="btn btn-primary tms-btn"
          data-bs-dismiss="modal"
        >
          Add Trip Rates
        </button>
      </div>
    </template>
  </Modal>

  <Modal id="deleteTripRatesModal">
    <template v-slot:modal-header>
      <div class="modal-header justify-content-center border-bottom-0">
        <h1 class="modal-title fs-5" id="addTripRatesLabel">
          Delete Rates for {{ this.currentClient.company_name }}
        </h1>
      </div>
    </template>
    <template v-slot:modal-body>
      <div class="modal-body">
        <form
          id="deleteTripRatesForm"
          @submit.prevent="onSubmitDeleteTripRates"
        >
          <div class="mb-3">
            <label
              for="deleteTripRatesBranch"
              class="form-label d-block text-start"
              >Branch</label
            >
            <input
              v-model="deleteTripRatesBranchInput"
              required
              type="text"
              class="form-control"
              id="deleteTripRatesBranch"
              aria-describedby="deleteTripRatesBranch"
            />
          </div>
          <div class="mb-3">
            <label
              for="deleteTripRatesProvince"
              class="form-label d-block text-start"
              >Province</label
            >
            <input
              v-model="deleteTripRatesProvinceInput"
              required
              type="text"
              class="form-control"
              id="deleteTripRatesProvince"
              aria-describedby="deleteTripRatesProvince"
            />
          </div>
          <div class="mb-3">
            <label
              for="deleteTripRatesCity"
              class="form-label d-block text-start"
              >City</label
            >
            <input
              v-model="deleteTripRatesCityInput"
              required
              type="text"
              class="form-control"
              id="deleteTripRatesCity"
              aria-describedby="deleteTripRatesCity"
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
          form="deleteTripRatesForm"
          class="btn btn-primary tms-btn"
          data-bs-dismiss="modal"
        >
          Delete Trip Rates
        </button>
      </div>
    </template>
  </Modal>

  <FloatingActionButtonVue isForTripRates="true" />
</template>
