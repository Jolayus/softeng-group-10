<script>
export default {
  name: 'CardDashboard'
}
</script>

<template>
  <div class="card w-45">
    <div class="card-body text-center">
      <slot name="title"></slot>
      <slot name="description"></slot>
      <slot name="link"></slot>
    </div>
  </div>
</template>

<style scoped>
.w-45 {
  width: 45%;
}
</style>
