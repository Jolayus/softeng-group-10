<script>
import CompanyTab from '../components/CompanyTab.vue';
import TabPane from '../components/TabPane.vue';
import Footer from '../components/Footer.vue';
import FloatingActionButtonVue from '../components/FloatingActionButton.vue';
import Modal from '../components/Modal.vue';

import { getClientsModel } from '../models/client.model';
import { getBillingsModel } from '../models/billings.model';

import {
  httpCreateBilling,
  httpPostBillingTrip,
  httpDeleteBilling,
  httpDeleteBillingTrips
} from '../requests/requests';

export default {
  name: 'Billing',
  components: {
    CompanyTab,
    TabPane,
    Footer,
    FloatingActionButtonVue,
    Modal
  },
  data() {
    return {
      currentClient: getClientsModel().length > 0 ? getClientsModel()[0] : {},

      currentBilling: getBillingsModel().length > 0 ? getClientsModel()[0] : {},

      // ADD BILLING INPUT
      addBillingTransactionNumber: '',

      // ADD TRIP INPUT
      addTripShipmentNumber: '',
      addTripSPONumber: '',
      addTripFee: null
    };
  },
  methods: {
    handleClick(client) {
      this.currentClient = client;
    },
    addNewBilling() {
      const clientId = this.currentClient.id;
      const date = new Date();
      const transactionNumber = this.addBillingTransactionNumber;

      httpCreateBilling({
        clientId,
        date: date.toISOString().slice(0, 19).replace('T', ' '),
        transactionNumber
      }).then((data) => {
        this.$store.dispatch('billings/addBilling', { ...data, trips: [] });
        console.log({ ...data, trips: [], totalFee: 0 });
      });
    },
    addNewTrip() {
      const newTrip = {
        billingId: this.currentBilling.id,
        date: new Date().toISOString().slice(0, 19).replace('T', ' '),
        shipmentNumber: this.addTripShipmentNumber,
        SPONumber: this.addTripSPONumber,
        fee: this.addTripFee
      };

      httpPostBillingTrip(newTrip).then((data) => {
        this.currentBilling.trips.push(data);
        this.currentBilling.totalFee += data.fee;

        this.$store.dispatch('billingTrips/addBillingTrip', data);
      });

      this.addTripShipmentNumber = '';
      this.addTripSPONumber = '';
      this.addTripFee = null;
    },
    setCurrentBilling(billing) {
      this.currentBilling = billing;
    },
    handleGenerateCopy() {
      console.log('Handle Generated Copy');

      fetch('http://localhost:8000/billings/getFile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...this.currentBilling,
          company_name: this.currentClient.company_name,
          company_address: this.currentClient.address
        })
      })
        .then((response) => {
          return response.blob();
        })
        .then((blob) => {
          const url = window.URL.createObjectURL(new Blob([blob]));
          const a = document.createElement('a');
          a.href = url;
          a.download = `${this.currentClient.company_name} - Billing.xlsx`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          window.URL.revokeObjectURL(url);
        });
    },
    isBillingExists(transactionNumber) {
      const idx = this.currentClientBillings.findIndex(
        (billing) => billing.transactionNumber === transactionNumber
      );
      if (idx >= 0) {
        return true;
      }
      return false;
    },
    deleteBilling(id) {
      httpDeleteBilling(id).then(() => {
        httpDeleteBillingTrips(id);
        this.$store.dispatch('billings/deleteBilling', id);
      });
    },
    getRemainingDays(billing) {
      const currentDate = new Date();
      const difference_in_time =
        currentDate.getTime() - new Date(billing.date).getTime();
      const difference_in_days = Math.round(
        difference_in_time / (1000 * 3600 * 24)
      );
      return 30 - difference_in_days;
    }
  },
  computed: {
    clients() {
      return this.$store.getters['clients/clients'];
    },
    billings() {
      return this.$store.getters['billings/billings'];
    },
    currentClientBillings() {
      const filtered = this.billings.filter(
        (billing) => billing.clientId === this.currentClient.id
      );

      return filtered;
    },
    isAddBillingInputsValid() {
      return this.addBillingTransactionNumber.length > 0;
    },
    isAddTripInputsValid() {
      return (
        this.addTripShipmentNumber.length > 0 &&
        this.addTripSPONumber.length > 0 &&
        this.addTripFee !== null &&
        this.addTripFee > 0
      );
    }
  }
};
</script>

