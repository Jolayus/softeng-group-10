<script>
import CompanyTab from '../components/CompanyTab.vue';
import TabPane from '../components/TabPane.vue';
import Footer from '../components/Footer.vue';
import Modal from '../components/Modal.vue';

import {
  httpPostBillingTrip,
  httpDeleteBilling,
  httpDeleteBillingTrips
} from '../requests/requests';

export default {
  name: 'Billing',
  props: ['billingId'],
  components: {
    CompanyTab,
    TabPane,
    Footer,
    Modal
  },
  data() {
    return {
      // ADD TRIP INPUT
      addTripShipmentNumber: '',
      addTripSPONumber: '',
      addTripFee: null,

      // DELETE BILLING TRIP
      deleteBillingTripIdx: -1
    };
  },
  methods: {
    addNewTrip() {
      const newTrip = {
        billingId: this.billing.id,
        date: new Date().toISOString().slice(0, 19).replace('T', ' '),
        shipmentNumber: this.addTripShipmentNumber,
        SPONumber: this.addTripSPONumber,
        fee: this.addTripFee
      };

      httpPostBillingTrip(newTrip).then((data) => {
        this.billing.trips.push(data);
        console.log(data.fee);
        this.billing.totalFee += data.fee;

        this.$store.dispatch('billingTrips/addBillingTrip', data);
      });

      this.addTripShipmentNumber = '';
      this.addTripSPONumber = '';
      this.addTripFee = null;
    },
    handleGenerateCopy() {
      fetch('http://localhost:8000/billings/getFile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...this.billing,
          company_name: this.client.company_name,
          company_address: this.client.address
        })
      })
        .then((response) => {
          return response.blob();
        })
        .then((blob) => {
          const url = window.URL.createObjectURL(new Blob([blob]));
          const a = document.createElement('a');
          a.href = url;
          a.download = `${this.client.company_name} - Billing.xlsx`;
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
    deleteBilling(billingId) {
      httpDeleteBilling(billingId).then(() => {
        httpDeleteBillingTrips(billingId);
        this.$store.dispatch('billings/deleteBilling', billingId);

        console.log(this.$router.replace('/billinglist'));
      });
    },
    deleteBillingTrip() {
      const deletedBillingTrip = this.billing.trips[this.deleteBillingTripIdx];

      httpDeleteBillingTrips(deletedBillingTrip.billingId).then(() => {
        this.$store.dispatch(
          'billingTrips/deleteBillingTrip',
          deletedBillingTrip.billingId
        );

        const idx = this.billing.trips.findIndex(
          (trip) => trip.id === deletedBillingTrip.id
        );

        this.billing.trips.splice(idx, 1);
      });
    }
  },
  computed: {
    clients() {
      return this.$store.getters['clients/clients'];
    },
    billing() {
      const billing = this.billings.find(
        (billing) => billing.id === Number(this.billingId)
      );
      return billing;
    },
    billingTrips() {
      return this.billing.trips;
    },
    client() {
      if (this.billing) {
        const clientId = this.billing.clientId;
        return this.clients.find((client) => client.id === clientId);
      }
    },
    billings() {
      return this.$store.getters['billings/billings'];
    },
    isAddTripInputsValid() {
      return (
        this.addTripShipmentNumber.length > 0 &&
        this.addTripSPONumber.length > 0 &&
        this.addTripFee !== null &&
        this.addTripFee > 0
      );
    },
    formattedDate() {
      const options = { month: 'long', day: '2-digit', year: 'numeric' };
      const date = new Date(this.billing.date);
      return date.toLocaleDateString('en-US', options);
    },
  }
};
</script>

