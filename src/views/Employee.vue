<script>
import SearchIcon from '../components/Icons/SearchIcon.vue';
import EditIcon from '../components/Icons/EditIcon.vue';
import TrashIcon from '../components/Icons/TrashIcon.vue';
import Footer from '../components/Footer.vue';
import employeesModel from '../model/employees.model';

console.log(employeesModel);

export default {
  name: 'Employee',
  components: {
    SearchIcon,
    EditIcon,
    TrashIcon,
    Footer
  },
  data() {
    return {
      employeesModel,
      userInput: ''
    };
  },
  methods: {
    removeEmployee(id) {
      this.employeesModel = this.employeesModel.filter(employee => employee.id !== id);
    }
  },
  computed: {
    employees() {
      return this.employeesModel.filter(employee => employee.name.includes(this.userInput));
    }
  }
}
</script>

<template>
  <div class="d-flex flex-column justify-content-between h-100">
    <header class="mb-5">
      <h1>Employees</h1>
    </header>
    <main class="container flex-grow-1">
      <div class="d-flex justify-content-between mb-4" style="max-height: 35px">
        <div class="input-group mb-3 h-100 align-items-center gap-2">
          <label for="user-input">Search:</label>
          <input v-model="userInput" type="text" class="form-control" placeholder="Employee's name" aria-label="Recipient's username"
            id="user-input" aria-describedby="basic-addon2">
        </div>
        <button class="btn tms-btn text-light d-flex align-items-center h-100">Add new employee</button>
      </div>
      <table class="table">
        <thead class="tbl-header text-light rounded">
          <tr>
            <th scope="col">Name</th>
            <th scope="col">Role</th>
            <th scope="col">Email</th>
            <th scope="col">Contact #</th>
            <th scope="col">Actions</th>
          </tr>
        </thead>
        <tbody class="table-group-divider">
          <tr v-for="employee in employees" :key="employee.id">
            <th scope="row">{{ employee.name }}</th>
            <td>{{ employee.role }}</td>
            <td>{{ employee.email }}</td>
            <td>{{ employee.phone }}</td>
            <td>
              <EditIcon @click.prevent="" class="mx-2 text-primary" role="button" />
              <TrashIcon @click.prevent="removeEmployee(employee.id)" class="mx-2 text-danger" role="button" />
            </td>
          </tr>
        </tbody>
      </table>
    </main>
    <Footer>
      <div>
        <img src="../assets/company_logo.png" height="30" alt="company logo">
        <span>RO-ED Trucking Management System</span>
      </div>
      <div>
        <em>
          <small>Introduce opportunities for our Partner Operators and offer solution</small>
        </em>
      </div>
    </Footer>
  </div>
</template>

<style scoped>
.input-group {
  width: 45%;
}
</style>