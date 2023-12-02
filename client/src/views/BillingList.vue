<script>
import { RouterLink } from 'vue-router';

import CompanyTab from '../components/CompanyTab.vue';
import TabPane from '../components/TabPane.vue';
import Footer from '../components/Footer.vue';
import FloatingActionButtonVue from '../components/FloatingActionButton.vue';
import Modal from '../components/Modal.vue';

import { getClientsModel } from '../models/client.model';
import { getBillingsModel } from '../models/billings.model';

import { httpCreateBilling } from '../requests/requests';

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
      // ADD BILLING INPUT
      addBillingTransactionNumber: '',

      currentClient: getClientsModel().length > 0 ? getClientsModel()[0] : {},
      currentBilling: getBillingsModel().length > 0 ? getClientsModel()[0] : {}
    };
  },
  methods: {
    handleClick(client) {
      this.currentClient = client;
    },
    setCurrentBilling(billing) {
      this.currentBilling = billing;
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
        this.$store.dispatch('billings/addBilling', {
          ...data,
          trips: [],
          totalFee: 0
        });
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
    test(billing) {
      const date = new Date(billing.date);
      const month = this.days[date.getMonth()];

      return `${month}`;
    }
  },
  computed: {
    clients() {
      return this.$store.getters['clients/clients'];
    },
    billings() {
      const billingsCopy = [...this.$store.getters['billings/billings']];
      billingsCopy.reverse();

      return billingsCopy;
    },
    currentClientBillings() {
      const filtered = this.billings.filter(
        (billing) => billing.clientId === this.currentClient.id
      );

      return filtered;
    },
    days() {
      return {
        0: 'January',
        1: 'February',
        2: 'March',
        3: 'April',
        4: 'May',
        5: 'June',
        6: 'July',
        7: 'August',
        8: 'September',
        9: 'October',
        10: 'November',
        11: 'December'
      };
    },
    isAddBillingInputsValid() {
      return this.addBillingTransactionNumber.length > 0;
    }
  }
};
</script>

<template>
  <h1>Clients - Billing</h1>
  <ul class="nav nav-pills gap-2" id="billing-tab" role="tablist">
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
  <div class="mb-5 d-flex justify-content-end px-5">
    <button class="btn tms-btn text-light" type="button"
    data-bs-toggle="modal"
          data-bs-target="#addBillingModal"
    >Add Billing</button>
  </div>
  <div class="tab-content" id="pills-tabContent">
    <TabPane
      v-for="client in clients"
      :classes="client === clients[0] ? 'active show' : ''"
      :id="'billing-' + client.id"
    >
      <p class="text-danger fw-bold" v-if="currentClientBillings.length === 0">
        There is no billing to this client
      </p>
      <main>
        <ul class="container list-group">
          <div class="row justify-content-center">
            <li
              class="col-5 fs-4 p-2 m-1"
              v-for="currentClientBilling in currentClientBillings"
            >
              <RouterLink :to="`/billing/${currentClientBilling.id}`"
                >{{ test(currentClientBilling) }},
                {{ currentClientBilling.date }}</RouterLink
              >
            </li>
          </div>
        </ul>
      </main>
    </TabPane>
    <h3 class="text-danger" v-if="!clients.length">Please add a client...</h3>
  </div>

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
</template>

<style scoped>
ul {
  list-style: none;
}

li {
  border: 2px solid rgba(0, 0, 0, 0.3);
  border-radius: 5px;
}
</style>
