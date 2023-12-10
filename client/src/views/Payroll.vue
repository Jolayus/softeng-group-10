<script>
import SearchIcon from '../components/Icons/SearchIcon.vue';
import FloatingActionButton from '../components/FloatingActionButton.vue';
import Modal from '../components/Modal.vue';

import {
  httpPostNewBatch,
  httpPostNewSalary,
  httpUpdateSalary,
  httpPostNewDeduction,
  httpUpdateDeduction,
  httpPostNewExternalSalary,
  httpPostNewExternalDeduction,
  httpUpdateExternalSalary,
  httpUpdateExternalDeduction,
  httpPostNewPayrollEmployee
} from '../requests/requests';

class Batch {
  constructor(batchCode, batchPeriodCoverFrom, batchPeriodCoverTo, employeeId) {
    this.batchCode = new Date().getFullYear() + ' - ' + batchCode;
    this.batchPeriodCoverFrom = batchPeriodCoverFrom;
    this.batchPeriodCoverTo = batchPeriodCoverTo;
    this.employeeId = employeeId;
  }
}

class Salary {
  constructor(
    employeeId,
    basicSalary,
    allowanceSalary,
    dailyRate,
    dailyAllowance,
    daysOfWork,
    semiBasicSalary,
    semiAllowanceSalary,
    serviceFee,
    overtimePay,
    others,
    total
  ) {
    this.employeeId = employeeId;
    this.basicSalary = basicSalary;
    this.allowanceSalary = allowanceSalary;
    this.dailyRate = dailyRate;
    this.dailyAllowance = dailyAllowance;
    this.daysOfWork = daysOfWork;
    this.semiBasicSalary = semiBasicSalary;
    this.semiAllowanceSalary = semiAllowanceSalary;
    this.serviceFee = serviceFee;
    this.overtimePay = overtimePay;
    this.others = others;
    this.total = total;
  }
}

class Deduction {
  constructor(
    employeeId,
    cashAdvance,
    pagibig,
    SSS,
    philhealth,
    late,
    damages,
    others,
    total
  ) {
    this.employeeId = employeeId;
    this.cashAdvance = cashAdvance;
    this.pagibig = pagibig;
    this.SSS = SSS;
    this.philhealth = philhealth;
    this.late = late;
    this.damages = damages;
    this.others = others;
    this.total = total;
  }
}

class ExternalSalary {
  constructor(
    employeeId,
    noOfTrips,
    clientTripRates,
    totalAmountOfTrips,
    dropRate,
    tollFee,
    passway,
    others,
    total
  ) {
    this.employeeId = employeeId;
    this.noOfTrips = noOfTrips;
    this.clientTripRates = clientTripRates;
    this.totalAmountOfTrips = totalAmountOfTrips;
    this.dropRate = dropRate;
    this.tollFee = tollFee;
    this.passway = passway;
    this.others = others;
    this.total = total;
  }
}

class ExternalDeduction {
  constructor(
    employeeId,
    cashAdvance,
    marineInsuranceFee,
    uniform,
    penalties,
    total
  ) {
    this.employeeId = employeeId;
    this.cashAdvance = cashAdvance;
    this.marineInsuranceFee = marineInsuranceFee;
    this.uniform = uniform;
    this.penalties = penalties;
    this.total = total;
  }
}

class PayrollEmployee {
  constructor(batchCodeId, employeeId, salaryId, deductionId, type) {
    this.batchCodeId = batchCodeId;
    this.employeeId = employeeId;
    this.salaryId = salaryId;
    this.deductionId = deductionId;
    this.type = type;
  }
}

