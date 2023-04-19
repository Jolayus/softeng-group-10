<script>
export default {
  name: 'TabPane',
  props: ['classes', 'id']
};
</script>

<template>
  <div
    class="tab-pane fade"
    :class="classes"
    :id="id"
    role="tabpanel"
    :aria-labelledby="id + '-tab'"
    tabindex="0"
  >
    <slot></slot>
  </div>
</template>
