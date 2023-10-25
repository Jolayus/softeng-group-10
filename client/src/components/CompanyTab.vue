<script>
export default {
  name: 'CompanyTab',
  props: ['classes', 'id', 'target', 'selected', 'clientId'],
  methods: {
    clickHandler() {
      this.$emit('tabChange', this.clientId);
      // clientId is the unique identifier for each client
    }
  }
};
</script>

<template>
  <li class="nav-item" role="presentation">
    <button
      class="nav-link text-light"
      :class="classes"
      :id="id"
      data-bs-toggle="pill"
      :data-bs-target="target"
      type="button"
      role="tab"
      :aria-controls="id.slice(0, id.indexOf('-tab'))"
      :aria-selected="(selected ? false : true)"
      @click="clickHandler"
    >
      <slot></slot>
    </button>
  </li>
</template>

<style scoped>
.nav .nav-link {
  background-color: #041421;
}
</style>
