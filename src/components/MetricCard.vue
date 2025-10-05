<template>
  <div :class="['bg-white/10 rounded-lg border border-white/20 transition-all duration-200', mobile ? 'p-2' : 'p-3']">
    <div :class="['text-white/50', mobile ? 'text-xs' : 'text-xs']">{{ title }}</div>
    <div :class="['text-white font-semibold', mobile ? 'text-sm' : 'text-base']">
      {{ value }}{{ unit }}
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string
  value: number
  unit: string
  mobile?: boolean
}>()
</script>