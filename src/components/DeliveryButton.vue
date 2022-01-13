<script setup>
import { ref, computed, defineProps } from 'vue'
import TModal from './TModal.vue'

const props = defineProps({
  type: {
    type: String,
    validator(value) {
      return ['deliver', 'cancel'].includes(value)
    },
    default: 'deliver'
  },
  action: {
    type: Function,
    required: true,
  },
  item: {
    type: Object,
    required: true,
  },
})

const okClassName = computed(() => {
  if (props.type === 'deliver') {
    return ['btn', 'btn-secondary']
  }

  if (props.type === 'cancel') {
    return ['btn', 'btn-danger']
  }

  return undefined
})

const modal = ref(false)

function cancel() {
  modal.value = false
}

function runAction() {
  Promise.resolve(props.action(props.item)).then(cancel)
}

</script>

<template>
  <t-modal v-model:modelValue="modal">
    <template v-slot:activator="{ on }">
      <button v-if="type === 'deliver'" class="btn btn-small btn-warning" v-on="on">
        Boucler
      </button>
      <button v-else-if="type === 'cancel'" class="btn btn-small btn-danger" v-on="on">
        Annuler
      </button>
    </template>
    <div class="modal-header">
      <h4 class="modal-title">
        <i class="icon">
          <svg viewBox="0 0 24 24">
            <path fill="currentColor" d="M11,18H13V16H11V18M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20M12,6A4,4 0 0,0 8,10H10A2,2 0 0,1 12,8A2,2 0 0,1 14,10C14,12 11,11.75 11,15H13C13,12.75 16,12.5 16,10A4,4 0 0,0 12,6Z" />
          </svg>
        </i>
        <template v-if="type === 'deliver'">
          Confirmer la livraison
        </template>
        <template v-else-if="type === 'cancel'">
          Confirmer l'annulation
        </template>
      </h4>
    </div>
    <div class="modal-content">
      <template v-if="type === 'deliver'">
        <p>
          Vous êtes sur le point de marquer le colis <strong>{{ item.parcel.name }}</strong> destiné à <strong>{{ item.recipient.name }}</strong> comme livré.
        </p>
        <p>Confirmer la livraison?</p>
      </template>
      <template v-else-if="type === 'cancel'">
        <p>
          Vous êtes sur le point d'annuler la livraison du colis <strong>{{ item.parcel.name }}</strong> destiné à <strong>{{ item.recipient.name }}</strong>.
        </p>
        <p>Confirmer l'annulation?</p>
      </template>
    </div>
    <div class="modal-footer">
      <button class="btn btn-default" @click="cancel">
        Non
      </button>
      <button :class="okClassName" @click="runAction">
        Oui
      </button>
    </div>
  </t-modal>
</template>

<style scoped>
.modal-header {
  padding: 6px;
}

.modal-title {
  font-weight: 500;
  line-height: 1.2;
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  margin: 0;
}

.icon {
  display: inline-flex;
  margin-right: 8px;
  color: #edba14;
}

.icon > svg {
  height: 32px;
  width: 32px;
}

.modal-content {
  padding: 8px 8px 8px 48px;
}

.modal-content p {
  margin: 0 0 18px;
}

.modal-content strong {
  font-weight: 500;
}

.modal-footer {
  padding: 4px 16px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

.modal-footer > * + * {
  margin-left: 12px;
}

</style>
