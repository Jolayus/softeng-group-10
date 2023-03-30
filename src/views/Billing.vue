<script>
import CompanyTab from '../components/CompanyTab.vue';
import TabPane from '../components/TabPane.vue';
import Footer from '../components/Footer.vue';
import FloatingActionButtonVue from '../components/FloatingActionButton.vue';

import { getClientModel } from '../model/client.model';

export default {
  name: 'Billing',
  data() {
    return {
      clients: getClientModel()
    }
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
      :id="'billing-' + client.companyName.split(' ').join('') + '-tab'"
      :target="'#billing-' + client.companyName.split(' ').join('')"
      :selected="client === clients[0] ? true : false"
    >
      {{ client.companyName }}
    </CompanyTab>
  </ul>
  <div class="tab-content" id="pills-tabContent">
    <TabPane 
      v-for="client in clients"
      :classes="client === clients[0] ? 'active show' : ''"
      :id="'billing-' + client.companyName.split(' ').join('')"
    >
    {{ client.companyName }}
    <table class="table">
        <thead class="tbl-header-billing text-light rounded">
          <tr>
            <th scope="col" rowspan="2">
              <h1>GREENCROSS INCORPORATED</h1>
              <p>14/F COMMON GOAL TOWER FINANCE COR INDUSTRY STS. MADRIGAL BUSINESS PARK AYALA ABALANG 1780, CITY OF MUNTINLUPA, FOURTH DISTRICT 
              </p>
            </th>
            <th scope="col" class="min-width-100px" rowspan="2">
              <p>02-Feb-22</p>
              <p>30 DAYS</p>
            </th>
          </tr>
        </thead>
        <tbody class="table-group-divider">
        </tbody>
      </table>
    </TabPane>
  </div>
  <FloatingActionButtonVue />
</template>

<style scoped>
.min-width-100px {
  min-width: 100px;
}

.tbl-header-billing {
  background-color: #4c7273;
}
</style>