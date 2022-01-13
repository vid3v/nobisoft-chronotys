<template>
  <div class="container box">
    <user-form />
  </div>
</template>

<script setup>
import UserForm from '../../components/UserForm'
</script>

<style scoped>
.container {
  max-width: 860px;
  margin-bottom: 30px;
}

.container.box {
  box-shadow: none;
}
</style>
