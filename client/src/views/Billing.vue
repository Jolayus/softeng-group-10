<script>
import CompanyTab from '../components/CompanyTab.vue';
import TabPane from '../components/TabPane.vue';
import Footer from '../components/Footer.vue';
import FloatingActionButtonVue from '../components/FloatingActionButton.vue';
import Modal from '../components/Modal.vue';

import { getClientsModel } from '../models/client.model';
import { getEmployeesModel } from '../models/billings.model';

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

      // ADD BILLING
      addBillingTransactionNumber: '',
      addBillingShipmentNumber: '',
      addBillingSPONumber: '',
      addBillingFee: null
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
      const shipmentNumber = this.addBillingShipmentNumber;
      const SPONumber = this.addBillingSPONumber;
      const fee = this.addBillingFee;

      const newBilling = {
        isActive: true,
        clientId,
        date,
        transactionNumber,
        shipmentNumber,
        SPONumber,
        fee
      };

      this.$store.dispatch('billings/addBilling', newBilling);
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
      return this.billings.filter(
        (billing) => billing.clientId === this.currentClient.id
      );
    },
    isAddBillingInputsValid() {
      return (
        this.addBillingTransactionNumber.length > 0 &&
        this.addBillingShipmentNumber.length > 0 &&
        this.addBillingSPONumber.length > 0 &&
        this.addBillingFee > 0 &&
        this.addBillingFee !== null
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
      <main v-for="(currentClientBilling, index) in currentClientBillings">
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
                {{ currentClientBilling.date.toISOString().slice(0, 10) }}
              </p>
              <p class="billing_remaining_days m-0 p-2 border-btm">30 days</p>
              <p class="billing_id m-0 p-2 border-btm">
                {{ currentClientBilling.transactionNumber }}
              </p>
            </section>
          </header>
          <div class="separator border-y p-3"></div>

          <main class="text-black d-flex flex-column">
            <section class="d-flex w-100 height-50 border-btm">
              <div
                class="d-flex justify-content-around align-items-center w-75"
              >
                <p class="mb-0 width-50 fw-bold">
                  {{ index + 1 }}
                </p>
                <p class="mb-0">
                  {{ currentClientBilling.date.toISOString().slice(0, 10) }}
                </p>
                <p class="mb-0">
                  Shipment No.: {{ currentClientBilling.shipmentNumber }}
                </p>
              </div>
              <p
                class="w-25 mb-0 d-flex justify-content-center align-items-center"
              >
                {{ currentClientBilling.fee }}
              </p>
            </section>

            <section class="d-flex w-100 height-50 border-btm">
              <div
                class="d-flex justify-content-around align-items-center w-75"
              >
                <p class="mb-0 width-50"></p>
                <p class="mb-0"></p>
                <p class="mb-0">
                  SPO No.: {{ currentClientBilling.SPONumber }}
                </p>
              </div>
              <p
                class="w-25 mb-0 d-flex justify-content-center align-items-center"
              ></p>
            </section>

            <section class="d-flex w-100 height-50">
              <div
                class="d-flex justify-content-around align-items-center w-75"
              >
                <p class="mb-0 width-50"></p>
                <p class="mb-0"></p>
                <p class="mb-0"></p>
              </div>
              <p
                class="w-25 mb-0 d-flex justify-content-center align-items-center fw-bold"
              >
                {{ currentClientBilling.fee }}
              </p>
            </section>
          </main>
        </div>
        <div
          v-if="currentClientBilling.isActive"
          class="actions d-flex justify-content-start pt-2"
        >
          <button class="btn bg-primary text-light">Add Trips</button>
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

          <div class="mb-3">
            <label for="shipmentNumber" class="form-label d-block text-start"
              >Shipment Number</label
            >
            <input
              v-model="addBillingShipmentNumber"
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
              v-model="addBillingSPONumber"
              type="text"
              class="form-control"
              id="spoNumber"
              aria-describedby="spoNumber"
            />
          </div>

          <div class="mb-3">
            <label for="fee" class="form-label d-block text-start">Fee</label>
            <input
              v-model="addBillingFee"
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
          form="addBillingForm"
          data-bs-dismiss="modal"
          :disabled="!isAddBillingInputsValid"
        >
          Add Billing
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
        <form id="addTripForm" @submit.prevent="addNewBilling">
          <div class="mb-3">
            <label for="shipmentNumber" class="form-label d-block text-start"
              >Shipment Number</label
            >
            <input
              v-model="addBillingShipmentNumber"
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
              v-model="addBillingSPONumber"
              type="text"
              class="form-control"
              id="spoNumber"
              aria-describedby="spoNumber"
            />
          </div>

          <div class="mb-3">
            <label for="fee" class="form-label d-block text-start">Fee</label>
            <input
              v-model="addBillingFee"
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
          form="addBillingForm"
          data-bs-dismiss="modal"
          :disabled="!isAddBillingInputsValid"
        >
          Add Billing
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
</style>
