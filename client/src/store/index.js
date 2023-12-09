import { createStore } from 'vuex';

import employeesModule from './modules/employees';
import clientsModule from './modules/clients';
import tripRatesModule from './modules/tripRates';
import archivedEmployeesModule from './modules/archivedEmployees';
import archivedClientsModule from './modules/archivedClients';
import billingsModule from './modules/billings';
import billingTripsModule from './modules/billingTrips';
import payrollBatchesModule from './modules/payrollBatches';
import payrollSalariesModule from './modules/payrollSalaries';
import payrollDeductionsModule from './modules/payrollDeductions';
import payrollExternalSalariesModule from './modules/payrollExternalSalaries';
import payrollExternalDeductionsModule from './modules/payrollExternalDeductions';

const store = createStore({
  modules: {
    employees: employeesModule,
    clients: clientsModule,
    tripRates: tripRatesModule,
    archivedEmployees: archivedEmployeesModule,
    archivedClients: archivedClientsModule,
    billings: billingsModule,
    billingTrips: billingTripsModule,
    batches: payrollBatchesModule,
    salaries: payrollSalariesModule,
    deductions: payrollDeductionsModule,
    externalSalaries: payrollExternalSalariesModule,
    externalDeductions: payrollExternalDeductionsModule
  }
});

export default store;
