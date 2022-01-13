<script setup>
import { ref, watch, inject, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useForm, useField } from 'vee-validate'
import { toFormValidator } from '@vee-validate/zod'
import * as zod from 'zod'
import { logIn } from '../requests'

const route = useRoute()
const router = useRouter()

const user = inject('User')

const authFailed = ref(false)

const validationSchema = toFormValidator(
  zod.object({
    email: zod.string().email({ message: 'L\'adresse e-mail est invalide'}).min(1, 'L\'adresse e-mail est requise'),
    password: zod.string().min(1, 'Le mot de passe est requis'),
  }).strict()
)

const { handleSubmit, isSubmitting, errors } = useForm({
  validationSchema,
  initialValues: {
    email: '',
    password: ''
  },
})

const {
  value: email,
  meta: emailMeta
} = useField('email', undefined, { validateOnValueUpdate: false});
const {
  value: password,
  meta: passwordMeta
} = useField('password', undefined, { validateOnValueUpdate: false })

const onSubmit = handleSubmit(async (credentials, { resetForm }) => {
  try {
    const user = await logIn(credentials)

    if (route.query && 'redirect' in route.query) {
      const { redirect } = route.query

      await router.push({
        name: user.role === 'admin' && redirect === 'create-delivery' ? 'admin' : redirect
      })
    } else {
      await router.push({
        name: user.role === 'admin' ? 'admin' : 'user'
      })
    }

    resetForm()
  } catch (error) {
    authFailed.value = true
  }
})

const unsubscribe = watch(user, (value) => {
  // Redirect user if connected on page refresh
  if (value && route.redirectedFrom) {
    router.push(route.redirectedFrom.path)
  }
})

onUnmounted(() => {
  unsubscribe()
})

</script>

<template>
  <div class="relative">
    <div class="logo-wrapper">
      <img class="logo" src="/logo.png" />
    </div>
    <h1 class="box-title text-center">Connexion</h1>
    <transition name="fade">
      <div v-if="authFailed" class="error">
        Échec de l'authentification.
      </div>
    </transition>
    <form @submit.prevent="onSubmit">
      <div class="form-group">
        <input v-model="email" type="text" placeholder="Adresse e-mail"/>
        <transition name="slide-down">
          <div v-if="errors.email && emailMeta.touched" class="error-message">
            {{ errors.email }}
          </div>
        </transition>
      </div>
      <div class="form-group">
        <input v-model="password" type="password" placeholder="Mot de passe" />
        <transition name="slide-down">
          <div v-if="errors.password && passwordMeta.touched" class="error-message">
            {{ errors.password }}
          </div>
        </transition>
      </div>
      <div class="form-group">
        <button type="submit" class="btn btn-success" :disabled="isSubmitting">
          Se connecter
        </button>
      </div>
    </form>
    <div class="text-center">
      <router-link to="signup" class="link">
        Créer mon compte
      </router-link>
    </div>
  </div>
</template>

<style scoped>
div.text-center {
  padding: 8px 0;
}
</style>
