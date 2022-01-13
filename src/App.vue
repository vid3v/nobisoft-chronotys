<script setup>
import AuthProvider from './components/AuthProvider'
import NavBar from './components/NavBar'
</script>

<template>
  <auth-provider>
    <nav-bar />
    <router-view />
  </auth-provider>
</template>
