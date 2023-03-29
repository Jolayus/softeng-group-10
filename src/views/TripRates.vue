<script>
import CompanyTab from '../components/CompanyTab.vue';
import TabPane from '../components/TabPane.vue';
import FloatingActionButton from '../components/FloatingActionButton.vue';
import Footer from '../components/Footer.vue';

export default {
  name: 'Trip Rates',
  components: {
    CompanyTab,
    TabPane,
    Footer,
    FloatingActionButton
  }
};
</script>

<template>
  <h1>Trip Rates</h1>
  <ul class="nav nav-pills mb-3" id="pills-tab" role="tablist">
    <CompanyTab
      classes="active"
      id="pills-home-tab"
      target="#pills-home"
      selected="true"
    >
      Home
    </CompanyTab>
    <CompanyTab id="pills-profile-tab" target="#pills-profile"
      >Profile</CompanyTab
    >
    <CompanyTab id="pills-contact-tab" target="#pills-contact">
      Contact
    </CompanyTab>
  </ul>
  <div class="tab-content" id="pills-tabContent">
    <TabPane classes="show active" id="pills-home"> ... </TabPane>
    <TabPane id="pills-profile"> ... </TabPane>
    <TabPane id="pills-contact"> ... </TabPane>
  </div>
  <FloatingActionButton />
</template>

