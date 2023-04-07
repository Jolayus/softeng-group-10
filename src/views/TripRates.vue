<script>
import CompanyTab from '../components/CompanyTab.vue';
import TabPane from '../components/TabPane.vue';
import Footer from '../components/Footer.vue';
import FloatingActionButtonVue from '../components/FloatingActionButton.vue';

import { getClientModel } from '../model/client.model';

export default {
  name: 'Trip Rates',
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
  <h1>Clients - Trip Rates</h1>
  <ul class="nav nav-pills mb-3 gap-2" id="pills-tab" role="tablist">
    <CompanyTab  
      v-for="client in clients" 
      :classes="client === clients[0] ? 'active' : ''"
      :id="'pills-' + client.companyName.split(' ').join('') + '-tab'"
      :target="'#pills-' + client.id"
      :selected="client === clients[0] ? true : false"
    >
      {{ client.companyName }}
    </CompanyTab>
  </ul>
  <div class="tab-content" id="pills-tabContent">
    <TabPane 
      v-for="client in clients"
      :classes="client === clients[0] ? 'active show' : ''"
      :id="'pills-' + client.id"
    >
    {{ client.companyName }}
    </TabPane>
  </div>
  <FloatingActionButtonVue isForTripRates="true" />
</template>