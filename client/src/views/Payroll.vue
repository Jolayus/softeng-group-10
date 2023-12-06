<script>
import SearchIcon from '../components/Icons/SearchIcon.vue';
import FloatingActionButton from '../components/FloatingActionButton.vue';
import Modal from '../components/Modal.vue';

class Batch {
  constructor(batchCode, batchPeriodCoverFrom, batchPeriodCoverTo, employeeId) {
    this.batchCode = batchCode;
    this.batchPeriodCoverFrom = batchPeriodCoverFrom;
    this.batchPeriodCoverTo = batchPeriodCoverTo;
    this.employeeId = employeeId;
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

      currentBatchCode: '',

      //Create payroll batch
      createBatchPeriodCoverFrom: '',
      createBatchPeriodCoverTo: '',
      createBatchCode: '',
      selectedEmployees: [],

      //payrollInternalSalaryModal
      payrollBasicSalaryInput: '',
      payrollAllowanceSalaryInput: '',
      payrollDailyRateInput: '',
      payrollDailyAllowanceInput: '',
      payrollDaysOfWorkInput: '',
      payrollSemiBasicSalaryInput: '',
      payrollSemiAllowanceSalaryInput: '',
      payrollServiceFeeInput: '',
      payrollOvertimePayInput: '',
      payrollExtraPayInput: '',

      //payrollInternalDeductionsModal
      payrollDeductionsCashAdvanceInput: '',
      payrollDeductionsPAGIBIGInput: '',
      payrollDeductionsSSSInput: '',
      payrollDeductionsPhilHealthInput: '',
      payrollDeductionsLateInput: '',
      payrollDeductionsDamagesInput: '',

      //payrollExternalSalaryModal
      payrollNoOfTripsInput: '',
      payrollClientTripRatesInput: '',
      payrollTotalAmountOfTripsInput: '',
      payrollDropRateInput: '',
      payrollTollFeeInput: '',
      payrollPasswayInput: '',
      payrollOthersInput: '',

      //payrollExternalDeductionsModal
      payrollDeductionsCashAdvanceInput: '',
      payrollDeductionsMarineInsuranceFeeInput: '',
      payrollDeductionsUniformInput: '',
      payrollDeductionsPenaltiesInput: '',

      totalPayroll: 'P123.00'
    };
  },
  methods: {
    submitCreateBatchHandler() {
      this.selectedEmployees.forEach((employeeId) => {
        const newBatch = new Batch(
          this.createBatchCode,
          this.createBatchPeriodCoverFrom,
          this.createBatchPeriodCoverTo,
          employeeId
        );
        this.storeCreateBatch(newBatch);

        if (!this.isThereBatchCodeExists) {
          this.currentBatchCode = newBatch.batchCode;
        }
      });
    },
    storeCreateBatch(newBatch) {
      this.$store.dispatch('batches/addBatch', newBatch);
    },
    tabChangeHandler(batchCode) {
      this.currentBatchCode = batchCode;
    }
  },
  computed: {
    employees() {
      return this.$store.getters['employees/employees'];
    },
    batches() {
      return this.$store.getters['batches/batches'];
    },
    batchCodes() {
      return this.$store.getters['batches/batchCodes'];
    },
    employeeIdsByCurrentBatchCode() {
      return this.batches.map((batch) => {
        if (batch.batchCode === this.currentBatchCode) {
          return batch.employeeId;
        }
      });
    },
    currentEmployeesByBatchCode() {
      return this.employees.filter((employee) =>
        this.employeeIdsByCurrentBatchCode.includes(employee.id)
      );
    },
    isThereBatchCodeExists() {
      return this.batchCodes.length;
    },
    filteredEmployees() {
      return this.currentEmployeesByBatchCode.filter((employee) =>
        employee.name.toLowerCase().includes(this.searchInput.toLowerCase())
      );
    },
    periodCovered() {
      if (this.createBatchPeriodCoverFrom && this.createBatchPeriodCoverTo) {
        return `${this.createBatchPeriodCoverFrom} to ${this.createBatchPeriodCoverTo}`;
      }
    },
    isCreateBatchInputsValid() {
      return (
        this.createBatchPeriodCoverFrom &&
        this.createBatchPeriodCoverTo &&
        this.createBatchCode &&
        this.selectedEmployees.length
      );
    },
    isEmployeeSelectBatchCodeEmpty() {
      return this.employeeSelectBatchCodeInput === '';
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
    <!-- <ul class="nav nav-pills gap-2 mb-5" id="pills-tab" role="tablist">
      <li
        v-for="(batchCode, index) in batchCodes"
        class="nav-item"
        role="presentation"
      >
        <button
          class="nav-link text-light px-5"
          :class="{ active: index === 0 }"
          :aria-selected="index === 0 ? true : false"
          data-bs-toggle="pill"
          type="button"
          role="tab"
          :aria-controls="batchCode"
          @click="tabChangeHandler(batchCode)"
        >
          {{ batchCode }}
        </button>
      </li>
    </ul> -->
    <main class="container flex-grow-1">
      <div class="d-flex justify-content-between mb-4 gap-4" style="max-height: 35px">
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
            :disabled="!isEmployeeSelectBatchCodeEmpty"
          />
        </div>

        <div class="input-group mb-3 h-100 align-items-center gap-2">
          <label for="user-input">Batch:</label>
          <select
            v-model="employeeSelectBatchCodeInput"
            class="form-select"
            id="employeeSelectBatchCode"
            aria-describedby="employeeSelectBatchCode"
          >
            <option selected value="">Select Batch Code</option>
            <option v-for="(batchCode, index) in batchCodes" :value="batchCode">{{ batchCode }}</option> 
          </select>
        </div>

        <button
          type="button"
          class="btn tms-btn text-light px-5"
          data-bs-toggle="modal"
          data-bs-target="#createBatchModal"
        >
          Create Batch
        </button>
      </div>

      <div class="tab-content" id="pills-tabContent">
        <div
          class="tab-pane fade"
          v-for="(batchCode, index) in batchCodes"
          :class="{ active: index === 0, show: index === 0 }"
          :id="batchCode"
          role="tabpanel"
          :aria-labelledby="batchCode + '-tab'"
          tabindex="0"
        >
          <table class="table">
            <thead class="tbl-header text-light rounded">
              <tr>
                <th class="align-middle" scope="col">Name</th>
                <th class="align-middle" scope="col">Role</th>
                <th class="align-middle" scope="col">Total</th>
                <th class="align-middle" scope="col">Actions</th>
              </tr>
            </thead>
            <tbody class="table-group-divider">
              <tr v-for="employee in filteredEmployees" :key="employee.id">
                <th class="align-middle" scope="row">{{ employee.name }}</th>
                <td class="align-middle">{{ employee.role }}</td>
                <td class="align-middle">
                  <button
                    type="button"
                    data-bs-toggle="modal"
                    data-bs-target="#payrollBreakdownModal"
                    class="btn tms-btn text-light align-items-center h-100"
                  >
                    {{ totalPayroll }}
                  </button>
                </td>
                <td class="align-middle d-flex">
                  <button
                    v-if="employee.type === 'Internal'"
                    type="button"
                    data-bs-toggle="modal"
                    data-bs-target="#payrollInternalSalaryModal"
                    class="btn tms-btn text-light justify-content-center align-items-center h-100 mx-2"
                  >
                    Add Salary
                  </button>

                  <button
                    v-if="employee.type === 'Internal'"
                    type="button"
                    data-bs-toggle="modal"
                    data-bs-target="#payrollInternalDeductionsModal"
                    class="btn tms-btn text-light justify-content-center align-items-center h-100"
                  >
                    Add Deductions
                  </button>

                  <button
                    v-if="employee.type === 'External'"
                    type="button"
                    data-bs-toggle="modal"
                    data-bs-target="#payrollExternalSalaryModal"
                    class="btn tms-btn text-light justify-content-center align-items-center h-100 mx-2"
                  >
                    Add Salary
                  </button>

                  <button
                    v-if="employee.type === 'External'"
                    type="button"
                    data-bs-toggle="modal"
                    data-bs-target="#payrollExternalDeductionsModal"
                    class="btn tms-btn text-light justify-content-center align-items-center h-100"
                  >
                    Add Deductions
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
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
            <input
              v-model.trim="createBatchCode"
              type="text"
              class="form-control"
              placeholder="Batch"
            />
          </div>

          <div class="mb-3">
            <label for="employeeSelect" class="form-label d-block text-start">
              Employees</label
            >
          </div>
          <select
            v-model="selectedEmployees"
            class="form-select"
            id="employeeSelect"
            multiple
          >
            <option
              v-for="employee in employees"
              :key="employee.id"
              :value="employee.id"
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
        >
          Create Batch
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
          <div class="mb-3">
            <label
              for="payrollBasicSalary"
              class="form-label d-block text-start"
              >Basic Salary</label
            >
            <input
              v-model="payrollBasicSalaryInput"
              type="number"
              class="form-control"
              id="payrollBasicSalary"
              aria-describedby="payrollBasicSalary"
              placeholder="Basic Salary"
            />
          </div>
          <div class="mb-3">
            <label
              for="payrollAllowanceSalary"
              class="form-label d-block text-start"
              >Allowance Salary</label
            >
            <input
              v-model="payrollAllowanceSalaryInput"
              type="number"
              class="form-control"
              id="payrollAllowanceSalary"
              aria-describedby="payrollAllowanceSalary"
              placeholder="Allowance Salary"
            />
          </div>
          <div class="mb-3">
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
            />
          </div>
          <div class="mb-3">
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
          <div class="mb-3">
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
            />
          </div>
          <div class="mb-3">
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
            />
          </div>
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
              >Extra Pay</label
            >
            <input
              v-model="payrollExtraPayInput"
              type="number"
              class="form-control"
              id="payrollExtraPay"
              aria-describedby="payrollExtraPay"
              placeholder="Extra Pay"
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
          form="payrollInternalSalaryForm"
          data-bs-dismiss="modal"
        >
          Add Salary
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
              for="payrollDeductionsHDMF"
              class="form-label d-block text-start"
              >PAG-IBIG Contribution</label
            >
            <input
              v-model="payrollDeductionsPAGIBIGInput"
              type="number"
              class="form-control"
              id="payrollDeductionsHDMF"
              aria-describedby="payrollDeductionsHDMF"
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
          form="payrollInternalDeductionsForm"
          data-bs-dismiss="modal"
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
          type="submit"
          class="btn tms-btn text-light"
          form="payrollExternalSalaryForm"
          data-bs-dismiss="modal"
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
          type="submit"
          class="btn tms-btn text-light"
          form="payrollExternalDeductionsForm"
          data-bs-dismiss="modal"
        >
          Add Deductions
        </button>
      </div>
    </template>
  </Modal>

  <Modal id="payrollBreakdownModal">
    <template v-slot:modal-header>
      <div class="modal-header justify-content-center border-bottom-0">
        <h1 class="modal-title fs-5" id="editEmployeeLabel">
          Payroll Breakdown
        </h1>
      </div>
    </template>
    <template v-slot:modal-body>
      <div class="modal-body"></div>
    </template>
    <template v-slot:modal-footer>
      <div class="modal-footer justify-content-center border-top-0">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
          Close
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
