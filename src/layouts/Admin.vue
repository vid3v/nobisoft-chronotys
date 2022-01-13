<template>
  <div class="container">
    <div class="content">
      <slot></slot>
    </div>
  </div>
</template>

<style scoped>
.container {
  padding: 24px;
}

@media (min-width: 768px) {
  .container {
    padding-left: 160px;
    padding-right: 160px;
  }
}
</style>
