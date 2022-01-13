<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useForm, useField } from 'vee-validate'
import { toFormValidator } from '@vee-validate/zod'
import * as zod from 'zod'
import { isPossiblePhoneNumber } from 'libphonenumber-js/mobile'
import { signUp } from '../requests'

const router = useRouter()

const creationFailed = ref(false)

const validationSchema = toFormValidator(
  zod.object({
    email: zod.string()
        .email('L\'adresse e-mail est invalide')
        .min(1, 'L\'adresse e-mail est requise'),
    phone_number: zod.string()
        .superRefine((value, ctx) => {
          if (value.length < 1) {
            ctx.addIssue({
              code: zod.ZodIssueCode.too_small,
              type: 'string',
              message: 'Le numéro de téléphone est requis',
              fatal: true
            })
          }
        })
        .superRefine((value, ctx) => {
          if (!(value.startsWith('+') || value.length > 8) || !isPossiblePhoneNumber(value)) {
            ctx.addIssue({
              code: zod.ZodIssueCode.custom,
              type: 'string',
              message: 'Le numéro de téléphone est invalid'
            })
          }
        }),
    password: zod.string()
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*\W).{6,30}$/, 'Schéma du mot de passe incorrect')
        .min(1, 'Le mot de passe est requis'),
    company: zod.object({
      name: zod.string()
          .max(36, 'Maximum 36 caractères')
          .min(3, 'Minimum 3 caractères')
          .min(1, 'Le nom de l\'entriprise est requis'),
      website: zod.string()
          .url('Le domaine est invalid')
          .min(1, 'Le domaine est requis')
    }).strict(),
  }).strict()
)

const { handleSubmit, isSubmitting, errors } = useForm({
  validationSchema,
  initialValues: {
    email: '',
    phone_number: '',
    password: '',
    company: {
      name: '',
      website: '',
    },
  }
})

const {
  value: email,
  meta: emailMeta
} = useField('email', undefined, { validateOnValueUpdate: false })
const {
  value: phoneNumber,
  meta: phoneNumberMeta
} = useField('phone_number', undefined, { validateOnValueUpdate: false })
const {
  value: password,
  meta: passwordMeta
} = useField('password', undefined, { validateOnValueUpdate: false })
const {
  value: companyName,
  meta: companyNameMeta
} = useField('company.name', undefined, { validateOnValueUpdate: false })
const {
  value: companyWebsite,
  meta: companyWebsiteMeta
} = useField('company.website', undefined, { validateOnValueUpdate: false })

const onSubmit = handleSubmit(async (values, { resetForm }) => {
  try {
    await signUp(values)
    await router.push({ name: 'home' })

    resetForm()
  } catch (error) {
    creationFailed.value = true
  }
})

</script>

<template>
  <div class="relative">
    <div class="logo-wrapper">
      <img class="logo" src="/logo.png" />
    </div>
    <h1 class="box-title text-center">Créer mon compte</h1>
    <div v-if="creationFailed" class="error">
      Échec de la création.
    </div>
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
        <input v-model="phoneNumber" type="text" placeholder="Téléphone"/>
        <transition name="slide-down">
          <div v-if="errors.phone_number && phoneNumberMeta.touched" class="error-message">
            {{ errors.phone_number }}
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
        <input v-model="companyName" type="text" placeholder="Nom de l'entreprise" />
        <transition name="slide-down">
          <div v-if="errors['company.name'] && companyNameMeta.touched" class="error-message">
            {{ errors['company.name'] }}
          </div>
        </transition>
      </div>
      <div class="form-group">
        <input v-model="companyWebsite" type="text" placeholder="Nom de domaine du site e-commerce" />
        <transition name="slide-down">
          <div v-if="errors['company.website'] && companyWebsiteMeta.touched" class="error-message">
            {{ errors['company.website'] }}
          </div>
        </transition>
      </div>
      <div class="form-group">
        <button type="submit" class="btn btn-primary" :disabled="isSubmitting">
          Je crée mon compte
        </button>
      </div>
    </form>
    <div class="text-center">
      <router-link to="login" class="link">
        Connexion
      </router-link>
    </div>
  </div>
</template>

<style scoped>
div.text-center {
  padding: 8px 0;
}
</style>
