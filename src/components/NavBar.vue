<script setup>
import { inject, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { logOut } from '../requests'

const router = useRouter()
const route = useRoute()

const user = inject('User')

const dashboardPath = computed(() => {
  if (!user.value) {
    return '/'
  }

  return user.value.role === 'admin' ? '/console/dashboard' : '/u/dashboard'
})
const showCreateDeliveryLink = computed(() => {
  return !user.value ? true : user.value.role === 'user'
})
const showDashboardLink = computed(() => {
  return user.value && ['home', 'create-delivery'].includes(route.name)
})

async function signOut() {
  await logOut()
  await router.push({ name: 'login' })
}

</script>

<template>
  <div class="navbar">
    <div class="container">
      <router-link to="/" class="brand">
        <img src="/logo.png" alt="Chronotys" class="logo">
      </router-link>
      <div class="links">
        <router-link v-if="!user" to="/login" class="btn btn-outline btn-success">
          Connexion
        </router-link>
        <router-link v-if="showCreateDeliveryLink" to="/create-delivery" class="btn btn-secondary">
          Lancer une livraison
        </router-link>
        <router-link v-if="showDashboardLink" :to="dashboardPath" class="btn btn-primary">
          Tableau de bord
        </router-link>
        <button v-if="user" class="btn btn-danger" @click="signOut">
          Déconnexion
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.navbar {
  padding: 6px 12px;
  box-shadow: 0 3px 8px 0 rgba(0, 0, 0, .1);
}

.container {
  display: flex;
  align-items: center;
}

a.brand {
  height: 48px;
}

.logo {
  height: 48px;
}

.links {
  margin-left: auto;
  display: flex;
  align-items: center;
}

.links > * + * {
  margin-left: 16px;
}

@media (min-width: 576px) {
  .navbar {
    padding-left: 25px;
    padding-right: 25px;
  }
}

@media (min-width: 768px) {
  .navbar {
    padding-left: 90px;
    padding-right: 90px;
  }
}

@media (min-width: 992px) {
  .navbar {
    padding-left: 160px;
    padding-right: 160px;
  }
}

</style>
