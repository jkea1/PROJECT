<script setup lang="ts">
import { onMounted } from 'vue'

onMounted(() => {
  console.log('skeleton')
})
</script>

<template>
  <div class="movie-detail-area">
    <div class="image">
      <img />
    </div>
    <div class="movie-info">
      <span />
      <span />
      <span />
      <span />
      <span />
      <span />
      <span />
      <span />
      <span />
      <ul>
        <li>
          <span />
          <span />
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.movie-detail-area {
  width: 200px;
  height: 300px; /* 임시 */
  background-color: blue;
  animation: pulse-bg 1s infinite;
  z-index: 10000;
}

@keyframes pulse-bg {
  0% {
    background-color: #eee;
  }
  50% {
    background-color: rgb(11, 215, 113);
  }
  100% {
    background-color: #eee;
  }
}
</style>
