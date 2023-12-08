<script>
export default {
  name: 'Modal',
  props: ['id', 'isForPayrollBreakdown'],
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
    <div class="modal-dialog" :class="{ 'payroll-breakdown': isForPayrollBreakdown }">
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

.payroll-breakdown {
  min-width: 800px;
}
</style>