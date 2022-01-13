<script setup>
import { ref, onBeforeMount } from 'vue'
import { useForm, useField } from 'vee-validate'
import { toFormValidator } from '@vee-validate/zod'
import * as zod from 'zod'
import dateFormat from 'dateformat'
import { where, Timestamp } from 'firebase/firestore'
import frLocale from 'ant-design-vue/lib/locale/fr_FR'
import { getDeliveries, updateDeliveryStatus } from '../../requests'
import useStatus from '../../composables/status'
import DeliveryButton from '../../components/DeliveryButton.vue'

const statusMap = useStatus()

const statusOptions = [
  {
    label: 'Tous',
    value: 'all'
  },
  {
    label: 'Initiée',
    value: 'initiate'
  },
  {
    label: 'En-cours',
    value: 'processing'
  },
  {
    label: 'Livrée',
    value: 'delivered'
  },
  {
    label: 'Annulée',
    value: 'cancelled'
  }
]

const columns = ref([
  {
    title: 'Date de création',
    dataIndex: 'created_at',
    width: 200,
    align: 'right'
  },
  {
    title: 'Noms du destinataire',
    dataIndex: ['recipient', 'name'],
    width: 220,
    resizable: true
  },
  {
    title: 'Téléphone du destinataire',
    dataIndex: ['recipient', 'phone_number'],
    width: 200,
    align: 'center',
    resizable: true
  },
  {
    title: 'Adresse de livraison',
    dataIndex: 'address',
    width: 240,
    ellipsis: true,
    slots: { customRender: 'address' },
  },
  {
    title: 'Nom du colis',
    dataIndex: ['parcel', 'name'],
    width: 220,
    resizable: true,
    ellipsis: true
  },
  {
    title: 'Volume du colis',
    dataIndex: ['parcel', 'volume'],
    width: 140,
    align: 'center',
    resizable: true,
    slots: { customRender: 'volume' }
  },
  {
    title: 'Description du colis',
    dataIndex: ['parcel', 'description'],
    width: 320,
    resizable: true,
    ellipsis: true
  },
  {
    title: 'Montant à collecter',
    dataIndex: 'amount',
    align: 'center',
    width: 140,
    slots: { customRender: 'amount' }
  },
  {
    title: 'Date de livraison',
    dataIndex: 'delivery_date',
    align: 'right',
    width: 200,
    resizable: true,
  },
  {
    title: 'Statut',
    dataIndex: 'status',
    align: 'center',
    fixed: 'right',
    width: 110,
    slots: { customRender: 'status' }
  },
  {
    title: 'Action',
    key: 'action',
    width: 110,
    align: 'center',
    fixed: 'right',
    slots: { customRender: 'action' },
  }
])
const deliveries = ref([])

const validationSchema = toFormValidator(
    zod.object({
      status: zod.optional(
          zod.enum(['all', 'initiate', 'processing', 'delivered', 'cancelled'])
      ),
      delivery_start_date: zod.optional(
          zod.string()
              .superRefine((value, ctx) => {
                const { success } = zod.date().safeParse(new Date(value))

                if (value && (!/^\d{4}-\d{1,2}-\d{1,2}$/.test(value) || !success)) {
                  ctx.addIssue({
                    code: zod.ZodIssueCode.invalid_date,
                    message: 'Date de début invalide',
                    fatal: true,
                  })
                }
              })
              .superRefine((value, ctx) => {
                if (values.delivery_end_date) {
                  const date1 = new Date(values.delivery_start_date)
                  const date2 = new Date(values.delivery_end_date)
                  const { success } = zod.date().safeParse(date2)

                  if (success && date1.getTime() > date2.getTime()) {
                    ctx.addIssue({
                      code: zod.ZodIssueCode.custom,
                      message: 'La date de début doit inférieure à la date de fin'
                    })
                  }
                }
              })
      ),
      delivery_end_date: zod.optional(
          zod.string()
              .superRefine((value, ctx) => {
                const { success } = zod.date().safeParse(new Date(value))

                if (value && (!/^\d{4}-\d{1,2}-\d{1,2}$/.test(value) || !success)) {
                  ctx.addIssue({
                    code: zod.ZodIssueCode.invalid_date,
                    message: 'Date de fin invalide',
                    fatal: true
                  })
                }
              })
              .superRefine((value, ctx) => {
                if (values.delivery_start_date) {
                  const date1 = new Date(values.delivery_start_date)
                  const date2 = new Date(values.delivery_end_date)
                  const { success } = zod.date().safeParse(date1)

                  if (success && date1.getTime() > date2.getTime()) {
                    ctx.addIssue({
                      code: zod.ZodIssueCode.custom,
                      message: 'La date de fin doit supérieure à la date de début'
                    })
                  }
                }
              })
      ),
      city: zod.optional(zod.string()),
      district: zod.optional(zod.string())
    }).strict()
)

const { handleSubmit, isSubmitting, values, errors } = useForm({
  validationSchema,
  initialValues: {
    status: 'all',
    delivery_start_date: undefined,
    delivery_end_date: undefined,
    city: '',
    district: ''
  }
})

const { value: status } = useField('status', undefined, { validateOnValueUpdate: false })
const { value: startDate } = useField('delivery_start_date', undefined, { validateOnValueUpdate: false })
const { value: endDate } = useField('delivery_end_date', undefined, { validateOnValueUpdate: false })
const { value: city } = useField('city', undefined, { validateOnValueUpdate: false })
const { value: district } = useField('district', undefined, { validateOnValueUpdate: false })

