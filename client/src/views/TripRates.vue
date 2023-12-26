<script>
import * as XLSX from 'xlsx';

import CompanyTab from '../components/CompanyTab.vue';
import TabPane from '../components/TabPane.vue';
import Footer from '../components/Footer.vue';
import Modal from '../components/Modal.vue';

import { getClientsModel } from '../models/client.model';
import { httpCreateTripRates } from '../requests/requests';

export default {
  name: 'Trip Rates',
  data() {
    return {
      currentTripRates: {},
      currentClient: getClientsModel().length > 0 ? getClientsModel()[0] : {},
      isFileSubmitValidFormat: undefined,

      // Upload Input
      fileInput: '',

      // Search Inputs
      searchInputProvince: '',
      searchInputCity: '',

      // Constants
      EDIT_MODAL: 3,
      DELETE_MODAL: 4
    };
  },
  components: {
    CompanyTab,
    TabPane,
    Footer,
    Modal
  },
  methods: {
    addNewTripRatesToStore(newTripRate) {
      this.$store.dispatch('tripRates/addTripRate', newTripRate);
    },
    handleFileChange(event) {
      this.fileInput = event.target.files[0];
    },

    // A method that formats the result from sheet_to_json method
    formatJson(json, branch) {
      const result = json.map((row) => {
        return {
          branch,
          clientId: this.currentClient.id,
          province: row['PROVINCE'],
          city: row['CITY / MUNICIPALITY'],
          auv: row['AUV'] ? Math.ceil(row['AUV'] * 100) / 100 : null,
          four_wheeler: row['4W'] ? Math.ceil(row['4W'] * 100) / 100 : null,
          six_wheeler_forward: row['6WF']
            ? Math.ceil(row['6WF'] * 100) / 100
            : null,
          six_wheeler_elf: row['6W ELF']
            ? Math.ceil(row['6W ELF'] * 100) / 100
            : null,
          ten_wheeler: row['10W'] ? Math.ceil(row['10W'] * 100) / 100 : null
        };
      });

      return result;
    },

    onFileSubmitHandler() {
      const reader = new FileReader();
      reader.readAsBinaryString(this.fileInput);

      reader.addEventListener('load', (event) => {
        // Get the data of excel but in binary format
        const data = event.target.result;

        // Parse the data (binary format) into javascript object
        const workbook = XLSX.read(data, { type: 'binary' });

        // Iterate to every sheetnames avaiable in the excel
        const { SheetNames } = workbook;

        SheetNames.forEach(async (SheetName) => {
          const worksheet = workbook.Sheets[SheetName];

          // This range is valid if the user follow the given format
          // The range for the values of rates
          const range = 'A11:Z500';

          const json = XLSX.utils.sheet_to_json(worksheet, {
            range
          });

          const tripRates = this.formatJson(json, SheetName);

          const firstRow = tripRates[0];
          try {
            if (
              firstRow === undefined ||
              firstRow.province === undefined ||
              firstRow.city === undefined
            ) {
              throw new Error('Invalid Format');
            }
            this.isFileSubmitValidFormat = true;

            for (const tripRate of tripRates) {
              const newTripRate = await httpCreateTripRates(tripRate);
              this.$store.dispatch('tripRates/addTripRate', newTripRate);
            }
          } catch (err) {
            this.isFileSubmitValidFormat = false;
          }
        });
      });
    },

    clearDataForUpload() {
      this.isFileSubmitValidFormat = undefined;
    },

    // Used to re-assign the value of currentTripRates to be show
    tabChangeHandler(id) {
      this.currentClient = this.clients.find((client) => client.id === id);
      this.updateCurrentTripRates();
      this.searchInputProvince = '';
      this.searchInputCity = '';
    },

    isTripRateExists(newTripRate) {
      const { branch } = newTripRate;
      const rate = this.currentTripRates[branch].find((tripRate) => {
        return (
          tripRate.branch === newTripRate.branch &&
          tripRate.province === newTripRate.province &&
          tripRate.city === newTripRate.city
        );
      });

      return Boolean(rate);
    },

    filterTripRatesByClientName(clientName) {
      return this.tripRates.filter((tripRate) => {
        return tripRate.client_name === clientName;
      });
    },

    filterCurrentTripRatesByBranch(branch) {
      return this.currentTripRates[branch];
    },

    filterTripRatesByProvince(tripRates, province) {
      return tripRates.filter((tripRate) => tripRate.province === province);
    },

    getProvinces(tripRates) {
      return tripRates.map((tripRate) => tripRate.province);
    },

    getCities(tripRates) {
      return tripRates.map((tripRate) => tripRate.city);
    },

    getUniqueValuesFromArray(arr) {
      return Array.from(new Set(arr));
    },

    updateCurrentTripRates() {
      this.resetCurrentTripRates();

      const { company_name } = this.currentClient;

      const filteredTripRatesByClientName =
        this.filterTripRatesByClientName(company_name);
      filteredTripRatesByClientName.reverse();

      filteredTripRatesByClientName.forEach((tripRate) => {
        const { branch, province, city } = tripRate;
        if (
          province.includes(this.searchInputProvince) &&
          city.includes(this.searchInputCity)
        ) {
          if (this.currentTripRates[branch] !== undefined) {
            return this.currentTripRates[branch].push(tripRate);
          }
          this.currentTripRates[branch] = [tripRate];
        }
      });
    },

    resetCurrentTripRates() {
      this.currentTripRates = {};
    },

    addNewTripRateToCurrentTripRates(tripRate) {
      const { branch } = tripRate;
      this.currentTripRates[branch].push(tripRate);
    },

    filteredProvinceByBranch(modal) {
      let currentBranch;

      if (modal === this.EDIT_MODAL) {
        currentBranch = this.editTripRatesBranchInput;
      } else if (modal === this.DELETE_MODAL) {
        currentBranch = this.deleteTripRatesBranchInput;
      }

      if (!currentBranch) {
        return [];
      }

      const filteredTripRates =
        this.filterCurrentTripRatesByBranch(currentBranch);
      const provinces = this.getProvinces(filteredTripRates);

      return this.getUniqueValuesFromArray(provinces);
    },

    filteredCityByProvince(modal) {
      let currentBranch;
      let currentProvince;

      switch (modal) {
        case this.EDIT_MODAL:
          currentBranch = this.editTripRatesBranchInput;
          currentProvince = this.editTripRatesProvinceInput;
          break;
        case this.DELETE_MODAL:
          currentBranch = this.deleteTripRatesBranchInput;
          currentProvince = this.deleteTripRatesProvinceInput;
      }

      if (!currentProvince) {
        return [];
      }

      const filteredTripRatesByBranch =
        this.filterCurrentTripRatesByBranch(currentBranch);
      const filteredTripRatesByProvince = this.filterTripRatesByProvince(
        filteredTripRatesByBranch,
        currentProvince
      );
      const cities = this.getCities(filteredTripRatesByProvince);

      return this.getUniqueValuesFromArray(cities);
    }
  },
  mounted() {
    if (this.clients.length > 0) {
      this.currentClient = this.clients[0];
    }
    this.updateCurrentTripRates();
  },
  computed: {
    isCurrentTripRatesEmpty() {
      const branches = Object.keys(this.currentTripRates);
      return branches.length === 0 ? true : false;
    },
    clients() {
      return this.$store.getters['clients/clients'];
    },
    tripRates() {
      return this.$store.getters['tripRates/tripRates'];
    },
    provinces() {
      return this.$store.getters['tripRates/provinces'];
    },

    provincesByCurrentClient() {
      const currentTripRatesBasedOnCurrentCompanyName = this.$store.getters[
        'tripRates/getTripRatesByCompanyName'
      ](this.currentClient.company_name);

      return new Set(
        currentTripRatesBasedOnCurrentCompanyName.map(
          (tripRate) => tripRate.province
        )
      );
    },
    cities() {
      return this.$store.getters['tripRates/cities'];
    },
    filteredCities() {
      const cities = [];

      const filteredTripRates = this.tripRates.filter(
        (tripRate) => tripRate.province === this.searchInputProvince
      );
      filteredTripRates.forEach((tripRate) => {
        if (!cities.includes(tripRate.city)) {
          cities.push(tripRate.city);
        }
      });

      return cities;
    },
    filteredTripRates() {
      this.updateCurrentTripRates();
      return this.currentTripRates;
    }
  },
  watch: {
    searchInputProvince() {
      this.searchInputCity = '';
    }
  }
};
</script>

