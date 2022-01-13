<script setup>
import { ref, onBeforeMount } from 'vue'
import dateFormat from 'dateformat'
import frLocale from 'ant-design-vue/lib/locale/fr_FR'
import { fetchDeliveries as getDeliveries, updateDeliveryStatus } from '../../requests'
import useStatus from '../../composables/status'
import DeliveryButton from '../../components/DeliveryButton.vue'

const statusMap = useStatus()

const columns = ref([
  {
    title: 'Date de création',
    dataIndex: 'created_at',
    tooltip: {
      placement: 'bottomLeft'
    },
    width: 180,
    align: 'right',
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
    align: 'center'
 ,   resizable: true
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
    width: 160,
    slots: { customRender: 'amount' }
  },
  {
    title: 'Date de livraison',
    dataIndex: 'delivery_date',
    align: 'right',
    width: 190,
    resizable: true,
  },
  {
    title: 'Statut',
    dataIndex: 'status',
    align: 'center',
    fixed: 'right',
    width: 100,
    slots: { customRender: 'status' }
  },
  {
    title: 'Action',
    key: 'action',
    width: 105,
    align: 'center',
    fixed: 'right',
    slots: { customRender: 'action' },
  }
])
const deliveries = ref([])

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

async function cancelDelivery(delivery) {
  try {
    await updateDeliveryStatus(delivery, 'cancelled')
    fetchDeliveries()
  } catch (error) {
    console.log(error)
  }
}

onBeforeMount(() => {
  fetchDeliveries()
})

</script>

<template>
  <div class="container">
    <h3 class="subtitle">Mes livraisons</h3>
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
            <delivery-button
              v-if="record.status === 'initiate'"
              type="cancel"
              :item="record"
              :action="cancelDelivery"
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
  border: 1px solid #f0f0f0;
}

.container .subtitle {
  padding: 15px 6px;
}
</style>
