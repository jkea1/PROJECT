<script setup lang="ts">
const emit = defineEmits(['close'])
//emit: 이벤트를 정의
function close() {
  emit('close')
}
</script>
<template>
  <button
    @click="close()"
    style="all: unset">
    <slot></slot>
  </button>
</template>
