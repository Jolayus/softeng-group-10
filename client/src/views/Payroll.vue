<script>
import SearchIcon from '../components/Icons/SearchIcon.vue';
import FloatingActionButton from '../components/FloatingActionButton.vue';
import Modal from '../components/Modal.vue';
import { getEmployeesModel } from '../models/employees.model';

export default {
  name: 'Payroll',
  components: {
    SearchIcon,
    Modal,
    FloatingActionButton
  },
  data() {
    return {
      employeesModel: getEmployeesModel(),
      selectedEmployee: null,
      searchInput: '',

      // currentModal: ''
    };
  },
  computed: {
    filteredEmployees() {
      const employees = this.employeesModel.filter((employee) =>
        employee.name.toLowerCase().includes(this.searchInput.toLowerCase())
      );

      return employees;
    }
  },
  methods: {

  },

};
</script>

<template>
  <div class="d-flex flex-column justify-content-between h-100">
    <header class="mb-5">
      <h1>Payroll</h1>
    </header>
    <main class="container flex-grow-1">
      <div class="d-flex justify-content-between mb-4" style="max-height: 35px">
        <div class="input-group mb-3 h-100 align-items-center gap-2">
          <label for="user-input">Search:</label>
          <input v-model="searchInput" type="text" class="form-control" placeholder="Employee's name"
            aria-label="Recipient's username" id="user-input" aria-describedby="basic-addon2" />
        </div>
      </div>
      <table class="table">
        <thead class="tbl-header text-light rounded">
          <tr>
            <th scope="col">Name</th>
            <th scope="col">Role</th>
            <th scope="col">Total</th>
            <th scope="col">Actions</th>
          </tr>
        </thead>
        <tbody class="table-group-divider">
          <tr v-for="employee in filteredEmployees" :key="employee.id">
            <th scope="row">{{ employee.name }}</th>
            <td>{{ employee.role }}</td>
            <td>
              <button type="button" data-bs-toggle="modal" data-bs-target="#payrollBreakdownModal"
                class="btn tms-btn text-light align-items-center h-100" @click="currentModal = 'BREAKDOWN'">
                P0.00
              </button>
            </td>
            <td>
              <button v-if="employee.role === 'Admin'" type="button" data-bs-toggle="modal" data-bs-target="#payrollInternalSalaryModal"
                class="btn tms-btn text-light justify-content-center align-items-center h-100"
                @click="currentModal = 'SALARY'">
                Add Salary
              </button>

              <button v-if="employee.role === 'Admin'" type="button" data-bs-toggle="modal" data-bs-target="#payrollInternalDeductionsModal"
                class="btn tms-btn text-light justify-content-center align-items-center h-100"
                @click="currentModal = 'DEDUCTIONS'">
                Add Deductions
              </button>

              <button v-if="employee.role !== 'Admin'" type="button" data-bs-toggle="modal" data-bs-target="#payrollExternalSalaryModal"
                class="btn tms-btn text-light justify-content-center align-items-center h-100"
                @click="currentModal = 'SALARY'">
                Add Salary
              </button>

              <button v-if="employee.role !== 'Admin'" type="button" data-bs-toggle="modal" data-bs-target="#payrollExternalDeductionsModal"
                class="btn tms-btn text-light justify-content-center align-items-center h-100">
                Add Deductions
              </button>              
            </td>            
          </tr>
        </tbody>
      </table>
    </main>
  </div>

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
              v-model="payrollBasicSalary"
              type="number"
              class="form-control"
              id="payrollBasicSalary"
              aria-describedby="payrollBasicSalary"
            />
          </div>
          <div class="mb-3">
            <label
              for="payrollAllowanceSalary"
              class="form-label d-block text-start"
              >Allowance Salary</label
            >
            <input
              v-model="payrollAllowanceSalary"
              type="number"
              class="form-control"
              id="payrollAllowanceSalary"
              aria-describedby="payrollAllowanceSalary"
            />
          </div>
          <div class="mb-3">
            <label
              for="payrollDailyRate"
              class="form-label d-block text-start"
              >Daily Rate</label
            >
            <input
              v-model="payrollDailyRate"
              type="number"
              class="form-control"
              id="payrollDailyRate"
              aria-describedby="payrollDailyRate"
            />
          </div>
          <div class="mb-3">
            <label
              for="payrollDailyAllowance"
              class="form-label d-block text-start"
              >Daily Allowance</label
            >
            <input
              v-model="payrollDailyAllowance"
              type="number"
              class="form-control"
              id="payrollDailyAllowance"
              aria-describedby="payrollDailyAllowance"
            />
          </div>
          <div class="mb-3">
            <label
              for="payrollDaysOfWork"
              class="form-label d-block text-start"
              >Days of Work</label
            >
            <input
              v-model="payrollDaysOfWork"
              type="number"
              class="form-control"
              id="payrollDaysOfWork"
              aria-describedby="payrollDaysOfWork"
            />
          </div>
          <div class="mb-3">
            <label
              for="payrollSemiBasicSalary"
              class="form-label d-block text-start"
              >Semi - Basic Salary</label
            >
            <input
              v-model="payrollSemiBasicSalary"
              type="number"
              class="form-control"
              id="payrollSemiBasicSalary"
              aria-describedby="payrollSemiBasicSalary"
            />
          </div>
          <div class="mb-3">
            <label
              for="payrollSemiAllowanceSalary"
              class="form-label d-block text-start"
              >Semi - Allowance Salary</label
            >
            <input
              v-model="payrollSemiAllowanceSalary"
              type="number"
              class="form-control"
              id="payrollSemiAllowanceSalary"
              aria-describedby="payrollSemiAllowanceSalary"
            />
          </div>
          <div class="mb-3">
            <label
              for="payrollServiceFee"
              class="form-label d-block text-start"
              >Service Fee</label
            >
            <input
              v-model="payrollServiceFee"
              type="number"
              class="form-control"
              id="payrollServiceFee"
              aria-describedby="payrollServiceFee"
            />
          </div>
          <div class="mb-3">
            <label
              for="payrollOvertimePay"
              class="form-label d-block text-start"
              >Overtime Pay</label
            >
            <input
              v-model="payrollOvertimePay"
              type="number"
              class="form-control"
              id="payrollOvertimePay"
              aria-describedby="payrollOvertimePay"
            />
          </div>
          <div class="mb-3">
            <label
              for="payrollExtraPay"
              class="form-label d-block text-start"
              >Extra Pay</label
            >
            <input
              v-model="payrollExtraPay"
              type="number"
              class="form-control"
              id="payrollExtraPay"
              aria-describedby="payrollExtraPay"
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
        <button type="submit" class="btn tms-btn text-light" form="payrollInternalSalaryForm" data-bs-dismiss="modal"
          :disabled="isFormInvalid">
          Save Changes
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
              for="payrollDedcutionsCashAdvance"
              class="form-label d-block text-start"
              >Cash Advance</label
            >
            <input
              v-model="payrollDedcutionsCashAdvance"
              type="number"
              class="form-control"
              id="payrollDedcutionsCashAdvance"
              aria-describedby="payrollDedcutionsCashAdvance"
            />
          </div>
          <div class="mb-3">
            <label
              for="payrollDedcutionsHDMF"
              class="form-label d-block text-start"
              >Housing Development Mutual Fund</label
            >
            <input
              v-model="payrollDedcutionsHDMF"
              type="number"
              class="form-control"
              id="payrollDedcutionsHDMF"
              aria-describedby="payrollDedcutionsHDMF"
            />
          </div>
          <div class="mb-3">
            <label
              for="payrollDedcutionsSSS"
              class="form-label d-block text-start"
              >SSS Contribution</label
            >
            <input
              v-model="payrollDedcutionsSSS"
              type="number"
              class="form-control"
              id="payrollDedcutionsSSS"
              aria-describedby="payrollDedcutionsSSS"
            />
          </div>
          <div class="mb-3">
            <label
              for="payrollDedcutionsLate"
              class="form-label d-block text-start"
              >Late</label
            >
            <input
              v-model="payrollDedcutionsLate"
              type="number"
              class="form-control"
              id="payrollDedcutionsLate"
              aria-describedby="payrollDedcutionsLate"
            />
          </div>
          <div class="mb-3">
            <label
              for="payrollDedcutionsDamages"
              class="form-label d-block text-start"
              >Damages</label
            >
            <input
              v-model="payrollDedcutionsDamages"
              type="number"
              class="form-control"
              id="payrollDedcutionsDamages"
              aria-describedby="payrollDedcutionsDamages"
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
        <button type="submit" class="btn tms-btn text-light" form="payrollInternalDeductionsForm" data-bs-dismiss="modal"
          :disabled="isFormInvalid">
          Save Changes
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
            <label
              for="payrollNoOfTrips"
              class="form-label d-block text-start"
              >No. Of Trips</label
            >
            <input
              v-model="payrollNoOfTrips"
              type="number"
              class="form-control"
              id="payrollNoOfTrips"
              aria-describedby="payrollNoOfTrips"
            />
          </div>
          <div class="mb-3">
            <label
              for="payrollClientTripRates"
              class="form-label d-block text-start"
              >Client Trip Rate</label
            >
            <input
              v-model="payrollClientTripRates"
              type="number"
              class="form-control"
              id="payrollClientTripRates"
              aria-describedby="payrollClientTripRates"
            />
          </div>
          <div class="mb-3">
            <label
              for="payrollTotalAmountOfTrips"
              class="form-label d-block text-start"
              >Total Amount of Trips</label
            >
            <input
              v-model="payrollTotalAmountOfTrips"
              type="number"
              class="form-control"
              id="payrollTotalAmountOfTrips"
              aria-describedby="payrollTotalAmountOfTrips"
            />
          </div>
          <!-- EXPENSES -->
          <div class="mb-3">
            <label
              for="payrollDropRate"
              class="form-label d-block text-start"
              >Drop Rate</label
            >
            <input
              v-model="payrollDropRate"
              type="number"
              class="form-control"
              id="payrollDropRate"
              aria-describedby="payrollDropRate"
            />
          </div>
          <div class="mb-3">
            <label
              for="payrollTollFee"
              class="form-label d-block text-start"
              >Toll Fee</label
            >
            <input
              v-model="payrollTollFee"
              type="number"
              class="form-control"
              id="payrollTollFee"
              aria-describedby="payrollTollFee"
            />
          </div>
          <div class="mb-3">
            <label
              for="payrollPassway"
              class="form-label d-block text-start"
              >Passway</label
            >
            <input
              v-model="payrollPassway"
              type="number"
              class="form-control"
              id="payrollPassway"
              aria-describedby="payrollPassway"
            />
          </div>
          <div class="mb-3">
            <label
              for="payrollOthers"
              class="form-label d-block text-start"
              >Others</label
            >
            <input
              v-model="payrollOthers"
              type="number"
              class="form-control"
              id="payrollOthers"
              aria-describedby="payrollOthers"
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
        <button type="submit" class="btn tms-btn text-light" form="payrollExternalSalaryForm" data-bs-dismiss="modal"
          :disabled="isFormInvalid">
          Save Changes
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
              for="payrollDedcutionsCashAdvance"
              class="form-label d-block text-start"
              >Cash Advance</label
            >
            <input
              v-model="payrollDedcutionsCashAdvance"
              type="number"
              class="form-control"
              id="payrollDedcutionsCashAdvance"
              aria-describedby="payrollDedcutionsCashAdvance"
            />
          </div>
          <div class="mb-3">
            <label
              for="payrollDedcutionsMembershipFee"
              class="form-label d-block text-start"
              >Membership Fee</label
            >
            <input
              v-model="payrollDedcutionsMembershipFee"
              type="number"
              class="form-control"
              id="payrollDedcutionsMembershipFee"
              aria-describedby="payrollDedcutionsMembershipFee"
            />
          </div>
          <div class="mb-3">
            <label
              for="payrollDedcutionsUniform"
              class="form-label d-block text-start"
              >Uniform</label
            >
            <input
              v-model="payrollDedcutionsUniform"
              type="number"
              class="form-control"
              id="payrollDedcutionsUniform"
              aria-describedby="payrollDedcutionsUniform"
            />
          </div>
          <div class="mb-3">
            <label
              for="payrollDedcutionsPenalties"
              class="form-label d-block text-start"
              >Penalties</label
            >
            <input
              v-model="payrollDedcutionsPenalties"
              type="number"
              class="form-control"
              id="payrollDedcutionsPenalties"
              aria-describedby="payrollDedcutionsPenalties"
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
        <button type="submit" class="btn tms-btn text-light" form="payrollExternalDeductionsForm" data-bs-dismiss="modal"
          :disabled="isFormInvalid">
          Save Changes
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
      <div class="modal-body">

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

  <!-- <FloatingActionButton /> -->
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
</style>