const onSubmit = handleSubmit((values) => {
  const {
    status,
    delivery_start_date: startDateString,
    delivery_end_date: endDateString,
    city,
    district
  } = values
  const queries = []

  if (status !== 'all') {
    queries.push(where('status', '==', status))
  }

  if (startDateString) {
    const timestamp = Timestamp.fromDate(new Date(startDateString))

    queries.push(where('delivery_date', '>=', timestamp))
  }

  if (endDateString) {
    const timestamp = Timestamp.fromDate(new Date(endDateString))

    queries.push(where('delivery_date', '<=', timestamp))
  }

  if (city) {
    queries.push(where('address.city', '==', city))
  }

  if (district) {
    queries.push(where('address.district', '==', district))
  }

  getDeliveries(...queries).then((data) => {
    deliveries.value = formatData(data)
  })
})

function formatData(data) {
  return data.map((delivery) => {
    return Object.assign({}, delivery, {
      delivery_date: dateFormat(delivery.delivery_date.toDate()),
      created_at: dateFormat(delivery.created_at.toDate())
    })
  })
}

function formatAddress(address) {
  const { city, district, street } = address
  return [street, district, city].join(', ')
}

function formatAmount(amount) {
  const formatter = new Intl.NumberFormat('cm-FR', { style: 'currency', currency: 'XOF' })
  return formatter.format(amount)
}

function fetchDeliveries() {
  getDeliveries().then((data) => {
    deliveries.value = formatData(data)
  })
}

async function processDelivery(delivery) {
  try {
    await updateDeliveryStatus(delivery, 'processing')
    fetchDeliveries()
  } catch (error) {
    console.log(error)
  }
}

async function complete(delivery) {
  try {
    await updateDeliveryStatus(delivery, 'delivered')
    fetchDeliveries()
  } catch (error) {
    console.log(error)
  }
}

onBeforeMount(fetchDeliveries)

</script>

<template>
  <div class="container">
    <h3 class="subtitle">Liste des livraisons</h3>
    <a-config-provider :locale="frLocale">
      <div class="wrapper">
        <a-table
          row-key="id"
          bordered
          sticky
          size="small"
          :columns="columns"
          :data-source="deliveries"
          :pagination="false"
          :scroll="{ x: 2200, y: 720 }"
        >
          <template #title>
            <div class="table-header">
              <h4 class="heading">Filtres</h4>
              <div class="filters-container">
                <form class="inline-form" @submit.prevent="onSubmit">
                  <div class="form-group">
                    <label>Statut:</label>
                    <select v-model="status">
                      <option
                          v-for="option in statusOptions"
                          :key="option.value"
                          :title="option.label"
                          :value="option.value"
                      >
                        {{ option.label }}
                      </option>
                    </select>
                  </div>
                  <div class="form-group">
                    <label>Date de livraison:</label>
                    <div class="input-group-range-wrapper">
                      <div class="input-group-range">
                        <input v-model="startDate" type="text" placeholder="Début" class="input-date-start">
                        <span class="separator">-</span>
                        <input v-model="endDate" type="text" placeholder="Fin" class="input-date-end">
                      </div>
                      <transition name="slide-down">
                        <div v-if="errors.delivery_start_date || errors.delivery_end_date" class="error-message">
                          {{ errors.delivery_start_date ? errors.delivery_start_date : errors.delivery_end_date }}
                        </div>
                      </transition>
                    </div>
                  </div>
                  <div class="form-group">
                    <label for="city">Ville:</label>
                    <input v-model="city" type="text" id="city" placeholder="Ville">
                  </div>
                  <div class="form-group">
                    <label for="district">Quartier:</label>
                    <input v-model="district" type="text" id="district" placeholder="Quartier">
                  </div>
                  <div class="form-group">
                    <button type="submit" class="btn btn-primary btn-small" :disabled="isSubmitting">
                      Rechercher
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </template>
          <template #address="{ text: address }">
            <span>{{ formatAddress(address) }}</span>
          </template>
          <template #status="{ text }">
            <span :class="['status', `${text}-status`]">{{ statusMap[text] }}</span>
          </template>
          <template #amount="{ text }">
            <span>{{ formatAmount(text) }}</span>
          </template>
          <template #volume="{ text }">
            <span class="label label-volume">{{ text }}</span>
            <span class="unit">m<span class="cubic-meter">3</span></span>
          </template>
          <template #action="{ record }">
            <button
              v-if="record.status === 'initiate'"
              class="btn btn-info btn-small"
              @click="processDelivery(record)"
            >
              Livrer
            </button>
            <delivery-button
              v-if="record.status === 'processing'"
              type="deliver"
              :item="record"
              :action="complete"
            />
          </template>
        </a-table>
      </div>
    </a-config-provider>
  </div>
</template>

<style scoped>
.wrapper {
  border-radius: 3px;
  border-bottom: 1px solid #f0f0f0;
  border-right: 1px solid #f0f0f0;
  border-left: 1px solid #f0f0f0;
}

.container .subtitle {
  padding: 4px 6px 12px;
}

button + button {
  margin-left: 10px;
}

.table-header {
  padding: 8px 6px;
}

.heading {
  position: relative;
  margin-top: 0;
  margin-bottom: 10px;
  font-size: 0.96rem;
  font-weight: 500;
  padding: 0 10px;
}

.heading::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  height: 1.5rem;
  width: 4px;
  background-color: #9a29db;
  border-radius: 2px;
}

.inline-form .form-group select {
  width: 100px;
  appearance: none;
  cursor: pointer;
}
</style>
