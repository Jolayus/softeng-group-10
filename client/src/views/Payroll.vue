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
      <div class="table-responsive">
        <table class="table">
          <thead>
            <tr class="text-light">
              <th class="bg-primary" scope="col">Emp. No</th>
              <th class="bg-primary" scope="col">Role</th>
              <th class="bg-primary" scope="col">Name</th>
              <th class="bg-primary" scope="col">Date Hired</th>
              <th class="bg-primary" scope="col">Basic</th>
              <th class="bg-primary" scope="col">Allowance</th>
              <th class="bg-primary" scope="col">Daily Rate</th>
              <th class="bg-primary" scope="col">Daily Allowance</th>
              <th class="bg-primary" scope="col">No. of days</th>
              <th class="bg-warning" scope="col">Semi basic salary</th>
              <th class="bg-warning" scope="col">Semi allowance salary</th>
              <th class="bg-warning" scope="col">AUV</th>
              <th class="bg-warning" scope="col">Overtime pay</th>
              <th class="bg-warning" scope="col">Extra pay</th>
              <th class="bg-secondary" scope="col">Total</th>
              <th class="bg-success" scope="col">Cash Advance</th>
              <th class="bg-success" scope="col">HDMF</th>
              <th class="bg-success" scope="col">SSS</th>
              <th class="bg-success" scope="col">Late</th>
              <th class="bg-success" scope="col">Damange</th>
              <th class="bg-danger" scope="col">Total Reduction</th>
              <th class="bg-info" scope="col">Net Pay</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">1</th>
              <td>ROCHELLE JACOB</td>
              <td>PROJECT MANAGER</td>
              <td>15-Jan-22</td>
              <td>20,000.00</td>
              <td></td>
              <td>909.09</td>
              <td></td>
              <td>11</td>
              <td>10,000.00</td>
              <td>-</td>
              <td></td>
              <td></td>
              <td></td>
              <td>10,000.00</td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td class="bg-danger">10,000.00</td>
            </tr>
            <tr>
              <th scope="row">2</th>
              <td>TRISHA ALVAREZ</td>
              <td>HELPER</td>
              <td>01-Jun-22</td>
              <td>9,100.00</td>
              <td></td>
              <td>500.00</td>
              <td></td>
              <td>8</td>
              <td>4,000.00</td>
              <td>-</td>
              <td></td>
              <td></td>
              <td>1.400.00</td>
              <td>5,400.00</td>
              <td>1,000.00</td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td>1,000.00</td>
              <td>4,400.00</td>
            </tr>
            <tr>
              <th scope="row">3</th>
              <td>MELVIN CASTANEDA</td>
              <td>HELPER</td>
              <td>01-Jun-22</td>
              <td></td>
              <td></td>
              <td>600.00</td>
              <td></td>
              <td>3</td>
              <td>1,800.00</td>
              <td>-</td>
              <td>2,400.00</td>
              <td>100.00</td>
              <td>400.00</td>
              <td>4,700.00</td>
              <td>1,703.50</td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td>1,703.50</td>
              <td>2,996.50</td>
            </tr>
            <tr>
              <th scope="row">4</th>
              <td>NOLI SAMSON</td>
              <td>DRIVER</td>
              <td></td>
              <td></td>
              <td></td>
              <td>800.00</td>
              <td></td>
              <td>3</td>
              <td>2,400.00</td>
              <td>-</td>
              <td>3,600.00</td>
              <td>100.00</td>
              <td>900.00</td>
              <td>7,000.00</td>
              <td>2,103.50</td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td>2,103.50</td>
              <td>4,896.50</td>
            </tr>
            <tr>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td>2,809.09</td>
              <td></td>
              <td></td>
              <td>18,200.00</td>
              <td>-</td>
              <td>6,000.00</td>
              <td>200.00</td>
              <td>2,700.00</td>
              <td class="bg-secondary">27,100.00</td>
              <td>4,807.00</td>
              <td>-</td>
              <td>-</td>
              <td>-</td>
              <td>-</td>
              <td>4,807.00</td>
              <td class="bg-info">₱ 22,293.00</td>
            </tr>
          </tbody>
        </table>
      </div>
    </TabPane>
    <TabPane id="payroll-payout">
      <div class="table-responsive">
        <table class="table">
          <thead>
            <tr class="text-light">
              <th class="bg-primary" scope="col">Emp. No</th>
              <th class="bg-primary" scope="col">OPERATOR NAME</th>
              <th class="bg-primary" scope="col">DRIVER NAME</th>
              <th class="bg-primary" scope="col">PLATE NO.</th>
              <th class="bg-primary" scope="col">START DATE</th>
              <th class="bg-success" scope="col">NO. OF TRIPS</th>
              <th class="bg-primary" scope="col">2GO RATE</th>
              <th class="bg-warning" scope="col">2GO LOGISTICS TOTAL AMOUNT OF TRIPS (LESS 10%)</th>
              <th class="bg-success" scope="col">NO. OF TRIPS</th>
              <th class="bg-success" scope="col">GREENCROSS TOTAL AMOUNT OF TRIPS</th>
              <th class="bg-warning" scope="col">DROP RATE</th>
              <th class="bg-warning" scope="col">TOLLFEE</th>
              <th class="bg-warning" scope="col">PASSWAY</th>
              <th class="bg-warning" scope="col">OTHERS</th>
              <th class="bg-secondary" scope="col">TOTAL</th>
              <th class="bg-success" scope="col">CASH ADVANCE</th>
              <th class="bg-success" scope="col">MEMBERSHIP FEE</th>
              <th class="bg-success" scope="col">UNIFORM</th>
              <th class="bg-success" scope="col">Penalties</th>
              <th class="bg-danger" scope="col">TOTAL DEDUCTION</th>
              <th class="bg-info" scope="col">NET PAY</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">1</th>
              <td>ROED LOGISTICS SERVICES</td>
              <td></td>
              <td>NFW 8780</td>
              <td>4.30.2022</td>
              <td class="bg-success"></td>
              <td></td>
              <td>-</td>
              <td class="bg-success">4</td>
              <td>11,700.00</td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td class="bg-secondary">11,700.00</td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td>11,700.00</td>
            </tr>
            <tr>
              <th scope="row">1</th>
              <td>ROED LOGISTICS SERVICES</td>
              <td></td>
              <td>NBA 5935</td>
              <td>6.4.2022</td>
              <td class="bg-success"></td>
              <td></td>
              <td>-</td>
              <td class="bg-success">6</td>
              <td>18,450.00</td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td class="bg-secondary">18,450.00</td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td>18,450.00</td>
            </tr>
            <tr>
              <th scope="row">3</th>
              <td>AIZA SOLIDO</td>
              <td>ARBY TABLENGCO</td>
              <td>NES 3680</td>
              <td>4.27.2022</td>
              <td class="bg-success"></td>
              <td></td>
              <td>-</td>
              <td class="bg-success">8</td>
              <td>24,250.00</td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td class="bg-secondary">24,250.00</td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td>24,250.00</td>
            </tr>
            <tr>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td class="bg-success">0</td>
              <td>-</td>
              <td>-</td>
              <td class="bg-success">18</td>
              <td>54,400.00</td>
              <td>-</td>
              <td>-</td>
              <td>-</td>
              <td>-</td>
              <td class="bg-secondary">54,400.00</td>
              <td>-</td>
              <td>-</td>
              <td>-</td>
              <td>-</td>
              <td>-</td>
              <td class="bg-info">₱ 54,400.00</td>
            </tr>
          </tbody>
        </table>
      </div>
    </TabPane>
  </div>
  <FloatingActionButton />
</template>

<style scoped>
thead th {
  min-width: 200px;
  vertical-align: middle;
}
</style>
