<script>
import * as XLSX from 'xlsx';

import CompanyTab from '../components/CompanyTab.vue';
import TabPane from '../components/TabPane.vue';
import Footer from '../components/Footer.vue';
import Modal from '../components/Modal.vue';

import { getClientsModel } from '../models/client.model';
import { httpCreateTripRates, httpDeleteTripRates } from '../requests/requests';

export default {
  name: 'Trip Rates',
  data() {
    return {
      currentClient: getClientsModel().length > 0 ? getClientsModel()[0] : {},
      isFileSubmitValidFormat: undefined,

      // Upload Input
      fileInput: '',

      // Search Inputs
      searchInputBranch: '',
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
    // Method used to add a tripRate to store
    addTripRateToStore(newTripRate) {
      this.$store.dispatch('tripRates/addTripRate', newTripRate);
    },
    deleteTripRateToStore(tripRateId) {
      this.$store.dispatch('tripRates/deleteTripRate', tripRateId);
    },

    // Change event handler when the file is change
    handleFileChange(event) {
      this.fileInput = event.target.files[0];
    },

    // A method that formats the result from sheet_to_json method
    formatJson(json, branch) {
      const result = json.map((row) => {
        return {
          clientId: this.currentClient.id,
          date_created: new Date(),
          branch,
          province: row['PROVINCE'],
          city: row['CITY / MUNICIPALITY'],
          auv: row['AUV'] ? row['AUV'] : null,
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

    // File submit event handler
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

            // IF THE CURRENT TRIP RATES IS NOT EMPTY, (RE-UPLOAD)
            if (this.currentTripRates.length) {
              for (const tripRate of this.currentTripRates) {
                const deletedTripRate = await httpDeleteTripRates(tripRate.id);
                this.deleteTripRateToStore(deletedTripRate.id);
              }
            }

            for (const tripRate of tripRates) {
              const newTripRate = await httpCreateTripRates(tripRate);
              this.addTripRateToStore(newTripRate);
              console.log(tripRate);
            }
          } catch (err) {
            this.isFileSubmitValidFormat = false;
          }
        });
      });
    },

    // Resetting the state of the file input
    clearDataForUpload() {
      this.$refs.fileInput.selectedFile = null;
      this.$refs.fileInput.value = null;
      this.isFileSubmitValidFormat = undefined;
    },

    // Used to re-assign the value of currentTripRates to be show
    tabChangeHandler(id) {
      this.currentClient = this.clients.find((client) => client.id === id);
      this.searchInputProvince = '';
      this.searchInputCity = '';
    }
  },
  computed: {
    // GET ALL THE TRIP RATES AVAILABLE FROM THE STORE
    tripRates() {
      return this.$store.getters['tripRates/tripRates'];
    },

    // GET THE TRIP RATES BY THE CURRENT CLIENT
    currentTripRates() {
      return this.tripRates.filter(
        (tripRate) => tripRate.clientId === this.currentClient.id
      );
    },

    // GET THE BRANCHES FROM THE CURRENT TRIP RATES
    currentBranches() {
      return Array.from(
        new Set(this.currentTripRates.map((tripRate) => tripRate.branch))
      );
    },

    // GET THE PROVINCES FROM THE CURRENT TRIP RATES
    currentProvinces() {
      return Array.from(
        new Set(this.currentTripRates.map((tripRate) => tripRate.province))
      );
    },

    // GET THE CITIES FROM THE CURRENT TRIP RATES
    currentCities() {
      return Array.from(
        new Set(this.currentTripRates.map((tripRate) => tripRate.cty))
      );
    },

    // FILTERED CITIES BASED ON THE VALUE OF SEARCHINPUTPROVINCE
    filteredCities() {
      const tripRates = this.currentTripRates.filter((tripRate) =>
        tripRate.province.includes(this.searchInputProvince)
      );

      return Array.from(new Set(tripRates.map((tripRate) => tripRate.city)));
    },

    filteredTripRates() {
      const rates = {};

      const tripRates = this.currentTripRates.filter(
        (tripRate) =>
          tripRate.province.includes(this.searchInputProvince) &&
          tripRate.city.includes(this.searchInputCity)
      );

      for (const branch of this.currentBranches) {
        rates[branch] = tripRates.filter(
          (tripRate) => tripRate.branch === branch
        );
      }
      return rates;
    },

    dateUploaded() {
      if (this.currentTripRates.length) {
        const tripRate = this.currentTripRates[0];
        const date = new Date(tripRate.date_created);
        const options = { day: 'numeric', month: 'short', year: '2-digit' };

        return new Date(tripRate.date_created)
          .toLocaleDateString('en-GB', options)
          .replace(/\s/g, '-');
      }
    },

    isCurrentTripRatesEmpty() {
      const branches = Object.keys(this.currentTripRates);
      return branches.length === 0 ? true : false;
    },

    clients() {
      return this.$store.getters['clients/clients'];
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
  <div class="d-flex align-items-center justify-content-between mb-4">
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
          <option v-for="province in currentProvinces" :value="province">
            {{ province }}
          </option>
        </select>
      </div>
      <div>
        <label class="d-block text-start fw-bold" for="city">City:</label>
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
      @click="clearDataForUpload"
    >
      {{ currentTripRates.length ? 'Re-upload' : 'Upload' }} Rates
    </button>
  </div>

  <p v-if="currentTripRates.length" class="fw-bold text-start">
    Date uploaded: <span class="text-success">{{ dateUploaded }}</span>
  </p>

  <div class="tab-content" id="pills-tabContent">
    <TabPane
      v-for="client in clients"
      :classes="client === clients[0] ? 'active show' : ''"
      :id="'pills-' + client.id"
      :key="client.id"
    >
      <p
        v-if="isCurrentTripRatesEmpty"
        class="text-danger fw-bold text-decoration-underline"
      >
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
              <td>
                <span v-if="tripRate.auv">&#8369;</span>
                {{ tripRate.auv && tripRate.auv.toFixed(2) }}
              </td>
              <td>
                <span v-if="tripRate.four_wheeler">&#8369;</span>
                {{ tripRate.four_wheeler && tripRate.four_wheeler.toFixed(2) }}
              </td>
              <td>
                <span v-if="tripRate.six_wheeler_elf">&#8369;</span>

                {{
                  tripRate.six_wheeler_elf &&
                  tripRate.six_wheeler_elf.toFixed(2)
                }}
              </td>
              <td>
                <span v-if="tripRate.six_wheeler_forward">&#8369;</span>

                {{
                  tripRate.six_wheeler_forward &&
                  tripRate.six_wheeler_forward.toFixed(2)
                }}
              </td>
              <td>
                <span v-if="tripRate.ten_wheeler">&#8369;</span>

                {{ tripRate.ten_wheeler && tripRate.ten_wheeler.toFixed(2) }}
              </td>
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
              ref="fileInput"
              type="file"
              class="form-control"
              id="file"
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
            type="submit"
            class="btn btn-primary tms-btn"
            form="uploadFileForm"
          >
            {{ currentTripRates.length ? 'Re-upload' : 'Upload' }}
          </button>
        </div>
      </div>
    </template>
  </Modal>
</template>

<style scoped>
select {
  min-width: 200px;
}

th {
  width: 14.28%;
}
</style>
