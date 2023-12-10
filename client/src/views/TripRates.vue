<script>
import * as XLSX from 'xlsx';

import CompanyTab from '../components/CompanyTab.vue';
import TabPane from '../components/TabPane.vue';
import Footer from '../components/Footer.vue';
import FloatingActionButtonVue from '../components/FloatingActionButton.vue';
import Modal from '../components/Modal.vue';

import { getClientsModel } from '../models/client.model';
import { getTripRatesModel } from '../models/triprates.model';
import {
  httpCreateTripRates,
  httpDeleteTripRates,
  httpUpdateTripRates
} from '../requests/requests';

export default {
  name: 'Trip Rates',
  data() {
    return {
      currentTripRates: {},
      currentClient: getClientsModel().length > 0 ? getClientsModel()[0] : {},
      isFileSubmitValidFormat: undefined,

      // Upload Input
      uploadFileInput: '',

      // Search Inputs
      searchInputProvince: '',
      searchInputCity: '',

      // Add Inputs
      isNewTripRateValid: undefined,
      addTripRatesBranchInput: '',
      addTripRatesProvinceInput: '',
      addTripRatesCityInput: '',
      addTripRatesAUVInput: null,
      addTripRates4WInput: null,
      addTripRates6WElfInput: null,
      addTripRates6WFInput: null,
      addTripRates10WInput: null,
      newTripRate: {},

      // Delete Inputs
      deleteTripRatesBranchInput: '',
      deleteTripRatesProvinceInput: '',
      deleteTripRatesCityInput: '',

      // Edit inputs
      isForEditing: false,
      editTripRatesBranchInput: '',
      editTripRatesProvinceInput: '',
      editTripRatesCityInput: '',
      editTripRatesAUVInput: null,
      editTripRates4WInput: null,
      editTripRates6WElfInput: null,
      editTripRates6WFInput: null,
      editTripRates10WInput: null,

      // Constants
      EDIT_MODAL: 3,
      DELETE_MODAL: 4
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
    addNewTripRatesToStore(newTripRate) {
      this.$store.dispatch('tripRates/addTripRate', newTripRate);
    },

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

          // This range is valid if the user follow the given format
          const range = 'A11:Z500';

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

            result.forEach(async (rawTripRate) => {
              const { client, branch, province, city, AUV } = rawTripRate;

              const tripRate = {
                client_name: client,
                branch,
                province,
                city,
                auv: AUV,
                four_wheeler: rawTripRate['4W'],
                six_wheeler_elf: rawTripRate['6W ELF'],
                six_wheeler_forward: rawTripRate['6WF'],
                ten_wheeler: rawTripRate['10W']
              };

              const newTripRate = await httpCreateTripRates(tripRate);
              this.addNewTripRatesToStore(newTripRate);
            });
          this.uploadFileInput = '';
          } catch (err) {
            this.isFileSubmitValidFormat = false;
          }
        });
      });
    },

    clearDataForUpload() {

      this.isFileSubmitValidFormat = undefined;
    },

    clearDataForAdd() {
      this.isNewTripRateValid = undefined;
      this.addTripRatesBranchInput = '';
      this.addTripRatesProvinceInput = '';
      this.addTripRatesCityInput = '';
      this.addTripRatesAUVInput = null;
      this.addTripRates4WInput = null;
      this.addTripRates6WElfInput = null;
      this.addTripRates6WFInput = null;
      this.addTripRates10WInput = null;
    },

    clearDataForEdit() {
      this.editTripRatesBranchInput = '';
      this.editTripRatesProvinceInput = '';
      this.editTripRatesCityInput = '';
      this.editTripRatesAUVInput = null;
      this.editTripRates4WInput = null;
      this.editTripRates6WElfInput = null;
      this.editTripRates6WFInput = null;
      this.editTripRates10WInput = null;
      this.isForEditing = false;
    },

    clearDataForDelete() {
      this.deleteTripRatesBranchInput = '';
      this.deleteTripRatesProvinceInput = '';
      this.deleteTripRatesCityInput = '';
    },

    // Used to re-assign the value of currentTripRates to be show
    tabChangeHandler(id) {
      this.currentClient = this.clients.find((client) => client.id === id);
      console.log(this.currentClient);
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

    // ADD TRIP RATES
    onSubmitAddTripRates() {
      const newTripRate = {
        client_name: this.currentClient.company_name,
        branch: this.addTripRatesBranchInput,
        province: this.addTripRatesProvinceInput,
        city: this.addTripRatesCityInput,
        auv: this.addTripRatesAUVInput,
        four_wheeler: this.addTripRates4WInput,
        six_wheeler_elf: this.addTripRates6WElfInput,
        six_wheeler_forward: this.addTripRates6WFInput,
        ten_wheeler: this.addTripRates10WInput
      };

      this.newTripRate = newTripRate;

      if (this.isTripRateExists(this.newTripRate)) {
        this.isNewTripRateValid = false;
        return;
      }

      httpCreateTripRates(newTripRate)
        .then((addedTripRate) => {
          this.addNewTripRatesToStore(addedTripRate);
          this.isNewTripRateValid = true;
        })
        .catch((error) => {
          console.log(error);
        });
    },

    onSubmitDeleteTripRates() {
      const selectedBranch = this.deleteTripRatesBranchInput;
      const tripRateToBeDeleted = this.currentTripRates[selectedBranch].find(
        (tripRates) => {
          return (
            tripRates.branch.toLowerCase() ===
              this.deleteTripRatesBranchInput.toLowerCase() &&
            tripRates.province.toLowerCase() ===
              this.deleteTripRatesProvinceInput.toLowerCase() &&
            tripRates.city.toLowerCase() ===
              this.deleteTripRatesCityInput.toLowerCase()
          );
        }
      );

      httpDeleteTripRates(tripRateToBeDeleted)
        .then(({ branch, province, city }) => {
          this.$store.dispatch('tripRates/deleteTripRate', {
            branch,
            province,
            city
          });
          this.clearDataForDelete();
        })
        .catch(() => {
          console.log('Invalid inputs, trip rates not found based on input');
        });

      this.deleteTripRatesBranchInput = '';
      this.deleteTripRatesProvinceInput = '';
      this.deleteTripRatesCityInput = '';
    },
    filterTripRatesByClientName(clientName) {
      console.log(this.tripRates);

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
    },

    onSubmitEditTripRates() {
      const branch = this.editTripRatesBranchInput;
      const province = this.editTripRatesProvinceInput;
      const city = this.editTripRatesCityInput;
      const tripRateToBeEdited = this.tripRates.find(
        (tripRate) =>
          tripRate.branch === branch &&
          tripRate.province === province &&
          tripRate.city === city
      );

      if (this.isForEditing) {
        Object.assign(tripRateToBeEdited, {
          auv: this.editTripRatesAUVInput,
          four_wheeler: this.editTripRates4WInput,
          six_wheeler_elf: this.editTripRates6WElfInput,
          six_wheeler_forward: this.editTripRates6WFInput,
          ten_wheeler: this.editTripRates10WInput,
        });

        httpUpdateTripRates(tripRateToBeEdited);
        this.clearDataForEdit();
      }

      if (this.isInputsForEditTripRateValid) {
        this.isForEditing = true;
      }
    }
  },
  mounted() {
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
      const provinces = [];

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
    },
    isInputsForAddTripRateValid() {
      return (
        this.addTripRatesBranchInput &&
        this.addTripRatesProvinceInput &&
        this.addTripRatesCityInput
      );
    },
    isInputsForEditTripRateValid() {
      return (
        this.editTripRatesBranchInput &&
        this.editTripRatesProvinceInput &&
        this.editTripRatesCityInput
      );
    },
    isInputsForDeleteTripRateValid() {
      return (
        this.deleteTripRatesBranchInput &&
        this.deleteTripRatesProvinceInput &&
        this.deleteTripRatesCityInput
      );
    }
  },
  watch: {
    searchInputProvince(newProvince) {
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
  <div class="d-flex mb-3 align-items-center gap-2">
    <div class="align-self-start">
      <label class="d-block text-start fw-bold" for="province">Province:</label>
      <select
        v-model="searchInputProvince"
        id="province"
        class="form-select"
        aria-label="Default select example"
      >
        <option value="" selected>All</option>
        <option v-for="province in provincesByCurrentClient" :value="province">
          {{ province }}
        </option>
      </select>
    </div>

    <div class="align-self-start">
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
              v-on:change="uploadFileInput"
              type="file"
              class="form-control"
              id="file"
              ref="fileInput"
              required
              :disabled="!isCurrentTripRatesEmpty"
            />
          </div>
        </form>
        <p v-if="!isCurrentTripRatesEmpty && !isFileSubmitValidFormat" class="text-danger fw-bold">Trip Rates are not empty</p>
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

  <Modal id="addTripRatesModal">
    <template v-slot:modal-header>
      <div class="modal-header justify-content-center border-bottom-0">
        <h1 class="modal-title fs-5" id="addTripRatesLabel">
          Add Trip Rates for {{ this.currentClient.company_name }}
        </h1>
      </div>
    </template>
    <template v-slot:modal-body>
      <div class="modal-body">
        <form id="addTripRatesForm" @submit.prevent="onSubmitAddTripRates">
          <div class="mb-3">
            <label
              for="addTripRatesBranch"
              class="form-label d-block text-start"
              >Branch</label
            >
            <select
              id="addTripRatesBranch"
              required
              v-model="addTripRatesBranchInput"
              class="form-select"
            >
              <option value="">Open this to select branch</option>
              <option
                v-for="branch in Object.keys(currentTripRates)"
                :value="branch"
              >
                {{ branch }}
              </option>
            </select>
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
              placeholder="Province"
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
              placeholder="City"
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
              step=".01"
              placeholder="AUV"
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
              step=".01"
              placeholder="4W"
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
              step=".01"
              placeholder="6W ELF"
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
              step=".01"
              placeholder="6WF"
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
              step=".01"
              placeholder="10W"
            />
          </div>
        </form>
      </div>
    </template>
    <template v-slot:modal-footer>
      <p v-show="isNewTripRateValid === true" class="text-success">
        Valid Format
      </p>
      <p v-show="isNewTripRateValid === false" class="text-danger">
        Invalid Format
      </p>
      <div class="modal-footer justify-content-center border-top-0">
        <button
          v-if="isNewTripRateValid"
          type="button"
          class="btn btn-success"
          data-bs-dismiss="modal"
          @click="clearDataForAdd"
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
            @click="clearDataForAdd"
          >
            Cancel
          </button>
          <button
            type="submit"
            class="btn btn-primary tms-btn"
            form="addTripRatesForm"
          >
            Add Trip Rates
          </button>
        </div>
      </div>
    </template>
  </Modal>

  <Modal id="deleteTripRatesModal">
    <template v-slot:modal-header>
      <div class="modal-header justify-content-center border-bottom-0">
        <h1 class="modal-title fs-5" id="deleteTripRatesLabel">
          Delete Rate for {{ this.currentClient.company_name }}
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
            <select
              id="deleteTripRatesBranch"
              required
              v-model="deleteTripRatesBranchInput"
              class="form-select"
            >
              <option value="">Open this to select branch</option>
              <option
                v-for="branch in Object.keys(filteredTripRates)"
                :value="branch"
              >
                {{ branch }}
              </option>
            </select>
          </div>
          <div class="mb-3">
            <label
              for="deleteTripRatesProvince"
              class="form-label d-block text-start"
              >Province</label
            >
            <select
              :disabled="!deleteTripRatesBranchInput"
              id="deleteTripRatesProvince"
              required
              v-model="deleteTripRatesProvinceInput"
              class="form-select"
            >
              <option value="">Open this to select province</option>
              <option
                v-for="province in filteredProvinceByBranch(DELETE_MODAL)"
                :value="province"
              >
                {{ province }}
              </option>
            </select>
          </div>
          <div class="mb-3">
            <label
              for="deleteTripRatesCity"
              class="form-label d-block text-start"
              >City</label
            >
            <select
              :disabled="!deleteTripRatesProvinceInput"
              id="deleteTripRatesCity"
              required
              v-model="deleteTripRatesCityInput"
              class="form-select"
            >
              <option value="">Open this to select city</option>
              <option
                v-for="city in filteredCityByProvince(DELETE_MODAL)"
                :value="city"
                :key="city"
              >
                {{ city }}
              </option>
            </select>
          </div>
        </form>
      </div>
    </template>
    <template v-slot:modal-footer>
      <div class="modal-footer justify-content-center border-top-0">
        <button
          type="button"
          class="btn btn-secondary"
          data-bs-dismiss="modal"
          @click="clearDataForDelete"
        >
          Cancel
        </button>
        <button
          type="submit"
          form="deleteTripRatesForm"
          class="btn btn-primary tms-btn"
          :data-bs-dismiss="isInputsForDeleteTripRateValid ? 'modal' : ''"
        >
          Delete Trip Rates
        </button>
      </div>
    </template>
  </Modal>

  <Modal id="editTripRatesModal">
    <template v-slot:modal-header>
      <div class="modal-header justify-content-center border-bottom-0">
        <h1 class="modal-title fs-5" id="editTripRatesLabel">
          Edit Rate for {{ this.currentClient.company_name }}
        </h1>
      </div>
    </template>
    <template v-slot:modal-body>
      <div v-if="isForEditing" class="modal-body">
        <form id="editTripRatesForm" @submit.prevent="onSubmitEditTripRates">
          <div class="mb-3">
            <label for="editTripRatesAuv" class="form-label d-block text-start"
              >AUV</label
            >
            <input
              v-model="editTripRatesAUVInput"
              type="number"
              class="form-control"
              id="editTripRatesAuv"
              aria-describedby="editTripRatesAuv"
              step=".01"
              placeholder="AUV"
            />
          </div>
          <div class="mb-3">
            <label for="editTripRates4w" class="form-label d-block text-start"
              >4W</label
            >
            <input
              v-model="editTripRates4WInput"
              type="number"
              class="form-control"
              id="editTripRates4w"
              aria-describedby="editTripRates4w"
              step=".01"
              placeholder="4W"
            />
          </div>
          <div class="mb-3">
            <label
              for="editTripRates6wElf"
              class="form-label d-block text-start"
              >6W Elf</label
            >
            <input
              v-model="editTripRates6WElfInput"
              type="number"
              class="form-control"
              id="editTripRates6wElf"
              aria-describedby="editTripRates6wElf"
              step=".01"
              placeholder="6W ELF"
            />
          </div>
          <div class="mb-3">
            <label for="editTripRates6wF" class="form-label d-block text-start"
              >6WF</label
            >
            <input
              v-model="editTripRates6WFInput"
              type="number"
              class="form-control"
              id="editTripRates6wF"
              aria-describedby="editTripRates6wF"
              step=".01"
              placeholder="6WF"
            />
          </div>
          <div class="mb-3">
            <label for="editTripRates10w" class="form-label d-block text-start"
              >10W</label
            >
            <input
              v-model="editTripRates10WInput"
              type="number"
              class="form-control"
              id="editTripRates10w"
              aria-describedby="editTripRates10w"
              step=".01"
              placeholder="10W"
            />
          </div>
        </form>
      </div>

      <div v-else class="modal-body">
        <form id="editTripRatesForm" @submit.prevent="onSubmitEditTripRates">
          <div class="mb-3">
            <label
              for="editTripRatesBranch"
              class="form-label d-block text-start"
              >Branch</label
            >
            <select
              id="editTripRatesBranch"
              required
              v-model="editTripRatesBranchInput"
              class="form-select"
            >
              <option value="">Open this to select branch</option>
              <option
                v-for="branch in Object.keys(filteredTripRates)"
                :value="branch"
              >
                {{ branch }}
              </option>
            </select>
          </div>
          <div class="mb-3">
            <label
              for="editTripRatesProvince"
              class="form-label d-block text-start"
              >Province</label
            >
            <select
              :disabled="!editTripRatesBranchInput"
              id="editTripRatesProvince"
              required
              v-model="editTripRatesProvinceInput"
              class="form-select"
            >
              <option value="">Open this to select province</option>
              <option
                v-for="province in filteredProvinceByBranch(EDIT_MODAL)"
                :value="province"
              >
                {{ province }}
              </option>
            </select>
          </div>
          <div class="mb-3">
            <label for="editTripRatesCity" class="form-label d-block text-start"
              >City</label
            >
            <select
              :disabled="!editTripRatesProvinceInput"
              id="editTripRatesCity"
              required
              v-model="editTripRatesCityInput"
              class="form-select"
            >
              <option value="">Open this to select city</option>
              <option
                v-for="city in filteredCityByProvince(EDIT_MODAL)"
                :value="city"
              >
                {{ city }}
              </option>
            </select>
          </div>
        </form>
      </div>
    </template>
    <template v-slot:modal-footer>
      <div class="modal-footer justify-content-center border-top-0">
        <button
          type="button"
          class="btn btn-secondary"
          data-bs-dismiss="modal"
          @click="clearDataForEdit"
        >
          Cancel
        </button>
        <button
          type="submit"
          :form="'editTripRatesForm'"
          class="btn btn-primary tms-btn"
          :data-bs-dismiss="isForEditing ? 'modal' : ''"
        >
          Edit Trip Rate
        </button>
      </div>
    </template>
  </Modal>

  <FloatingActionButtonVue
    :isForTripRates="true"
    :hide="clients.length > 0 ? false : true"
  />
</template>
