<script>
export default {
  name: 'CardDashboard',
  props: ['classes']
}
</script>

<template>
  <div class="card w-45 position-relative shadow">
    <div class="overlay" :class="classes"></div>
    <div class="card-body text-center d-flex flex-column justify-content-between">
      <slot name="title"></slot>
      <slot name="description"></slot>
      <slot name="link"></slot>
    </div>
  </div>
</template>

<style scoped>
.card {
  transition: transform 0.2s ease-in-out;
}

.card:hover {
  transform: translateY(-5px);
}

.w-45 {
  width: 45%;
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  opacity: 0.3;
}
</style>