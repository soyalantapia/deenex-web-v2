<template>
  <div class="flex items-center justify-between rounded-lg bg-white p-4 shadow-lg">
    <div class="flex items-center">
      <div class="mr-4">
        <slot name="icon"></slot>
      </div>
      <div>
        <p class="text-sm font-bold text-title-color">{{ value }}</p>
        <p class="text-xs text-tertiary">{{ label }}</p>
      </div>
    </div>
    <div v-if="change" class="text-xs" :class="changeColor">
      {{ change }}
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  value: {
    type: String,
    required: true,
  },
  label: {
    type: String,
    required: true,
  },
  change: {
    type: String,
    default: '',
  },
  changeType: {
    type: String,
    default: 'positive', // 'positive' or 'negative'
  },
})

const changeColor = computed(() => {
  return props.changeType === 'positive' ? 'text-green-500' : 'text-red-500'
})
</script>
