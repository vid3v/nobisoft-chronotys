<script setup>
import { ref, readonly, provide, onUnmounted } from 'vue'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { getCurrentUser } from '../requests'

const user = ref(null)
const auth = getAuth()

const unsubscribe = onAuthStateChanged(auth, (data) => {
  if (data) {
    getCurrentUser().then((data1) => {
      user.value = data1
    })
  } else {
    user.value = data
  }
})

function getValue(obj, keys) {
  if (keys.length <= 1) {
    return obj
  }

  const key = keys.shift()

  return getValue(obj[key], keys)
}

function update(property, value) {
  const keys = property.split('.')
  const obj = getValue(user.value, keys)
  const key = keys.pop()

  obj[key] = value
}

provide('User', readonly(user))
provide('Update', update)

onUnmounted(() => {
  unsubscribe()
})

</script>

<template>
  <slot></slot>
</template>
