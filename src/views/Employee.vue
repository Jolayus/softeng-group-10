<script>
import SearchIcon from '../components/Icons/SearchIcon.vue';
import EditIcon from '../components/Icons/EditIcon.vue';
import TrashIcon from '../components/Icons/TrashIcon.vue';
import Footer from '../components/Footer.vue';

export default {
  name: 'Employee',
  components: {
    SearchIcon,
    EditIcon,
    TrashIcon,
    Footer
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
        <div class="input-group mb-3 h-100">
          <input type="text" class="form-control" placeholder="Employee's name" aria-label="Recipient's username"
            aria-describedby="basic-addon2">
          <div class="input-group-append">
            <span class="input-group-text h-100 p-0" id="basic-addon2">
              <button class="btn border-0 tms-btn text-light d-flex align-items-center h-100">
                <SearchIcon />
              </button>
            </span>
          </div>
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
          <tr>
            <th scope="row">Juan Dela Cruz</th>
            <td>Driver</td>
            <td>juandelacruz@gmail.com</td>
            <td>09215976342</td>
            <td></td>
          </tr>
          <tr>
            <th scope="row">John Miguel Alonzo</th>
            <td>Helper</td>
            <td>johnmiguelalonzo@gmail.com</td>
            <td>09542648724</td>
            <td></td>
          </tr>
          <tr>
            <th scope="row">Kakashe Tarashi</th>
            <td>Admin</td>
            <td>kakashetarashi@gmail.com</td>
            <td>09254823679</td>
            <td></td>
          </tr>
          <tr>
            <th scope="row">Leanne Graham</th>
            <td>Admin</td>
            <td>leannegraham@gmail.com</td>
            <td>09871254893</td>
            <td></td>
          </tr>
          <tr>
            <th scope="row">Ervin Howell</th>
            <td>Helper</td>
            <td>ervinhowell@gmail.com</td>
            <td>09148753692</td>
            <td></td>
          </tr>
          <tr>
            <th scope="row">Clementine Bauch</th>
            <td>Helper</td>
            <td>clementine bauch@gmail.com</td>
            <td>09584195638</td>
            <td></td>
          </tr>
          <tr>
            <th scope="row">Patricia Lebsack</th>
            <td>Driver</td>
            <td>patricialebsack@gmail.com</td>
            <td>09587452638</td>
            <td></td>
          </tr>
          <tr>
            <th scope="row">Chelsey Dietrich</th>
            <td>Driver</td>
            <td>chelseydietrich@gmail.com</td>
            <td>09581275892</td>
            <td></td>
          </tr>
          <tr>
            <th scope="row">Dennis Schulist</th>
            <td>Admin</td>
            <td>dennisschulist@gmail.com</td>
            <td>09587495815</td>
            <td></td>
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