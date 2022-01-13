<script setup>
import { inject, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useForm, useField } from 'vee-validate'
import { toFormValidator, toFieldValidator } from '@vee-validate/zod'
import * as zod from 'zod'
import { isPossiblePhoneNumber } from "libphonenumber-js/max";
import { updateUserInfo, updateUserPassword, logOut } from '../requests'

const router = useRouter()

const user = inject('User')

const updateFailed = ref(false)
const updated = ref(false)

const userValidationSchema = toFormValidator(
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
const passwordSchema = toFieldValidator(
    zod.string()
        .min(1, 'Le mot de passe est requis')
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*\W).{6,30}$/, 'Schéma du mot de passe incorrect')
)

const { handleSubmit, isSubmitting, errors } = useForm({
  validationSchema: userValidationSchema,
  initialValues: {
    email: user.value.email,
    phone_number: user.value.phone_number,
    company: {
      name: user.value.company.name,
      website: user.value.company.website,
    },
  }
})

const {
  value: email,
  meta: emailMeta
} = useField('email', undefined, { validateOnValueUpdate: false})
const {
  value: phoneNumber,
  meta: phoneNumberMeta
} = useField('phone_number', undefined, { validateOnValueUpdate: false })
const {
  value: companyName,
  meta: companyNameMeta
} = useField('company.name', undefined, { validateOnValueUpdate: false })
const {
  value: companyWebsite,
  meta: companyWebsiteMeta
} = useField('company.website', undefined, { validateOnValueUpdate: false })
const {
  value: newPassword,
  errorMessage,
  validate,
  resetField
} = useField('password', passwordSchema, {
  validateOnValueUpdate: false,
  initialValue: '',
  standalone: true
})

const updateInfo = handleSubmit(async (values) => {
  updated.value = false
  try {
    await updateUserInfo(values)

    updated.value = true
  } catch (error) {
    updateFailed.value = true
  }
})

async function updatePassword() {
  try {
    const { valid } = await validate()

    if (valid) {
      await updateUserPassword(newPassword.value)
      resetField()
      await logOut()
      await router.push({ name: 'login' })
    }
  } catch (error) {
    updateFailed.value = true
  }
}

function closeBanner() {
  updated.value = false
}

</script>

<template>
  <div>
    <h3 class="subtitle">Profil</h3>
    <transition name="fade">
      <div v-if="updateFailed" class="error">
        Échec de la mise à jour.
      </div>
    </transition>
    <transition name="fade">
      <div v-if="updated" class="banner banner-success">
        <div class="banner-content">
          Mise à jour réussie
        </div>
        <i class="close" @click="closeBanner">
          <svg viewBox="0 0 24 24">
            <path fill="currentColor" d="M19,3H16.3H7.7H5A2,2 0 0,0 3,5V7.7V16.4V19A2,2 0 0,0 5,21H7.7H16.4H19A2,2 0 0,0 21,19V16.3V7.7V5A2,2 0 0,0 19,3M15.6,17L12,13.4L8.4,17L7,15.6L10.6,12L7,8.4L8.4,7L12,10.6L15.6,7L17,8.4L13.4,12L17,15.6L15.6,17Z" />
          </svg>
        </i>
      </div>
    </transition>
    <div class="form-grid">
      <div>
        <form @submit.prevent="updateInfo">
          <div class="fieldset">
            <span>Mettre à jour mon compte</span>
          </div>
          <div class="form-group">
            <input v-model="email" type="text" placeholder="Address e-mail"/>
            <transition name="slide-down">
              <div v-if="errors.email && emailMeta.touched" class="error-message">
                {{ errors.email }}
              </div>
            </transition>
          </div>
          <div class="form-group">
            <input v-model="phoneNumber" type="tel" placeholder="Téléphone" />
            <transition name="slide-down">
              <div v-if="errors.phoneNumber && phoneNumberMeta.touched" class="error-message">
                {{ errors.phoneNumber }}
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
            <input v-model="companyWebsite" type="text" placeholder="Nom de domaine su site e-commerce" />
            <transition name="slide-down">
              <div v-if="errors['company.website'] && companyWebsiteMeta.touched" class="error-message">
                {{ errors['company.website'] }}
              </div>
            </transition>
          </div>
          <div class="form-group">
            <button type="submit" class="btn btn-primary" :disabled="isSubmitting">
              Mettre à jour
            </button>
          </div>
        </form>
      </div>
      <div>
        <form @submit.prevent="updatePassword">
          <div class="fieldset">
            <span>Mettre à jour mon mot de passe</span>
          </div>
          <div class="form-group">
            <input v-model="newPassword" type="password" placeholder="Nouveau mot de passe"/>
            <transition name="slide-down">
              <div v-if="errorMessage" class="error-message">
                {{ errorMessage }}
              </div>
            </transition>
          </div>
          <div class="form-group">
            <button type="submit" class="btn btn-primary">
              Mettre à jour
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  grid-gap: 30px 60px;
}

.form-group:last-child {
  flex-direction: row;
  justify-content: flex-end;
}
</style>
