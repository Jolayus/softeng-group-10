<script>
import CompanyTab from '../components/CompanyTab.vue';
import TabPane from '../components/TabPane.vue';
import Footer from '../components/Footer.vue';
import FloatingActionButtonVue from '../components/FloatingActionButton.vue';

import { getClientsModel } from '../models/client.model';

export default {
  name: 'Billing',
  data() {
    return {
      clients: getClientsModel()
    };
  },
  components: {
    CompanyTab,
    TabPane,
    Footer,
    FloatingActionButtonVue
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

      <main class="billing text-white">
        <header
          class="header-billing d-flex flex-row justify-content-center align-items-center"
        >
          <section class="w-75">
            <div class="border-right border-btm">
              <h1>{{ client.company_name }}</h1>
              <p class="client_address">
                14/F COMMON GOAL TOWER FINANCE COR INDUSTRY STS. MADRIGAL
                BUSINESS PARK AYALA ABALANG 1780, CITY OF MUNTINLUPA, FOURTH
                DISTRICT
              </p>
            </div>
            <h3 class="border-right mb-0">{{ client.company_name }}</h3>
          </section>
          <section class="d-flex flex-column justify-content-center h-100 w-25">
            <p class="billing_date m-0 p-2 border-y">02-Feb-22</p>
            <p class="billing_remaining_days m-0 p-2 border-btm">30 days</p>
            <p class="billing_id m-0 p-2 border-btm">000-416-871-00000</p>
          </section>
        </header>
        <div class="separator border-y p-3"></div>

        <main class="text-black d-flex flex-column">

          <section class="d-flex w-100 height-50 border-btm">
            <div class="d-flex justify-content-around align-items-center w-75">
              <p class="mb-0 width-50">1</p>
              <p class="mb-0">02-Feb-23</p>
              <p class="mb-0">Shipment No.: 4610125213</p>
            </div>
            <p class="w-25 mb-0 d-flex justify-content-center align-items-center">4,000.00</p>
          </section>

          <section class="d-flex w-100 height-50 border-btm">
            <div class="d-flex justify-content-around align-items-center w-75">
              <p class="mb-0 width-50"></p>
              <p class="mb-0"></p>
              <p class="mb-0">SPO No.: 1500115216</p>
            </div>
            <p class="w-25 mb-0 d-flex justify-content-center align-items-center"></p>
          </section>

          <section class="d-flex w-100 height-50">
            <div class="d-flex justify-content-around align-items-center w-75">
              <p class="mb-0 width-50"></p>
              <p class="mb-0"></p>
              <p class="mb-0"></p>
            </div>
            <p class="w-25 mb-0 d-flex justify-content-center align-items-center fw-bold">4,000.00</p>
          </section>
        </main>
      </main>
    </TabPane>
  </div>
  <FloatingActionButtonVue />
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
  border: 5px solid black;
}

.border-left {
  border-left: 5px solid black;
}

.border-right {
  border-right: 5px solid black;
}

.border-top {
  border-top: 5px solid black;
}

.border-btm {
  border-bottom: 5px solid black;
}

.border-y {
  border-top: 5px solid black;
  border-bottom: 5px solid black;
}

.border-x {
  border-right: 5px solid black;
  border-left: 5px solid black;
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
