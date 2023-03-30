<script>
import CompanyTab from '../components/CompanyTab.vue';
import TabPane from '../components/TabPane.vue';
import FloatingActionButton from '../components/FloatingActionButton.vue';

export default {
  name: 'Payroll',
  components: {
    CompanyTab,
    TabPane,
    FloatingActionButton
  }
};
</script>

<template>
  <h1>Payroll</h1>
  <ul class="nav nav-pills mb-3 gap-2" id="billing-tab" role="tablist">
    <CompanyTab
      :classes="'active'"
      :id="'payroll-internal-tab'"
      :target="'#payroll-internal'"
      :selected="true"
    >
      Internal
    </CompanyTab>
    <CompanyTab :id="'payroll-payout-tab'" :target="'#payroll-payout'">
      Payout
    </CompanyTab>
  </ul>
  <div class="tab-content" id="pills-tabContent">
    <TabPane classes="show active" id="payroll-internal">
      Internal
    </TabPane>
    <TabPane id="payroll-payout">
      Payout
    </TabPane>
  </div>
  <FloatingActionButton />
</template>

<style scoped>
table.table {
  overflow: scroll;
}
</style>
