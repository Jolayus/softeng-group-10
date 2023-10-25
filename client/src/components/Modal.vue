<script>
export default {
  name: 'Modal',
  props: ['id'],
};
</script>

<template>
  <div
    class="modal fade"
    :id="id"
    role="dialog"
    tabindex="-1"
    :aria-labelledby="id + 'Label'"
    aria-hidden="true"
  >
    <div class="modal-dialog">
      <div class="modal-content text-light">
        <slot name="modal-header"></slot>
        <slot name="modal-body"></slot>
        <slot name="modal-footer"></slot>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-dialog > .modal-content {
  background-color: #041421;
}
</style>