<template>
  <h1>Clients - Trip Rates</h1>
  <ul class="nav nav-pills gap-2" id="pills-tab" role="tablist">
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
  <hr />
  <div class="d-flex align-items-center justify-content-between">
    <div class="d-flex gap-2">
      <div>
        <label class="d-block text-start fw-bold" for="province"
          >Province:</label
        >
        <select
          v-model="searchInputProvince"
          id="province"
          class="form-select"
          aria-label="Default select example"
        >
          <option value="" selected>All</option>
          <option
            v-for="province in provincesByCurrentClient"
            :value="province"
          >
            {{ province }}
          </option>
        </select>
      </div>
      <div>
        <label class="d-block text-start fw-bold" for="cities">City:</label>
        <select
          v-model="searchInputCity"
          id="city"
          class="form-select"
          aria-label="Default select example"
        >
          <option value="" selected>All</option>
          <option v-for="city in filteredCities" :value="city">
            {{ city }}
          </option>
        </select>
      </div>
    </div>
    <button
      type="button"
      class="btn tms-btn text-light align-self-end"
      data-bs-toggle="modal"
      data-bs-target="#uploadFileModal"
    >
      Upload Rates
    </button>
  </div>

  <div class="tab-content" id="pills-tabContent">
    <TabPane
      v-for="client in clients"
      :classes="client === clients[0] ? 'active show' : ''"
      :id="'pills-' + client.id"
      :key="client.id"
    >
      <p v-if="Object.keys(filteredTripRates).length === 0">
        There are no stored trip rates for this client.
      </p>
      <main
        class="mb-5"
        v-else
        v-for="branch in Object.keys(filteredTripRates)"
        :key="branch"
      >
        <span class="text-start fw-bold fs-2">{{ branch }}</span>
        <table class="table">
          <thead class="tbl-header text-light rounded">
            <tr>
              <th scope="col">Province</th>
              <th scope="col">City</th>
              <th scope="col">AUV</th>
              <th scope="col">4W</th>
              <th scope="col">6W ELF</th>
              <th scope="col">6WF</th>
              <th scope="col">10W</th>
            </tr>
          </thead>
          <tbody class="table-group-divider">
            <tr
              v-for="tripRate in filteredTripRates[branch]"
              :key="tripRate.id"
            >
              <td scope="row">{{ tripRate.province }}</td>
              <td>{{ tripRate.city }}</td>
              <td>{{ tripRate.auv }}</td>
              <td>{{ tripRate.four_wheeler }}</td>
              <td>{{ tripRate.six_wheeler_elf }}</td>
              <td>{{ tripRate.six_wheeler_forward }}</td>
              <td>{{ tripRate.ten_wheeler }}</td>
            </tr>
          </tbody>
        </table>
      </main>
    </TabPane>
  </div>

  <h3 class="text-danger" v-if="!clients.length">Please add a client...</h3>

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
              @change="handleFileChange"
              type="file"
              class="form-control"
              id="file"
              required
              :disabled="!isCurrentTripRatesEmpty"
            />
          </div>
        </form>
        <p
          v-if="!isCurrentTripRatesEmpty && !isFileSubmitValidFormat"
          class="text-danger fw-bold"
        >
          Trip Rates are not empty
        </p>
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
          @click="clearDataForUpload()"
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
            @click="clearDataForUpload()"
          >
            Cancel
          </button>
          <button
            v-if="isCurrentTripRatesEmpty"
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
</template>