<template>
  <h1>Clients - Billing</h1>
  <nav aria-label="breadcrumb">
    <ol class="breadcrumb">
      <li class="breadcrumb-item active" aria-current="page" v-if="billing">
        {{ formattedDate }}
      </li>
      <li class="breadcrumb-item">
        <RouterLink to="/billinglist" class="custom-link">Billing List</RouterLink>
      </li>
    </ol>
  </nav>
  <div class="tab-content" id="pills-tabContent">
    <main>
      <div class="billing text-white">
        <header
          class="header-billing d-flex flex-row justify-content-center align-items-center"
        >
          <section class="w-75" v-if="client">
            <div class="border-right border-btm">
              <h1>{{ client.company_name }}</h1>
              <p class="client_address">
                {{ client.address }}
              </p>
            </div>
            <h3 class="border-right mb-0">{{ client.company_name }}</h3>
          </section>
          <section class="d-flex flex-column justify-content-center h-100 w-25">
            <p class="billing_date m-0 p-2 border-y" v-if="billing">
              {{ billing.date.slice(0, 10) }}
            </p>
            <p class="billing_remaining_days m-0 p-2 border-btm">30 day/s</p>
            <p class="billing_id m-0 p-2 border-btm" v-if="billing">
              {{ billing.transaction_number }}
            </p>
          </section>
        </header>
        <div class="separator border-y p-3"></div>

        <p
          class="text-danger d-flex justify-content-center align-items-center fw-bold text-decoration-underline m-0"
          v-if="billing && billing.trips && billing.trips.length === 0"
        >
          There are no trip records for this client's billing.
        </p>
        <main
          v-if="billing"
          v-for="(trip, index) in billing.trips"
          class="text-black d-flex flex-column"
        >
          <section class="d-flex w-100 height-50 border-btm">
            <div class="d-flex justify-content-around align-items-center w-75">
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
            <div class="d-flex justify-content-around align-items-center w-75">
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
          v-if="billing && billing.trips && billing.trips.length > 0"
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
            {{ billing.totalFee }}
          </p>
        </section>
      </div>
      <div class="actions d-flex justify-content-start pt-2 pb-5">
        <button
          type="button"
          data-bs-toggle="modal"
          data-bs-target="#addTripModal"
          class="btn tms-btn text-light px-5"
        >
          Add Trip
        </button>
        <button
          v-if="billing && billing.trips && billing.trips.length > 0"
          type="button"
          data-bs-toggle="modal"
          data-bs-target="#deleteBillingTrip"
          class="btn btn-danger text-light px-5 ms-2"
        >
          Delete Trip
        </button>
        <button
          type="button"
          data-bs-toggle="modal"
          data-bs-target="#deleteBillingVerif"
          class="btn btn-danger text-light px-5 ms-2"
        >
          Delete Billing
        </button>
        <button
          v-if="billing && billing.trips && billing.trips.length > 0"
          type="button"
          class="btn tms-btn text-light px-5 ms-2"
          @click="handleGenerateCopy"
        >
          Generate copy
        </button>
      </div>
    </main>
    <h3 class="text-danger" v-if="!clients.length">Please add a client...</h3>
  </div>

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

  <Modal id="deleteBillingVerif">
    <template v-slot:modal-header>
      <div class="modal-header justify-content-center border-bottom-0">
        <h1 class="modal-title fs-5" id="deleteBillingVerifLabel">
          Delete Billing
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
          @click.prevent="deleteBilling(billing.id)"
        >
          Delete Billing
        </button>
      </div>
    </template>
  </Modal>

  <Modal id="deleteBillingTrip">
    <template v-slot:modal-header>
      <div class="modal-header justify-content-center border-bottom-0">
        <h1 class="modal-title fs-5" id="deleteBillingTripLabel">
          Billing Trip's number
        </h1>
      </div>
    </template>
    <template v-slot:modal-body>
      <div class="modal-body">
        <form id="deleteTripForm" @submit.prevent="deleteBillingTrip">
          <div class="mb-3">
            <label for="billingTripNumber" class="form-label d-block text-start"
              >Billing Trip's Number</label
            >
            <select
              class="form-select"
              id="billingTripNumber"
              aria-label="billingTripNumber"
              v-model="deleteBillingTripIdx"
            >
              <option selected :value="-1">Open this select menu</option>
              <option
                v-if="billing"
                v-for="(trip, index) in billing.trips"
                :value="index"
              >
                Number: {{ index + 1 }}
              </option>
            </select>
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
          form="deleteTripForm"
          data-bs-dismiss="modal"
          :disabled="deleteBillingTripIdx < 0"
        >
          Delete Trip
        </button>
      </div>
    </template>
  </Modal>
</template>

<style scoped>
.custom-link {
  text-decoration: none;
  color: #000;
  cursor: pointer;
}

.custom-link:hover {
  text-decoration: underline;
}

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
