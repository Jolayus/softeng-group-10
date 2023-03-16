<script>
import SearchIcon from '../components/Icons/SearchIcon.vue';
import Footer from '../components/Footer.vue';

export default {
  name: 'Employee',
  components: {
    SearchIcon,
    Footer
  }
}
</script>

<template>
  <div class="d-flex flex-column justify-content-between h-100">
    <header class="mb-5">
      <h1>Employee</h1>
    </header>
    <main class="container flex-grow-1">
      <div>
        <div class="input-group mb-3">
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
      </div>
      <table class="table">
        <thead>
          <tr>
            <th scope="col">Name</th>
            <th scope="col">Role</th>
            <th scope="col">Email</th>
            <th scope="col">Contact #</th>
          </tr>
        </thead>
        <tbody class="table-group-divider">
          <tr>
            <th scope="row">Juan Dela Cruz</th>
            <td>Driver</td>
            <td>juandelacruz@gmail.com</td>
            <td>09215976342</td>
          </tr>
          <tr>
            <th scope="row">John Miguel Alonzo</th>
            <td>Helper</td>
            <td>johnmiguelalonzo@gmail.com</td>
            <td>09215976342</td>
          </tr>
          <tr>
            <th scope="row">Kakashe Tarashi</th>
            <td>Admin</td>
            <td>kakashetarashi@gmail.com</td>
            <td>09215976342</td>
          </tr>
          <tr>
            <th scope="row">Francis Magno</th>
            <td>Driver</td>
            <td>francismagno@gmail.com</td>
            <td>09215976342</td>
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
  width: 50%;
}
</style>