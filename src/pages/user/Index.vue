<template>
  <layout>
    <router-view v-slot="{ Component }">
      <transition name="splash" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
  </layout>
</template>

<script setup>
import Layout from '../../layouts/User.vue'
</script>
