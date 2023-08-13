<script setup lang="ts">
import MovieSearchBar from '~/components/MovieSearchBar.vue'
import MovieList from '~/components/MovieList.vue'
</script>

<template>
  <main>
    <MovieSearchBar />
    <MovieList />
  </main>
  <RouterView />
</template>
