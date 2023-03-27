<script>
export default {
  name: 'CompanyTab',
  props: ['classes', 'id', 'target', 'selected']
};
</script>

<template>
  <li class="nav-item" role="presentation">
    <button
      class="nav-link"
      :class="classes"
      :id="id"
      data-bs-toggle="pill"
      :data-bs-target="target"
      type="button"
      role="tab"
      :aria-controls="id.slice(0, id.indexOf('-tab'))"
      :aria-selected="(selected = selected ? false : true)"
    >
      <slot></slot>
    </button>
  </li>
</template>

<style scoped></style>
