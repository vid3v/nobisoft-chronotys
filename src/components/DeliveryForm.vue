<script setup>
import { ref } from 'vue'
import { useForm, useField } from 'vee-validate'
import { toFormValidator } from '@vee-validate/zod'
import * as zod from 'zod'
import { isPossiblePhoneNumber } from 'libphonenumber-js/mobile'
import dateFormat from 'dateformat'
import { createDelivery } from '../requests'

const creationFailed = ref(false)
const created = ref(false)

const validationSchema = toFormValidator(
    zod.object({
      recipient: zod.object({
        name: zod.string()
            .max(38, 'Maximum 38 caractères')
            .min(4, 'Minimum 4 caractères')
            .min(1, 'Le nom est requis'),
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
            })
      }).strict(),
      address: zod.object({
        city: zod.string()
            .max(38, 'Maximum 38 caractères')
            .min(4, 'Minimum 4 caractères')
            .min(1, 'La ville est requise'),
        district: zod.string()
            .max(38, 'Maximum 38 caractères')
            .min(4, 'Minimum 4 caractères')
            .min(1, 'Le quartier est requis'),
        street: zod.string()
            .max(38, 'Maximum 38 caractères')
            .min(4, 'Minimum 4 caractères')
            .min(1, 'Le lieu-dit est requis'),
      }).strict(),
      parcel: zod.object({
        name: zod.string()
            .max(52, 'Maximum 52 caractères')
            .min(4, 'Minimum 4 caractères')
            .min(1, 'Le nom est requis'),
        volume: zod.number({
          invalid_type_error: 'Le volume doit être un nombre',
          required_error: 'Le volume est requis'
        }).gte(0, 'Le volume doit être supérieur à 0'),
        description: zod.string()
            .max(500, 'Maximum 500 caractères')
            .min(20, 'Minimum 20 caractères')
            .min(1, 'La description est requise'),
      }).strict(),
      amount: zod.number({
        invalid_type_error: 'Le montant doit être un nombre',
        required_error: 'Le montant est requis'
      }).gte(0,'Le montant doit être supérieur à 0'),
      delivery_date: zod.string()
          .superRefine((value, ctx) => {
            if (!value) {
              ctx.addIssue({
                code: zod.ZodIssueCode.custom,
                type: 'string',
                message: 'La date et l\'heure de livraison sont requise',
                fatal: true
              })
            }
          })
          .superRefine((value, ctx) => {
            const { success } = zod.date().safeParse(new Date(value))

            if (!/^\d{4}-\d{1,2}-\d{1,2}T\d{1,2}:\d{1,2}$/.test(value) || !success) {
              ctx.addIssue({
                code: zod.ZodIssueCode.invalid_date,
                type: 'string',
                message: 'La date et l\'heure de livraison sont invalides. Ex: 2022-03-16T13:50',
                fatal: true
              })
            }
          })
          .superRefine((value, ctx) => {
            const date = new Date(value)
            const now = new Date()

            if (date.getTime() < now.getTime()) {
              const d = dateFormat(now, 'shortDate')
              ctx.addIssue({
                code: zod.ZodIssueCode.custom,
                message: `La date et l'heure de livraison doivent être supérieure à ${d}`
              })
            }
          })
    }).strict()
)

const { handleSubmit, errors, isSubmitting } = useForm({
  validationSchema,
  initialValues: {
    recipient: {
      name: '',
      phone_number: '',
    },
    address: {
      city: '',
      district: '',
      street: '',
    },
    parcel: {
      name: '',
      volume: undefined,
      description: ''
    },
    amount: undefined,
    delivery_date: ''
  }
})

const {
  value: recipientName,
  meta: recipientNameMeta
} = useField('recipient.name', undefined, { validateOnValueUpdate: false })
const {
  value: recipientPhoneNumber,
  meta: recipientPhoneNumberMeta
} = useField('recipient.phone_number', undefined, { validateOnValueUpdate: false })
const {
  value: city,
  meta: cityMeta
} = useField('address.city', undefined, { validateOnValueUpdate: false })
const {
  value: district,
  meta: districtMeta
} = useField('address.district', undefined, { validateOnValueUpdate: false })
const {
  value: street,
  meta: streetMeta
} = useField('address.street', undefined, { validateOnValueUpdate: false })
const {
  value: parcelName,
  meta: parcelNameMeta
} = useField('parcel.name', undefined, { validateOnValueUpdate: false })
const {
  value: parcelVolume,
  meta: parcelVolumeMeta
} = useField('parcel.volume', undefined, { validateOnValueUpdate: false })
const {
  value: parcelDescription,
  meta: parcelDescriptionMeta
} = useField('parcel.description', undefined, { validateOnValueUpdate: false })
const {
  value: amount,
  meta: amountMeta
} = useField('amount', undefined, { validateOnValueUpdate: false })
const {
  value: deliveryDate,
  meta: deliveryDateMeta
} = useField('delivery_date', undefined, { validateOnValueUpdate: false })

const onSubmit = handleSubmit(async (values, { resetForm }) => {
  try {
    await createDelivery(values)
    created.value = true
    resetForm()
  } catch (error) {
    creationFailed.value = true
  }
})

function closeBanner() {
  created.value = false
}

</script>

