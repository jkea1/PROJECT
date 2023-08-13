<script setup lang="ts">
import { ref } from 'vue'
import { useMovieStore } from '~/store/movies.ts'
import TheIcon from '~/components/TheIcon.vue'

const movieStore = useMovieStore()
const title = ref('')

async function searchMovies() {
  await movieStore.fetchMovies(title.value)
}

// function resetMovies() {
//   title.value = ''
//   movieStore.$reset()
//   console.log(movieStore.movies)
// }
</script>

<template>
  <div class="input-container shadow">
    <input
      v-model="title"
      @keydown.enter="searchMovies"
      placeholder="원하는 영화를 검색해 보세요!" />
    <TheIcon @click="searchMovies">search</TheIcon>
    <!-- <TheIcon @click="resetMovies">clear_all</TheIcon> -->
  </div>
</template>

<style scoped lang="scss">
.input-container {
  height: var(--item-height);
  width: 60%;
  margin: auto;
  // border: 10px solid;
  position: relative;
  :deep(.the-icon) {
    position: absolute;
    top: 0;
    bottom: 0;
    margin: auto;
    right: 24px;
    z-index: 1;
  }
  input {
    padding: 0 80px 0 20px;
    border: none;
    outline: none;
    border-radius: 20px;
    background-color: rgb(217, 239, 246);
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    &::placeholder {
      color: #ccc;
    }
  }
}
</style>
