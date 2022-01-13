<script setup>
import { computed, defineProps, defineEmits } from 'vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
})
const emit = defineEmits(['update:modelValue'])

const modalOpen = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emit('update:modelValue', value)
  }
})

const activatorHandler = {
  click: openModal
}

function openModal() {
  modalOpen.value = true
}

</script>

<template>
  <slot name="activator" :open="modalOpen" :on="activatorHandler"></slot>
  <teleport to="body">
    <div v-if="modalOpen" class="modal-document">
      <div class="modal-body">
        <div class="modal-content">
          <slot></slot>
        </div>
      </div>
    </div>
  </teleport>
</template>

<style scoped>
.modal-document {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background-color: rgba(0, 0, 0, .1);
  font-family: "Roboto", "Helvetica Neue", Avenir, Arial, sans-serif;
  font-weight: 300;
  font-size: 1rem;
  color: #4a4d4e;
  z-index: 1200;
}

.modal-body {
  background-color: var(--white);
  width: 480px;
  margin: auto;
  margin-top: 120px;
  margin-bottom: 80px;
  border-radius: 4px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, .06);
  animation: slide-down 500ms;
}

.modal-content {
  padding: 16px;
  font-size: .98rem;
}
</style>