export default {
  name: 'Payroll',
  components: {
    SearchIcon,
    Modal,
    FloatingActionButton
  },
  data() {
    return {
      // SEARCH INPUT
      searchInput: '',

      currentBatch: null,
      currentBatchCode: '',

      // PAYROLL
      payrollCurrentEmployee: null,

      //Create payroll batch
      createBatchPeriodCoverFrom: new Date().toISOString().substring(0, 10),
      createBatchPeriodCoverTo: '',
      createBatchCode: 0,
      selectedEmployee: null,

      //payrollInternalSalaryModal
      payrollBasicSalaryInput: 0,
      payrollAllowanceSalaryInput: 0,
      payrollDailyRateInput: 0,
      payrollDailyAllowanceInput: 0,
      payrollDaysOfWorkInput: 0,
      payrollSemiBasicSalaryInput: 0,
      payrollSemiAllowanceSalaryInput: 0,
      payrollServiceFeeInput: 0,
      payrollOvertimePayInput: 0,
      payrollOtherPayInput: 0,
      payrollTotal: 0,

      //payrollInternalDeductionsModal
      payrollDeductionsCashAdvanceInput: 0,
      payrollDeductionsPAGIBIGInput: 0,
      payrollDeductionsSSSInput: 0,
      payrollDeductionsPhilHealthInput: 0,
      payrollDeductionsLateInput: 0,
      payrollDeductionsDamagesInput: 0,
      payrollDeductionsOtherPayInput: 0,
      deductionTotal: 0,

      //payrollExternalSalaryModal
      payrollNoOfTripsInput: 0,
      payrollClientTripRatesInput: 0,
      payrollTotalAmountOfTripsInput: 0,
      payrollDropRateInput: 0,
      payrollTollFeeInput: 0,
      payrollPasswayInput: 0,
      payrollOthersInput: 0,
      payrollExternalTotal: 0,

      //payrollExternalDeductionsModal
      payrollDeductionsExternalCashAdvanceInput: 0,
      payrollDeductionsMarineInsuranceFeeInput: 0,
      payrollDeductionsUniformInput: 0,
      payrollDeductionsPenaltiesInput: 0,
      deductionExternalTotal: 0
    };
  },
  methods: {
    submitCreateBatchHandler() {
      const { id } = this.selectedEmployee;
      console.log(this.currentEmployee);
      const newBatch = new Batch(
        this.createBatchCode,
        this.createBatchPeriodCoverFrom,
        this.createBatchPeriodCoverTo,
        id
      );

      httpPostNewBatch(newBatch).then((batch) => {
        this.storeCreateBatch(batch);
        this.currentBatch = batch;
        const targetEmployee = this.selectedEmployee;

        if (this.isEmployeeInternal(targetEmployee)) {
          this.addDefautlSalaryAndDeduction(targetEmployee, batch.id);
        } else {
          this.addDefaultExternalSalaryAndDeduction(targetEmployee, batch.id);
        }
      });

      if (!this.isThereBatchCodeExists) {
        this.currentBatchCode = newBatch.batchCode;
      }
    },
    onSubmitRegisterEmployee() {
      this.currentBatch = this.batches.find(
        (batch) => batch.batchCode === this.currentBatchCode
      );
      const targetEmployee = this.selectedEmployee;

      if (this.isEmployeeInternal(targetEmployee)) {
        this.addDefautlSalaryAndDeduction(targetEmployee, this.currentBatch.id);
      } else {
        this.addDefaultExternalSalaryAndDeduction(
          targetEmployee,
          this.currentBatch.id
        );
      }
    },
    async addDefautlSalaryAndDeduction(employee, batchId) {
      const { id } = employee;
      const salary = new Salary(id, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
      const deduction = new Deduction(id, 0, 0, 0, 0, 0, 0, 0, 0);

      const newSalary = await httpPostNewSalary(salary);
      this.storeCreateSalary(newSalary);
      employee.salary = newSalary;

      const newDeduction = await httpPostNewDeduction(deduction);
      this.storeCreateDeduction(newDeduction);
      employee.deduction = newDeduction;

      const payrollEmployee = new PayrollEmployee(
        batchId,
        employee.id,
        employee.salary.id,
        employee.deduction.id,
        employee.type
      );

      httpPostNewPayrollEmployee(payrollEmployee).then((newPayrollEmployee) => {
        this.storeCreatePayrollEmployee(newPayrollEmployee);
      });
    },
    async addDefaultExternalSalaryAndDeduction(employee, batchId) {
      const { id } = employee;

      const externalSalary = new ExternalSalary(id, 0, 0, 0, 0, 0, 0, 0, 0);
      const externalDeduction = new ExternalDeduction(id, 0, 0, 0, 0, 0);

      const newExternalSalary = await httpPostNewExternalSalary(externalSalary);
      this.storeCreateExternalSalary(newExternalSalary);
      employee.salary = newExternalSalary;

      const newExternalDeduction = await httpPostNewExternalDeduction(
        externalDeduction
      );
      this.storeCreateExternalDeduction(newExternalDeduction);
      employee.deduction = newExternalDeduction;

      const payrollEmployee = new PayrollEmployee(
        batchId,
        employee.id,
        employee.salary.id,
        employee.deduction.id,
        employee.type
      );

      httpPostNewPayrollEmployee(payrollEmployee).then((newPayrollEmployee) => {
        this.storeCreatePayrollEmployee(newPayrollEmployee);
      });
    },
    isEmployeeInternal(employee) {
      if (employee === null) {
        return;
      }
      return employee.type.toLowerCase() === 'internal' ? true : false;
    },
    onSubmitSalaryForm() {
      const employeeId = this.payrollCurrentEmployee.id;
      const newDetails = new Salary(
        employeeId,
        this.payrollBasicSalaryInput,
        this.payrollAllowanceSalaryInput,
        this.payrollDailyRateInput,
        this.payrollDailyAllowanceInput,
        this.payrollDaysOfWorkInput,
        this.payrollSemiBasicSalaryInput,
        this.payrollSemiAllowanceSalaryInput,
        this.payrollServiceFeeInput,
        this.payrollOvertimePayInput,
        this.payrollOtherPayInput,
        this.computedPayrollTotal
      );

      newDetails.id = this.payrollCurrentEmployee.salary.id;

      httpUpdateSalary(newDetails).then((updatedSalary) => {
        this.$store.dispatch('salaries/editSalary', updatedSalary);
        this.payrollCurrentEmployee.salary = updatedSalary;
      });
    },
    onSubmitExternalSalaryForm() {
      const employeeId = this.payrollCurrentEmployee.id;
      const newDetails = new ExternalSalary(
        employeeId,
        this.payrollNoOfTripsInput,
        this.payrollClientTripRatesInput,
        this.payrollTotalAmountOfTripsInput,
        this.payrollDropRateInput,
        this.payrollTollFeeInput,
        this.payrollPasswayInput,
        this.payrollOthersInput,
        this.computedPayrollExternalTotal
      );

      newDetails.id = this.payrollCurrentEmployee.salary.id;

      httpUpdateExternalSalary(newDetails).then((updatedExternalSalary) => {
        this.$store.dispatch(
          'externalSalaries/editSalary',
          updatedExternalSalary
        );
        this.payrollCurrentEmployee.salary = updatedExternalSalary;
      });
    },
    onSubmitDeductionForm() {
      const employeeId = this.payrollCurrentEmployee.id;
      const newDetails = new Deduction(
        employeeId,
        this.payrollDeductionsCashAdvanceInput,
        this.payrollDeductionsPAGIBIGInput,
        this.payrollDeductionsSSSInput,
        this.payrollDeductionsPhilHealthInput,
        this.payrollDeductionsLateInput,
        this.payrollDeductionsDamagesInput,
        this.payrollDeductionsOtherPayInput,
        this.computedDeductionsTotal
      );

      newDetails.id = this.payrollCurrentEmployee.deduction.id;

      httpUpdateDeduction(newDetails).then((updatedDeduction) => {
        this.$store.dispatch('deductions/editDeduction', updatedDeduction);
        this.payrollCurrentEmployee.deduction = updatedDeduction;
      });
    },
    onSubmitExternalDeductionForm() {
      const employeeId = this.payrollCurrentEmployee.id;
      const newDetails = new ExternalDeduction(
        employeeId,
        this.payrollDeductionsExternalCashAdvanceInput,
        this.payrollDeductionsMarineInsuranceFeeInput,
        this.payrollDeductionsUniformInput,
        this.payrollDeductionsPenaltiesInput,
        this.computedDeductionsExternalTotal
      );

      newDetails.id = this.payrollCurrentEmployee.deduction.id;

      httpUpdateExternalDeduction(newDetails).then(
        (updatedExternalDeduction) => {
          this.$store.dispatch(
            'externalDeductions/editDeduction',
            updatedExternalDeduction
          );
          this.payrollCurrentEmployee.deduction = updatedExternalDeduction;
        }
      );
    },
    storeCreateBatch(newBatch) {
      this.$store.dispatch('batches/addBatch', newBatch);
    },
    storeCreateSalary(newSalary) {
      this.$store.dispatch('salaries/addSalary', newSalary);
    },
    storeCreateDeduction(newDeduction) {
      this.$store.dispatch('deductions/addDeduction', newDeduction);
    },
    storeCreateExternalSalary(newSalary) {
      this.$store.dispatch('externalSalaries/addSalary', newSalary);
    },
    storeCreateExternalDeduction(newDeduction) {
      this.$store.dispatch('externalDeductions/addDeduction', newDeduction);
    },
    storeCreatePayrollEmployee(newPayrollEmployee) {
      this.$store.dispatch(
        'payrollEmployees/addPayrollEmployee',
        newPayrollEmployee
      );
    },
    tabChangeHandler(batchCode) {
      this.currentBatchCode = batchCode;
    },
    onClickCreateBatchHandler() {
      this.createBatchPeriodCoverTo = '';
      this.createBatchCode = 0;
      this.selectedEmployee = null;
    },
    setPayrollCurrentEmployee(employee) {
      this.payrollCurrentEmployee = employee;
    },
    getNetPay(employee) {
      if (employee && employee.salary && employee.deduction) {
        const { salary, deduction } = employee;
        return (salary.total - deduction.total).toFixed(2);
      }
    },
    getEmployeeById(id) {
      return this.$store.getters['employees/getEmployeeById'](id);
    },
    deleteBatch() {
      // TODO
    }
  },
  computed: {
    employees() {
      return this.$store.getters['employees/employees'];
    },
    payrollEmployees() {
      return this.$store.getters['payrollEmployees/payrollEmployees'];
    },
    availableEmployees() {
      if (!this.currentBatchCode) {
        return this.employees;
      }

      const currentBatch = this.batches.find(
        (batch) => batch.batchCode === this.currentBatchCode
      );

      const registeredEmployees = this.payrollEmployees.filter(
        (payrollEmployee) => payrollEmployee.batchCodeId === currentBatch.id
      );

      const ids = registeredEmployees.map(
        (registeredEmployee) => registeredEmployee.id
      );

      return this.employees.filter((employee) => !ids.includes(employee.id));
    },
    batches() {
      return this.$store.getters['batches/batches'];
    },
    batchCodes() {
      return this.$store.getters['batches/batchCodes'];
    },
    isThereBatchCodeExists() {
      return this.batchCodes.length;
    },
    isEmployeeRoleIsAdmin() {
      return (
        this.payrollCurrentEmployee &&
        this.payrollCurrentEmployee.role === 'Admin'
      );
    },
    salaries() {
      return this.$store.getters['salaries/salaries'];
    },
    filteredEmployees() {
      const currentBatch = this.batches.find(
        (batch) => batch.batchCode === this.currentBatchCode
      );

      if (currentBatch) {
        const payrollEmployees = this.payrollEmployees.filter(
          (payrollEmployee) => payrollEmployee.batchCodeId === currentBatch.id
        );

        const employees = payrollEmployees.filter((employee) =>
          employee.name.toLowerCase().includes(this.searchInput.toLowerCase())
        );

        return employees;
      }

      return [];
    },
    payrollEmployees() {
      return this.$store.getters['payrollEmployees/payrollEmployees'];
    },
    periodCovered() {
      if (this.createBatchPeriodCoverFrom && this.createBatchPeriodCoverTo) {
        return `${this.createBatchPeriodCoverFrom} to ${this.createBatchPeriodCoverTo}`;
      }
    },
    isCreateBatchInputsValid() {
      const currentDate = new Date();
      const timeDifference =
        new Date(this.createBatchPeriodCoverTo).getTime() -
        currentDate.getTime();

      return (
        this.createBatchPeriodCoverFrom &&
        this.createBatchPeriodCoverTo &&
        this.createBatchCode &&
        timeDifference > 0 &&
        !this.isBatchCodeAlreadyExist
      );
    },
    isEmployeeCurrentBatchCodeEmpty() {
      return this.currentBatchCode === '';
    },
    computedPayrollTotal() {
      return (this.payrollTotal =
        this.payrollSemiBasicSalaryInput +
        this.payrollSemiAllowanceSalaryInput +
        this.payrollServiceFeeInput +
        this.payrollOvertimePayInput +
        this.payrollOtherPayInput);
    },
    computedPayrollExternalTotal() {
      return (this.payrollExternalTotal =
        this.payrollTotalAmountOfTripsInput +
        this.payrollDropRateInput +
        this.payrollTollFeeInput +
        this.payrollPasswayInput +
        this.payrollOthersInput);
    },
    computedDeductionsTotal() {
      return (this.deductionTotal =
        this.payrollDeductionsCashAdvanceInput +
        this.payrollDeductionsPAGIBIGInput +
        this.payrollDeductionsSSSInput +
        this.payrollDeductionsPhilHealthInput +
        this.payrollDeductionsLateInput +
        this.payrollDeductionsDamagesInput +
        this.payrollDeductionsOtherPayInput);
    },
    computedDeductionsExternalTotal() {
      return (this.deductionExternalTotal =
        this.payrollDeductionsExternalCashAdvanceInput +
        this.payrollDeductionsMarineInsuranceFeeInput +
        this.payrollDeductionsUniformInput +
        this.payrollDeductionsPenaltiesInput);
    },
    isThereACurrentBatch() {
      return this.currentBatchCode === '';
    },
    isBatchCodeAlreadyExist() {
      1;
      const currentBatch =
        String(new Date().getFullYear()) + ' - ' + this.createBatchCode;
      const idx = this.batches.findIndex((batch) => {
        return batch.batchCode === currentBatch;
      });
      return idx >= 0 ? true : false;
    }
  },
  watch: {
    // currentBatchCode(newValue) {
    //   this.currentBatch = this.batches.find((batch) => batch.batchCode === newValue);
    //   console.log(this.currentBatch);
    // },
    payrollDaysOfWorkInput(newDaysOfWork) {
      this.payrollSemiBasicSalaryInput =
        this.payrollDailyRateInput * newDaysOfWork;
      this.payrollSemiAllowanceSalaryInput =
        this.payrollDailyAllowanceInput * newDaysOfWork;
    },
    payrollBasicSalaryInput() {
      this.payrollDailyRateInput = this.payrollBasicSalaryInput / 26;
    },
    payrollAllowanceSalaryInput() {
      this.payrollDailyAllowanceInput = this.payrollAllowanceSalaryInput / 26;
    },
    payrollDailyRateInput(newDailyRate) {
      this.payrollSemiBasicSalaryInput =
        this.payrollDaysOfWorkInput * newDailyRate;
    },
    payrollDailyAllowanceInput(newDailyAllowance) {
      this.payrollSemiAllowanceSalaryInput =
        this.payrollDaysOfWorkInput * newDailyAllowance;
    },
    payrollCurrentEmployee(currentEmployee) {
      if (currentEmployee.type.toLowerCase() === 'internal') {
        const {
          allowanceSalary,
          basicSalary,
          dailyAllowance,
          dailyRate,
          daysOfWork,
          others,
          overtimePay,
          semiAllowanceSalary,
          semiBasicSalary,
          total,
          serviceFee
        } = currentEmployee.salary;

        const { SSS, cashAdvance, damages, late, pagibig, philhealth } =
          currentEmployee.deduction;

        this.payrollBasicSalaryInput = basicSalary;
        this.payrollAllowanceSalaryInput = allowanceSalary;
        this.payrollDailyRateInput = dailyRate;
        this.payrollDailyAllowanceInput = dailyAllowance;
        this.payrollDaysOfWorkInput = daysOfWork;
        this.payrollSemiBasicSalaryInput = semiBasicSalary;
        this.payrollSemiAllowanceSalaryInput = semiAllowanceSalary;
        this.payrollServiceFeeInput = serviceFee;
        this.payrollOvertimePayInput = overtimePay;
        this.payrollOtherPayInput = others;
        this.payrollTotal = total;

        this.payrollDeductionsCashAdvanceInput = cashAdvance;
        this.payrollDeductionsPAGIBIGInput = pagibig;
        this.payrollDeductionsSSSInput = SSS;
        this.payrollDeductionsPhilHealthInput = philhealth;
        this.payrollDeductionsLateInput = late;
        this.payrollDeductionsDamagesInput = damages;
        this.payrollDeductionsOtherPayInput = currentEmployee.deduction.others;
        this.deductionTotal = currentEmployee.deduction.total;
      } else if (currentEmployee.type.toLowerCase() === 'external') {
        const {
          clientTripRates,
          dropRate,
          noOfTrips,
          others,
          passway,
          tollFee,
          total,
          totalAmountOfTrips
        } = currentEmployee.salary;
        const { cashAdvance, marineInsuranceFee, penalties, uniform } =
          currentEmployee.deduction;

        this.payrollNoOfTripsInput = noOfTrips;
        this.payrollClientTripRatesInput = clientTripRates;
        this.payrollTotalAmountOfTripsInput = totalAmountOfTrips;
        this.payrollDropRateInput = dropRate;
        this.payrollTollFeeInput = tollFee;
        this.payrollPasswayInput = passway;
        this.payrollOthersInput = others;
        this.payrollExternalTotal = total;

        this.payrollDeductionsExternalCashAdvanceInput = cashAdvance;
        this.payrollDeductionsMarineInsuranceFeeInput = marineInsuranceFee;
        this.payrollDeductionsUniformInput = uniform;
        this.payrollDeductionsPenaltiesInput = penalties;
        this.deductionExternalTotal = currentEmployee.deduction.total;
      }
    }
  }
};
</script>

<template>
  <div class="d-flex flex-column justify-content-between h-100">
    <header>
      <h1>Payroll</h1>
    </header>
    <hr />
    <main class="container flex-grow-1">
      <div
        class="d-flex justify-content-between mb-4 gap-4"
        style="max-height: 35px"
      >
        <div class="input-group mb-3 h-100 align-items-center gap-2">
          <label for="user-input">Search:</label>
          <input
            v-model="searchInput"
            type="text"
            class="form-control"
            placeholder="Employee's name"
            aria-label="Recipient's username"
            id="user-input"
            aria-describedby="basic-addon2"
            :disabled="isEmployeeCurrentBatchCodeEmpty"
          />
        </div>

        <div class="input-group mb-3 h-100 align-items-center gap-2">
          <label for="employeeCurrentBatchCode">Batch:</label>
          <select
            v-model="currentBatchCode"
            class="form-select"
            id="employeeCurrentBatchCode"
            aria-describedby="employeeCurrentBatchCode"
          >
            <option selected value="">Select Batch Code</option>
            <option v-for="(batchCode, index) in batchCodes" :value="batchCode">
              {{ batchCode }}
            </option>
          </select>
        </div>

        <button
          type="button"
          class="btn tms-btn text-light px-5"
          data-bs-toggle="modal"
          data-bs-target="#createBatchModal"
          @click="onClickCreateBatchHandler"
        >
          Create Batch
        </button>

        <button
          type="button"
          class="btn btn-success px-5"
          data-bs-toggle="modal"
          data-bs-target="#registerEmployeeToPayrollModal"
          :disabled="isEmployeeCurrentBatchCodeEmpty"
        >
          Register
        </button>

        <!-- <button
          type="button"
          class="btn btn-danger text-light px-5"
          data-bs-toggle="modal"
          data-bs-target="#deleteBatchVerif"
          :disabled="isThereACurrentBatch"
        >
          Delete Batch
        </button> -->
      </div>

      <table class="table">
        <thead class="tbl-header text-light rounded">
          <tr>
            <th class="align-middle" scope="col">Name</th>
            <th class="align-middle" scope="col">Type</th>
            <th class="align-middle" scope="col">Role</th>
            <th class="align-middle" scope="col">Net Pay</th>
            <th class="align-middle" scope="col">Actions</th>
          </tr>
        </thead>
        <tbody class="table-group-divider" v-if="currentBatchCode.length > 0">
          <tr v-for="employee in filteredEmployees" :key="employee.id">
            <th class="align-middle" scope="row">{{ employee.name }}</th>
            <td class="align-middle">{{ employee.type }}</td>
            <td class="align-middle">{{ employee.role }}</td>
            <td class="align-middle">
              <button
                v-if="isEmployeeInternal(employee)"
                type="button"
                data-bs-toggle="modal"
                data-bs-target="#payrollInternalBreakdownModal"
                class="btn tms-btn text-light align-items-center h-100"
                @click="setPayrollCurrentEmployee(employee)"
              >
                {{ getNetPay(employee) }}
              </button>

              <button
                v-else
                type="button"
                data-bs-toggle="modal"
                data-bs-target="#payrollExternalBreakdownModal"
                class="btn tms-btn text-light align-items-center h-100"
                @click="setPayrollCurrentEmployee(employee)"
              >
                {{ getNetPay(employee) }}
              </button>
            </td>
            <td class="align-middle d-flex">
              <button
                v-if="employee.type === 'Internal'"
                type="button"
                data-bs-toggle="modal"
                data-bs-target="#payrollInternalSalaryModal"
                class="btn tms-btn text-light justify-content-center align-items-center h-100 mx-2"
                @click="setPayrollCurrentEmployee(employee)"
              >
                Edit Salary
              </button>

              <button
                v-if="employee.type === 'Internal'"
                type="button"
                data-bs-toggle="modal"
                data-bs-target="#payrollInternalDeductionsModal"
                class="btn tms-btn text-light justify-content-center align-items-center h-100"
                @click="setPayrollCurrentEmployee(employee)"
              >
                Edit Deductions
              </button>

              <button
                v-if="employee.type === 'External'"
                type="button"
                data-bs-toggle="modal"
                data-bs-target="#payrollExternalSalaryModal"
                class="btn tms-btn text-light justify-content-center align-items-center h-100 mx-2"
                @click="setPayrollCurrentEmployee(employee)"
              >
                Edit Salary
              </button>

              <button
                v-if="employee.type === 'External'"
                type="button"
                data-bs-toggle="modal"
                data-bs-target="#payrollExternalDeductionsModal"
                class="btn tms-btn text-light justify-content-center align-items-center h-100"
                @click="setPayrollCurrentEmployee(employee)"
              >
                Edit Deductions
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </main>
  </div>

  <Modal id="createBatchModal">
    <template v-slot:modal-header>
      <div class="modal-header justify-content-center border-bottom-0">
        <h1 class="modal-title fs-5" id="createBatchModalLabel">
          Create Payroll Batch
        </h1>
      </div>
    </template>
    <template v-slot:modal-body>
      <div class="modal-body">
        <form id="createBatchForm" @submit.prevent="submitCreateBatchHandler">
          <div class="mb-3">
            <label class="form-label d-block text-start"
              >Period cover:
              <span class="fw-bold text-primary text-lowercase">{{
                periodCovered
              }}</span></label
            >
            <div class="container">
              <div class="row">
                <div class="col-6">
                  <input
                    v-model="createBatchPeriodCoverFrom"
                    type="date"
                    class="form-control"
                    disabled
                  />
                </div>
                <div class="col-6">
                  <input
                    v-model="createBatchPeriodCoverTo"
                    type="date"
                    class="form-control"
                  />
                </div>
              </div>
            </div>
          </div>

          <div class="mb-3">
            <label for="payrolLBatchInput" class="form-label d-block text-start"
              >Batch</label
            >
            <div class="d-flex align-items-center gap-1">
              <span>2023-</span>
              <input
                v-model="createBatchCode"
                type="number"
                class="form-control"
                placeholder="Batch"
              />
            </div>
            <p class="fw-bold text-danger" v-if="isBatchCodeAlreadyExist">
              The provided batch code is already exist!
            </p>
          </div>

          <div class="mb-3">
            <label for="employeeSelect" class="form-label d-block text-start">
              Employees</label
            >
          </div>
          <select
            v-model="selectedEmployee"
            class="form-select"
            id="employeeSelect"
          >
            <option selected :value="null">Select Employee</option>
            <option
              v-for="employee in employees"
              :key="employee.id"
              :value="employee"
            >
              {{ employee.name }} - {{ employee.role }}
            </option>
          </select>
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
          form="createBatchForm"
          class="btn text-light"
          data-bs-dismiss="modal"
          :disabled="!isCreateBatchInputsValid"
          @click="employeeSelectBatchCodeInput = createBatchCode"
        >
          Create Batch
        </button>
      </div>
    </template>
  </Modal>

  <Modal id="registerEmployeeToPayrollModal">
    <template v-slot:modal-header>
      <div class="modal-header justify-content-center border-bottom-0">
        <h1 class="modal-title fs-5" id="registerEmployeeToPayrollModalLabel">
          Register Employee to Payroll
        </h1>
      </div>
    </template>
    <template v-slot:modal-body>
      <div class="modal-body">
        <form
          id="registerEmployeeForm"
          @submit.prevent="onSubmitRegisterEmployee"
        >
          <div class="mb-3">
            <label for="employeeSelect" class="form-label d-block text-start">
              Employees</label
            >
          </div>
          <select
            v-model="selectedEmployee"
            class="form-select"
            id="employeeSelect"
          >
            <option selected :value="null">Select Employee</option>
            <option
              v-for="employee in availableEmployees"
              :key="employee.id"
              :value="employee"
            >
              {{ employee.name }} - {{ employee.role }}
            </option>
          </select>
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
          form="registerEmployeeForm"
          class="btn text-light"
          data-bs-dismiss="modal"
          :disabled="!selectedEmployee"
          @click="employeeSelectBatchCodeInput = createBatchCode"
        >
          Register
        </button>
      </div>
    </template>
  </Modal>

  <Modal id="payrollInternalSalaryModal">
    <template v-slot:modal-header>
      <div class="modal-header justify-content-center border-bottom-0">
        <h1 class="modal-title fs-5" id="payrollInternalSalaryModalLabel">
          Payroll - Salary
        </h1>
      </div>
    </template>
    <template v-slot:modal-body>
      <div class="modal-body">
        <form id="payrollInternalSalaryForm">
          <div v-if="isEmployeeRoleIsAdmin" class="mb-3">
            <label
              for="payrollBasicSalary"
              class="form-label d-block text-start"
              >Basic</label
            >
            <input
              v-model="payrollBasicSalaryInput"
              type="number"
              class="form-control"
              id="payrollBasicSalary"
              aria-describedby="payrollBasicSalary"
              placeholder="Basic"
            />
          </div>
          <div v-if="isEmployeeRoleIsAdmin" class="mb-3">
            <label
              for="payrollAllowanceSalary"
              class="form-label d-block text-start"
              >Allowance</label
            >
            <input
              v-model="payrollAllowanceSalaryInput"
              type="number"
              class="form-control"
              id="payrollAllowanceSalary"
              aria-describedby="payrollAllowanceSalary"
              placeholder="Allowance"
            />
          </div>
          <div class="mb-3" v-if="!isEmployeeRoleIsAdmin">
            <label for="payrollDailyRate" class="form-label d-block text-start"
              >Daily Rate</label
            >
            <input
              v-model="payrollDailyRateInput"
              type="number"
              class="form-control"
              id="payrollDailyRate"
              aria-describedby="payrollDailyRate"
              placeholder="Daily Rate"
              :disabled="isEmployeeRoleIsAdmin"
            />
          </div>
          <div class="mb-3" v-if="!isEmployeeRoleIsAdmin">
            <label
              for="payrollDailyAllowance"
              class="form-label d-block text-start"
              >Daily Allowance</label
            >
            <input
              v-model="payrollDailyAllowanceInput"
              type="number"
              class="form-control"
              id="payrollDailyAllowance"
              aria-describedby="payrollDailyAllowance"
              placeholder="Daily Allowance"
              :disabled="isEmployeeRoleIsAdmin"
            />
          </div>
          <div class="mb-3">
            <label for="payrollDaysOfWork" class="form-label d-block text-start"
              >Days of Work</label
            >
            <input
              v-model="payrollDaysOfWorkInput"
              type="number"
              class="form-control"
              id="payrollDaysOfWork"
              aria-describedby="payrollDaysOfWork"
              placeholder="Days of Work"
            />
          </div>

          <!-- SEMI BASIC SALARY -->
          <!-- <div class="mb-3">
            <label
              for="payrollSemiBasicSalary"
              class="form-label d-block text-start"
              >Semi - Basic Salary</label
            >
            <input
              v-model="payrollSemiBasicSalaryInput"
              type="number"
              class="form-control"
              id="payrollSemiBasicSalary"
              aria-describedby="payrollSemiBasicSalary"
              placeholder="Semi - Basic Salary"
              disabled
            />
          </div> -->

          <!-- SEMI ALLOWANCE SALARY -->
          <!-- <div class="mb-3">
            <label
              for="payrollSemiAllowanceSalary"
              class="form-label d-block text-start"
              >Semi - Allowance Salary</label
            >
            <input
              v-model="payrollSemiAllowanceSalaryInput"
              type="number"
              class="form-control"
              id="payrollSemiAllowanceSalary"
              aria-describedby="payrollSemiAllowanceSalary"
              placeholder="Semi - Allowance Salary"
              disabled
            />
          </div> -->

          <div class="mb-3">
            <label for="payrollServiceFee" class="form-label d-block text-start"
              >Service Fee</label
            >
            <input
              v-model="payrollServiceFeeInput"
              type="number"
              class="form-control"
              id="payrollServiceFee"
              aria-describedby="payrollServiceFee"
              placeholder="Service Fee"
            />
          </div>
          <div class="mb-3">
            <label
              for="payrollOvertimePay"
              class="form-label d-block text-start"
              >Overtime Pay</label
            >
            <input
              v-model="payrollOvertimePayInput"
              type="number"
              class="form-control"
              id="payrollOvertimePay"
              aria-describedby="payrollOvertimePay"
              placeholder="Overtime Pay"
            />
          </div>
          <div class="mb-3">
            <label for="payrollExtraPay" class="form-label d-block text-start"
              >Others
            </label>
            <input
              v-model="payrollOtherPayInput"
              type="number"
              class="form-control"
              id="payrollOtherPay"
              aria-describedby="payrollOtherPay"
              placeholder="Others"
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
          type="button"
          class="btn tms-btn text-light"
          data-bs-dismiss="modal"
          @click="onSubmitSalaryForm"
        >
          Edit Salary
        </button>
      </div>
    </template>
  </Modal>

  <Modal id="payrollInternalDeductionsModal">
    <template v-slot:modal-header>
      <div class="modal-header justify-content-center border-bottom-0">
        <h1 class="modal-title fs-5" id="payrollInternalDeductionsModalLabel">
          Payroll - Deductions
        </h1>
      </div>
    </template>
    <template v-slot:modal-body>
      <div class="modal-body">
        <form id="payrollInternalDeductionsForm">
          <div class="mb-3">
            <label
              for="payrollDeductionsCashAdvance"
              class="form-label d-block text-start"
              >Cash Advance</label
            >
            <input
              v-model="payrollDeductionsCashAdvanceInput"
              type="number"
              class="form-control"
              id="payrollDeductionsCashAdvance"
              aria-describedby="payrollDeductionsCashAdvance"
              placeholder="Cash Advance"
            />
          </div>

          <div class="mb-3">
            <label
              for="payrollDeductionsPAGIBIG"
              class="form-label d-block text-start"
              >PAG-IBIG Contribution</label
            >
            <input
              v-model="payrollDeductionsPAGIBIGInput"
              type="number"
              class="form-control"
              id="payrollDeductionsPAGIBIG"
              aria-describedby="payrollDeductionsPAGIBIG"
              placeholder="PAG-IBIG Contribution"
            />
          </div>

          <div class="mb-3">
            <label
              for="payrollDeductionsSSS"
              class="form-label d-block text-start"
              >SSS Contribution</label
            >
            <input
              v-model="payrollDeductionsSSSInput"
              type="number"
              class="form-control"
              id="payrollDeductionsSSS"
              aria-describedby="payrollDeductionsSSS"
              placeholder="SSS Contribution"
            />
          </div>

          <div class="mb-3">
            <label
              for="payrollDeductionsPhilHealth"
              class="form-label d-block text-start"
              >PhilHealth Contribution</label
            >
            <input
              v-model="payrollDeductionsPhilHealthInput"
              type="number"
              class="form-control"
              id="payrollDeductionsPhilHealth"
              aria-describedby="payrollDeductionsPhilHealth"
              placeholder="PhilHealth Contribution"
            />
          </div>

          <div class="mb-3">
            <label
              for="payrollDeductionsLate"
              class="form-label d-block text-start"
              >Late</label
            >
            <input
              v-model="payrollDeductionsLateInput"
              type="number"
              class="form-control"
              id="payrollDeductionsLate"
              aria-describedby="payrollDeductionsLate"
              placeholder="Late"
            />
          </div>
          <div class="mb-3">
            <label
              for="payrollDeductionsDamages"
              class="form-label d-block text-start"
              >Damages</label
            >
            <input
              v-model="payrollDeductionsDamagesInput"
              type="number"
              class="form-control"
              id="payrollDeductionsDamages"
              aria-describedby="payrollDeductionsDamages"
              placeholder="Damages"
            />
          </div>

          <div class="mb-3">
            <label
              for="payrollDeductionsOtherPay"
              class="form-label d-block text-start"
              >Others</label
            >
            <input
              v-model="payrollDeductionsOtherPayInput"
              type="number"
              class="form-control"
              id="payrollDeductionsOtherPay"
              aria-describedby="payrollDeductionsOtherPay"
              placeholder="Others"
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
          data-bs-dismiss="modal"
          @click="onSubmitDeductionForm"
        >
          Add Deductions
        </button>
      </div>
    </template>
  </Modal>

  <Modal id="payrollExternalSalaryModal">
    <template v-slot:modal-header>
      <div class="modal-header justify-content-center border-bottom-0">
        <h1 class="modal-title fs-5" id="payrollExternalSalaryModalLabel">
          Payroll - Salary
        </h1>
      </div>
    </template>
    <template v-slot:modal-body>
      <div class="modal-body">
        <form id="payrollExternalSalaryForm">
          <div class="mb-3">
            <label for="payrollNoOfTrips" class="form-label d-block text-start"
              >No. Of Trips</label
            >
            <input
              v-model="payrollNoOfTripsInput"
              type="number"
              class="form-control"
              id="payrollNoOfTrips"
              aria-describedby="payrollNoOfTrips"
              placeholder="No. Of Trips"
            />
          </div>
          <div class="mb-3">
            <label
              for="payrollClientTripRates"
              class="form-label d-block text-start"
              >Client Trip Rate</label
            >
            <input
              v-model="payrollClientTripRatesInput"
              type="number"
              class="form-control"
              id="payrollClientTripRates"
              aria-describedby="payrollClientTripRates"
              placeholder="Client Trip Rate"
            />
          </div>
          <div class="mb-3">
            <label
              for="payrollTotalAmountOfTrips"
              class="form-label d-block text-start"
              >Total Amount of Trips</label
            >
            <input
              v-model="payrollTotalAmountOfTripsInput"
              type="number"
              class="form-control"
              id="payrollTotalAmountOfTrips"
              aria-describedby="payrollTotalAmountOfTrips"
              placeholder="Total Amount of Trips"
            />
          </div>
          <!-- EXPENSES -->
          <div class="mb-3">
            <label for="payrollDropRate" class="form-label d-block text-start"
              >Drop Rate</label
            >
            <input
              v-model="payrollDropRateInput"
              type="number"
              class="form-control"
              id="payrollDropRate"
              aria-describedby="payrollDropRate"
              placeholder="Drop Rate"
            />
          </div>
          <div class="mb-3">
            <label for="payrollTollFee" class="form-label d-block text-start"
              >Toll Fee</label
            >
            <input
              v-model="payrollTollFeeInput"
              type="number"
              class="form-control"
              id="payrollTollFee"
              aria-describedby="payrollTollFee"
              placeholder="Toll Fee"
            />
          </div>
          <div class="mb-3">
            <label for="payrollPassway" class="form-label d-block text-start"
              >Passway</label
            >
            <input
              v-model="payrollPasswayInput"
              type="number"
              class="form-control"
              id="payrollPassway"
              aria-describedby="payrollPassway"
              placeholder="Passway"
            />
          </div>
          <div class="mb-3">
            <label for="payrollOthers" class="form-label d-block text-start"
              >Others</label
            >
            <input
              v-model="payrollOthersInput"
              type="number"
              class="form-control"
              id="payrollOthers"
              aria-describedby="payrollOthers"
              placeholder="Others"
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
          type="button"
          class="btn tms-btn text-light"
          data-bs-dismiss="modal"
          @click="onSubmitExternalSalaryForm"
        >
          Add Salary
        </button>
      </div>
    </template>
  </Modal>

  <Modal id="payrollExternalDeductionsModal">
    <template v-slot:modal-header>
      <div class="modal-header justify-content-center border-bottom-0">
        <h1 class="modal-title fs-5" id="payrollExternalDeductionsModalLabel">
          Payroll - Deductions
        </h1>
      </div>
    </template>
    <template v-slot:modal-body>
      <div class="modal-body">
        <form id="payrollExternalDeductionsForm">
          <div class="mb-3">
            <label
              for="payrollDeductionsCashAdvance"
              class="form-label d-block text-start"
              >Cash Advance</label
            >
            <input
              v-model="payrollDeductionsExternalCashAdvanceInput"
              type="number"
              class="form-control"
              id="payrollDeductionsCashAdvance"
              aria-describedby="payrollDeductionsCashAdvance"
              placeholder="Cash Advance"
            />
          </div>
          <div class="mb-3">
            <label
              for="payrollDeductionsMarineInsuranceFee"
              class="form-label d-block text-start"
              >Marine Insurance Fee</label
            >
            <input
              v-model="payrollDeductionsMarineInsuranceFeeInput"
              type="number"
              class="form-control"
              id="payrollDeductionsMarineInsuranceFee"
              aria-describedby="payrollDeductionsMarineInsuranceFee"
              placeholder="Marine Insurance Fee"
            />
          </div>
          <div class="mb-3">
            <label
              for="payrollDeductionsUniform"
              class="form-label d-block text-start"
              >Uniform</label
            >
            <input
              v-model="payrollDeductionsUniformInput"
              type="number"
              class="form-control"
              id="payrollDeductionsUniform"
              aria-describedby="payrollDeductionsUniform"
              placeholder="Uniform"
            />
          </div>
          <div class="mb-3">
            <label
              for="payrollDeductionsPenalties"
              class="form-label d-block text-start"
              >Penalties</label
            >
            <input
              v-model="payrollDeductionsPenaltiesInput"
              type="number"
              class="form-control"
              id="payrollDeductionsPenalties"
              aria-describedby="payrollDeductionsPenalties"
              placeholder="Penalties"
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
          type="button"
          class="btn tms-btn text-light"
          data-bs-dismiss="modal"
          @click="onSubmitExternalDeductionForm"
        >
          Add Deductions
        </button>
      </div>
    </template>
  </Modal>

  <Modal id="payrollInternalBreakdownModal" :isForPayrollBreakdown="true">
    <template v-slot:modal-header>
      <div class="modal-header justify-content-center border-bottom-0">
        <h1 class="modal-title fs-5" id="editEmployeeLabel">
          Payroll Breakdown
        </h1>
      </div>
    </template>
    <template v-slot:modal-body>
      <div class="d-flex justify-content-around" v-if="payrollCurrentEmployee">
        <p>
          <span class="fw-bold text-success">Employee's name: </span>
          {{ payrollCurrentEmployee.name }} - {{ payrollCurrentEmployee.role }}
        </p>
        <p>
          <span class="fw-bold text-success">Date Hired: </span>
          {{ payrollCurrentEmployee.date_hired }}
        </p>
      </div>
      <div class="modal-body d-flex justify-content-around">
        <div
          v-if="
            payrollCurrentEmployee &&
            payrollCurrentEmployee.salary &&
            isEmployeeInternal(payrollCurrentEmployee)
          "
          class="salary-breakdown d-flex flex-column align-items-start"
        >
          <h2>Salary</h2>
          <p v-if="isEmployeeRoleIsAdmin">
            <span class="fw-bold text-primary">Basic Salary: </span>
            {{ payrollCurrentEmployee.salary.basicSalary.toFixed(2) }}
          </p>
          <p v-if="isEmployeeRoleIsAdmin">
            <span class="fw-bold text-primary">Allowance: </span>
            {{ payrollCurrentEmployee.salary.allowanceSalary.toFixed(2) }}
          </p>
          <p>
            <span class="fw-bold text-primary">Daily Rate: </span>
            {{ payrollCurrentEmployee.salary.dailyRate.toFixed(2) }}
          </p>
          <p>
            <span class="fw-bold text-primary">Daily Allowance: </span>
            {{ payrollCurrentEmployee.salary.dailyAllowance.toFixed(2) }}
          </p>
          <p>
            <span class="fw-bold text-primary">No. Of Days: </span>
            {{ payrollCurrentEmployee.salary.daysOfWork.toFixed(2) }}
          </p>
          <p>
            <span class="fw-bold text-warning">Semi Basic Salary: </span>
            {{ payrollCurrentEmployee.salary.semiBasicSalary.toFixed(2) }}
          </p>
          <p>
            <span class="fw-bold text-warning">Semi Allowance Salary: </span>
            {{ payrollCurrentEmployee.salary.semiAllowanceSalary.toFixed(2) }}
          </p>
          <p>
            <span class="fw-bold text-warning">Overtime Pay: </span>
            {{ payrollCurrentEmployee.salary.overtimePay.toFixed(2) }}
          </p>
          <p>
            <span class="fw-bold text-warning">Others: </span>
            {{ payrollCurrentEmployee.salary.others.toFixed(2) }}
          </p>
          <p>
            <span class="fw-bold text-info">Total Salary: </span>
            {{ payrollCurrentEmployee.salary.total }}
          </p>
        </div>
        <div
          v-if="
            payrollCurrentEmployee &&
            payrollCurrentEmployee.deduction &&
            isEmployeeInternal(payrollCurrentEmployee)
          "
          class="deduction-breakdown d-flex flex-column align-items-start"
        >
          <h2>Deductions</h2>
          <p>
            <span class="fw-bold text-secondary">Cash Advance: </span>
            {{ payrollCurrentEmployee.deduction.cashAdvance.toFixed(2) }}
          </p>
          <p>
            <span class="fw-bold text-secondary">PAGIBIG: </span>
            {{ payrollCurrentEmployee.deduction.pagibig.toFixed(2) }}
          </p>
          <p>
            <span class="fw-bold text-secondary">SSS: </span>
            {{ payrollCurrentEmployee.deduction.SSS.toFixed(2) }}
          </p>
          <p>
            <span class="fw-bold text-secondary">Philhealth: </span>
            {{ payrollCurrentEmployee.deduction.philhealth.toFixed(2) }}
          </p>
          <p>
            <span class="fw-bold text-secondary">Late: </span>
            {{ payrollCurrentEmployee.deduction.late.toFixed(2) }}
          </p>
          <p>
            <span class="fw-bold text-secondary">Damages: </span>
            {{ payrollCurrentEmployee.deduction.damages.toFixed(2) }}
          </p>
          <p>
            <span class="fw-bold text-secondary">Others: </span>
            {{ payrollCurrentEmployee.deduction.others.toFixed(2) }}
          </p>
          <p>
            <span class="fw-bold text-danger">Total Deductions: </span>
            {{ payrollCurrentEmployee.deduction.total.toFixed(2) }}
          </p>
        </div>
      </div>
      <div>
        <p class="fw-bold h4">
          <span class="text-success">Net pay:</span>
          {{ getNetPay(payrollCurrentEmployee) }}
        </p>
      </div>
    </template>
    <template v-slot:modal-footer>
      <div class="modal-footer justify-content-center border-top-0">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
          Close
        </button>
      </div>
    </template>
  </Modal>

  <Modal id="payrollExternalBreakdownModal" :isForPayrollBreakdown="true">
    <template v-slot:modal-header>
      <div class="modal-header justify-content-center border-bottom-0">
        <h1 class="modal-title fs-5" id="editEmployeeLabel">
          Payroll Breakdown
        </h1>
      </div>
    </template>
    <template v-slot:modal-body>
      <div class="d-flex justify-content-around" v-if="payrollCurrentEmployee">
        <div>
          <p class="text-start">
            <span class="fw-bold text-success">Employee's name: </span>
            {{ payrollCurrentEmployee.name }} -
            {{ payrollCurrentEmployee.role }}
          </p>
          <p class="text-start">
            <span class="fw-bold text-success">Driver's name</span>
            {{ payrollCurrentEmployee.driver_name }}
          </p>
        </div>
        <div>
          <p class="text-start">
            <span class="fw-bold text-success">Date Hired: </span>
            {{ payrollCurrentEmployee.date_hired }}
          </p>
          <p class="text-start">
            <span class="fw-bold text-success">Plate Number: </span>
            {{ payrollCurrentEmployee.plate_number }}
          </p>
        </div>
      </div>
      <div class="modal-body d-flex justify-content-around">
        <div
          v-if="
            payrollCurrentEmployee &&
            !isEmployeeInternal(payrollCurrentEmployee)
          "
          class="salary-breakdown d-flex flex-column align-items-start"
        >
          <h2>Salary</h2>
          <p>
            <span class="fw-bold text-primary">No of Trips: </span>
            {{ payrollCurrentEmployee.salary.noOfTrips.toFixed(2) }}
          </p>
          <p>
            <span class="fw-bold text-primary">Client Trip Rate: </span>
            {{ payrollCurrentEmployee.salary.clientTripRates.toFixed(2) }}
          </p>
          <p>
            <span class="fw-bold text-primary">Total Amount of Trips: </span>
            {{ payrollCurrentEmployee.salary.totalAmountOfTrips.toFixed(2) }}
          </p>
          <p>
            <span class="fw-bold text-warning">Drop Rate: </span>
            {{ payrollCurrentEmployee.salary.dropRate.toFixed(2) }}
          </p>
          <p>
            <span class="fw-bold text-warning">Toll Fee: </span>
            {{ payrollCurrentEmployee.salary.tollFee.toFixed(2) }}
          </p>
          <p>
            <span class="fw-bold text-warning">Passway: </span>
            {{ payrollCurrentEmployee.salary.passway.toFixed(2) }}
          </p>
          <p>
            <span class="fw-bold text-warning">Others: </span>
            {{ payrollCurrentEmployee.salary.others.toFixed(2) }}
          </p>
          <p>
            <span class="fw-bold text-info">Total Salary: </span>
            {{ payrollCurrentEmployee.salary.total.toFixed(2) }}
          </p>
        </div>
        <div
          v-if="
            payrollCurrentEmployee &&
            !isEmployeeInternal(payrollCurrentEmployee)
          "
          class="deduction-breakdown d-flex flex-column align-items-start"
        >
          <h2>Deductions</h2>
          <p>
            <span class="fw-bold text-secondary">Cash Advance: </span>
            {{ payrollCurrentEmployee.deduction.cashAdvance.toFixed(2) }}
          </p>
          <p>
            <span class="fw-bold text-secondary">Marine Insurance Fee: </span>
            {{ payrollCurrentEmployee.deduction.marineInsuranceFee.toFixed(2) }}
          </p>
          <p>
            <span class="fw-bold text-secondary">Uniform: </span>
            {{ payrollCurrentEmployee.deduction.uniform.toFixed(2) }}
          </p>
          <p>
            <span class="fw-bold text-secondary">Penalties: </span>
            {{ payrollCurrentEmployee.deduction.penalties.toFixed(2) }}
          </p>
          <p>
            <span class="fw-bold text-danger">Total Deductions: </span>
            {{ payrollCurrentEmployee.deduction.total.toFixed(2) }}
          </p>
        </div>
      </div>
      <div>
        <p class="fw-bold h4">
          <span class="text-success">Net pay:</span>
          {{ getNetPay(payrollCurrentEmployee) }}
        </p>
      </div>
    </template>
    <template v-slot:modal-footer>
      <div class="modal-footer justify-content-center border-top-0">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
          Close
        </button>
      </div>
    </template>
  </Modal>

  <Modal id="deleteBatchVerif">
    <template v-slot:modal-header>
      <div class="modal-header justify-content-center border-bottom-0">
        <h1 class="modal-title fs-5" id="deleteBatchVerifLabel">
          Delete Batch
        </h1>
      </div>
    </template>
    <template v-slot:modal-body>
      <div class="modal-body">
        <p>Are you sure you want to delete the selected batch?</p>
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
        >
          Delete
        </button>
      </div>
    </template>
  </Modal>
</template>

<style scoped>
.input-group {
  width: 45%;
}

th {
  width: 14%;
}

.modal-body label {
  text-transform: uppercase;
  font-weight: bold;
  color: #86b9b0;
}

.modal-footer button {
  background-color: #4c7273;
}

.nav .nav-link {
  background-color: #041421;
}
</style>