<template>
  <h1>Clients - Billing</h1>
  <ul class="nav nav-pills mb-3 gap-2" id="billing-tab" role="tablist">
    <CompanyTab
      v-for="client in clients"
      :classes="client === clients[0] ? 'active' : ''"
      :id="'billing-' + client.company_name.split(' ').join('') + '-tab'"
      :target="'#billing-' + client.id"
      :selected="client === clients[0] ? true : false"
      @click="handleClick(client)"
    >
      {{ client.company_name }}
    </CompanyTab>
  </ul>
  <div class="tab-content" id="pills-tabContent">
    <TabPane
      v-for="client in clients"
      :classes="client === clients[0] ? 'active show' : ''"
      :id="'billing-' + client.id"
    >
      <p class="text-danger fw-bold" v-if="currentClientBillings.length === 0">
        There is no billing to this client
      </p>
      <main v-for="currentClientBilling in currentClientBillings">
        <div class="billing text-white">
          <header
            class="header-billing d-flex flex-row justify-content-center align-items-center"
          >
            <section class="w-75">
              <div class="border-right border-btm">
                <h1>{{ client.company_name }}</h1>
                <p class="client_address">
                  {{ currentClient.address }}
                </p>
              </div>
              <h3 class="border-right mb-0">{{ client.company_name }}</h3>
            </section>
            <section
              class="d-flex flex-column justify-content-center h-100 w-25"
            >
              <p class="billing_date m-0 p-2 border-y">
                {{ currentClientBilling.date.slice(0, 10) }}
              </p>
              <p class="billing_remaining_days m-0 p-2 border-btm">
                {{ getRemainingDays(currentClientBilling) }} day/s
              </p>
              <p class="billing_id m-0 p-2 border-btm">
                {{ currentClientBilling.transaction_number }}
              </p>
            </section>
          </header>
          <div class="separator border-y p-3"></div>

          <p
            class="text-danger d-flex justify-content-center align-items-center fw-bold text-decoration-underline m-0"
            v-if="
              currentClientBilling.trips &&
              currentClientBilling.trips.length === 0
            "
          >
            There are no trip records for this client's billing.
          </p>
          <main
            v-for="(trip, index) in currentClientBilling.trips"
            class="text-black d-flex flex-column"
          >
            <section class="d-flex w-100 height-50 border-btm">
              <div
                class="d-flex justify-content-around align-items-center w-75"
              >
                <p class="mb-0 width-50 fw-bold width-1-3">
                  {{ index + 1 }}
                </p>
                <p class="mb-0 width-1-3" v-if="trip.date">
                  {{ trip.date.slice(0, 10) }}
                </p>
                <p class="mb-0 width-1-3">
                  Shipment No.: {{ trip.shipmentNumber }}
                </p>
              </div>
              <p
                class="w-25 mb-0 d-flex justify-content-center align-items-center"
              >
                {{ trip.fee }}
              </p>
            </section>

            <section class="d-flex w-100 height-50 border-btm">
              <div
                class="d-flex justify-content-around align-items-center w-75"
              >
                <p class="mb-0 width-50"></p>
                <p class="mb-0"></p>
                <p class="mb-0 spo-number">SPO No.: {{ trip.SPONumber }}</p>
              </div>
              <p
                class="w-25 mb-0 d-flex justify-content-center align-items-center"
              ></p>
            </section>
          </main>
          <section
            v-if="
              currentClientBilling.trips &&
              currentClientBilling.trips.length > 0
            "
            class="d-flex w-100 height-50"
          >
            <div class="d-flex justify-content-around align-items-center w-75">
              <p class="mb-0 width-50"></p>
              <p class="mb-0"></p>
              <p class="mb-0"></p>
            </div>
            <p
              class="w-25 mb-0 d-flex justify-content-center align-items-center fw-bold text-black"
            >
              {{ currentClientBilling.totalFee }}
            </p>
          </section>
        </div>
        <div class="actions d-flex justify-content-start pt-2 pb-5">
          <button
            type="button"
            data-bs-toggle="modal"
            data-bs-target="#addTripModal"
            class="btn tms-btn text-light px-5"
            @click="setCurrentBilling(currentClientBilling)"
          >
            Add Trip
          </button>
          <button
            type="button"
            class="btn btn-danger text-light px-5 ms-2"
            @click="deleteBilling(currentClientBilling.id)"
          >
            Delete Billing
          </button>
          <button
            v-if="
              currentClientBilling.trips &&
              currentClientBilling.trips.length > 0
            "
            type="button"
            class="btn tms-btn text-light px-5 ms-2"
            @click="handleGenerateCopy"
          >
            Generate copy
          </button>
        </div>
      </main>
    </TabPane>
    <h3 class="text-danger" v-if="!clients.length">Please add a client...</h3>
  </div>
  <FloatingActionButtonVue
    :isForBilling="true"
    :hide="clients.length > 0 ? false : true"
  />

  <Modal id="addBillingModal">
    <template v-slot:modal-header>
      <div class="modal-header justify-content-center border-bottom-0">
        <h1 class="modal-title fs-5" id="addBillingModalLabel">
          Billing's Information
        </h1>
      </div>
    </template>
    <template v-slot:modal-body>
      <div class="modal-body">
        <form id="addBillingForm" @submit.prevent="addNewBilling">
          <div class="mb-3">
            <label for="transactionNumber" class="form-label d-block text-start"
              >Transaction Number</label
            >
            <input
              v-model="addBillingTransactionNumber"
              type="text"
              class="form-control"
              id="transactionNumber"
              aria-describedby="transactionNumber"
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
          form="addBillingForm"
          data-bs-dismiss="modal"
          :disabled="!isAddBillingInputsValid"
        >
          Create Billing
        </button>
      </div>
    </template>
  </Modal>

  <Modal id="addTripModal">
    <template v-slot:modal-header>
      <div class="modal-header justify-content-center border-bottom-0">
        <h1 class="modal-title fs-5" id="addTripModalLabel">
          Trip's Information
        </h1>
      </div>
    </template>
    <template v-slot:modal-body>
      <div class="modal-body">
        <form id="addTripForm" @submit.prevent="addNewTrip">
          <div class="mb-3">
            <label for="shipmentNumber" class="form-label d-block text-start"
              >Shipment Number</label
            >
            <input
              v-model="addTripShipmentNumber"
              type="text"
              class="form-control"
              id="shipmentNumber"
              aria-describedby="shipmentNumber"
            />
          </div>

          <div class="mb-3">
            <label for="spoNumber" class="form-label d-block text-start"
              >SPO Number</label
            >
            <input
              v-model="addTripSPONumber"
              type="text"
              class="form-control"
              id="spoNumber"
              aria-describedby="spoNumber"
            />
          </div>

          <div class="mb-3">
            <label for="fee" class="form-label d-block text-start">Fee</label>
            <input
              v-model="addTripFee"
              type="number"
              class="form-control"
              id="fee"
              aria-describedby="fee"
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
          form="addTripForm"
          data-bs-dismiss="modal"
          :disabled="!isAddTripInputsValid"
        >
          Add Trip
        </button>
      </div>
    </template>
  </Modal>
</template>

<style scoped>
.min-width-100px {
  min-width: 100px;
}

.header-billing,
.separator {
  background-color: #4c7273;
}

.billing {
  border: 2px solid black;
}

.border-left {
  border-left: 2px solid black;
}

.border-right {
  border-right: 2px solid black;
}

.border-top {
  border-top: 2px solid black;
}

.border-btm {
  border-bottom: 2px solid black;
}

.border-y {
  border-top: 2px solid black;
  border-bottom: 2px solid black;
}

.border-x {
  border-right: 2px solid black;
  border-left: 2px solid black;
}

.min-height-50 {
  min-height: 50px;
}

.center-x-y {
  display: flex;
  justify-content: center;
  align-items: center;
}

.width-50 {
  width: 50px;
}

.height-50 {
  height: 50px;
}

.width-1-3 {
  width: 33.33%;
}

.spo-number {
  width: 100%;
  margin-left: 66%;
}
</style>
