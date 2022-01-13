import { reactive } from 'vue'

export default function () {
  return reactive({
    initiate: 'Initiée',
    processing: 'En cours',
    delivered: 'Livrée',
    cancelled: 'Annulée'
  })
}
