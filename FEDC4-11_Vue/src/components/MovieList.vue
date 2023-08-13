<script setup lang="ts">
import { useMovieStore } from '../store/movies.ts'
import { useRouter } from 'vue-router'

const movieStore = useMovieStore()
const router = useRouter()

async function selectMovie(imdbID: string) {
  movieStore.fetchMovieDetail(imdbID).then(() => {
    console.log('watching')
    router.push(`/${imdbID}`)
  }) // await 필요 x
}
</script>

<template>
  <ul>
    <li
      v-for="movie in movieStore.filteredMovies"
      :key="movie.imdbID"
      @click="selectMovie(movie.imdbID)">
      <div class="movie-item-container">
        <img
          :src="movie.Poster"
          alt="Movie Poster" />
        <div class="title">
          {{ movie.Title }}
        </div>
      </div>
    </li>
  </ul>
</template>

<style lang="scss">
ul {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  justify-content: center;
  align-items: center;
  margin-top: 5%;
  .movie-item-container {
    display: flex;
    justify-content: center;
    text-align: center;
    flex-direction: column;
    img {
      display: block;
      margin: auto;
      width: 150px;
      height: calc(150px * 3 / 2);
      border-radius: 10px;
      background-color: lightgray;
      background-size: cover;
      background-position: center;
      position: relative;
      flex-shrink: 0;
    }
    .title {
      max-width: 200px;
      padding: 10px;
      margin: auto;
      text-align: center;
    }
  }
}
</style>