<template>
  <div class="relative">
    <div class="logo-wrapper">
      <img class="logo" src="/logo.png" />
    </div>
    <h1 class="box-title text-center">Lancer une livraison</h1>
    <transition name="fade">
      <div v-if="creationFailed" class="error">
        Échec de la création de la livraison.
      </div>
    </transition>
    <transition name="fade">
      <div v-if="created" class="banner banner-outline banner-success">
        <i class="banner-icon">
          <svg style="width:24px;height:24px" viewBox="0 0 24 24">
            <path fill="currentColor" d="M21,5L9,17L3.5,11.5L4.91,10.09L9,14.17L19.59,3.59L21,5M3,21V19H21V21H3Z" />
          </svg>
        </i>
        <div class="banner-content">
          Votre livraison a été créé avec succès. Consulter le tableau de bord pour voir son statut.
        </div>
        <i class="close" @click="closeBanner">
          <svg viewBox="0 0 24 24">
            <path fill="currentColor" d="M19,3H16.3H7.7H5A2,2 0 0,0 3,5V7.7V16.4V19A2,2 0 0,0 5,21H7.7H16.4H19A2,2 0 0,0 21,19V16.3V7.7V5A2,2 0 0,0 19,3M15.6,17L12,13.4L8.4,17L7,15.6L10.6,12L7,8.4L8.4,7L12,10.6L15.6,7L17,8.4L13.4,12L17,15.6L15.6,17Z" />
          </svg>
        </i>
      </div>
    </transition>
    <form @submit.prevent="onSubmit">
      <div class="form-container">
        <div>
          <div class="fieldset">
            <span>Destinataire</span>
          </div>
          <div class="form-group">
            <input v-model="recipientName" type="text" placeholder="Noms du destinataire"/>
            <transition name="slide-down">
              <div v-if="errors['recipient.name'] && recipientNameMeta.touched" class="error-message">
                {{ errors['recipient.name'] }}
              </div>
            </transition>
          </div>
          <div class="form-group">
            <input v-model="recipientPhoneNumber" type="tel" placeholder="Téléphone du destinataire" />
            <transition name="slide-down">
              <div v-if="errors['recipient.phone_number'] && recipientPhoneNumberMeta.touched" class="error-message">
                {{ errors['recipient.phone_number'] }}
              </div>
            </transition>
          </div>
          <div class="fieldset">
            <span>Adresse de livraison</span>
          </div>
          <div class="form-group">
            <input v-model="city" type="text" placeholder="Ville" />
            <transition name="slide-down">
              <div v-if="errors['address.city'] && cityMeta.touched" class="error-message">
                {{ errors['address.city'] }}
              </div>
            </transition>
          </div>
          <div class="form-group">
            <input v-model="district" type="text" placeholder="Quartier" />
            <transition name="slide-down">
              <div v-if="errors['address.district'] && districtMeta.touched" class="error-message">
                {{ errors['address.district'] }}
              </div>
            </transition>
          </div>
          <div class="form-group">
            <input v-model="street" type="text" placeholder="Lieu-dit" />
            <transition name="slide-down">
              <div v-if="errors['address.street'] && streetMeta.touched" class="error-message">
                {{ errors['address.street'] }}
              </div>
            </transition>
          </div>
        </div>
        <div>
          <div class="fieldset">
            <span>Colis</span>
          </div>
          <div class="form-group">
            <input v-model="parcelName" type="text" placeholder="Nom du colis"/>
            <transition name="slide-down">
              <div v-if="errors['parcel.name'] && parcelNameMeta.touched" class="error-message">
                {{ errors['parcel.name'] }}
              </div>
            </transition>
          </div>
          <div class="form-group input-group">
            <div class="form-group">
              <input v-model.number="parcelVolume" type="text" placeholder="Volume" />
              <span class="input-prefix"><span class="unit">m<span class="cubic-meter">3</span></span></span>
              <transition name="slide-down">
                <div v-if="errors['parcel.volume'] && parcelVolumeMeta.touched" class="error-message">
                  {{ errors['parcel.volume'] }}
                </div>
              </transition>
            </div>
            <div class="form-group">
              <input v-model.number="amount" type="text" placeholder="Montant" />
              <span class="input-prefix">F cfa</span>
              <transition name="slide-down">
                <div v-if="errors.amount && amountMeta.touched" class="error-message">
                  {{ errors.amount }}
                </div>
              </transition>
            </div>
          </div>
          <div class="form-group">
            <textarea v-model="parcelDescription" rows="7" placeholder="Description" />
            <transition name="slide-down">
              <div v-if="errors['parcel.description'] && parcelDescriptionMeta.touched" class="error-message">
                {{ errors['parcel.description'] }}
              </div>
            </transition>
          </div>
          <div class="form-group">
            <input v-model="deliveryDate" type="text" placeholder="Date de livraison" />
            <small class="help">Exemple: 2022-02-25T16:43</small>
            <transition name="slide-down">
              <div v-if="errors.delivery_date && deliveryDateMeta.touched" class="error-message">
                {{ errors.delivery_date }}
              </div>
            </transition>
          </div>
        </div>
      </div>
      <div class="form-group">
        <button type="submit" class="btn btn-secondary" :disabled="isSubmitting">
          Créer une livraison
        </button>
      </div>
    </form>
  </div>
</template>

<style scoped>
.banner {
  margin: 0 12px;
}

.form-container {
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
  padding: 0 0 16px;
}

.form-container + .form-group {
  flex-direction: row;
}

@media (min-width: 768px) {
  .form-container {
    flex-direction: row;
  }

  .form-container > div:last-child,
  .form-container > div:first-child {
    width: 50%;
  }
}
</style>
