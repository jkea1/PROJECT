<script setup lang="ts">
import { useMovieStore } from '../store/movies'

const movieStore = useMovieStore()
console.log('모달', movieStore.movieDetail)
</script>

<template>
  <div class="movie-detail-area">
    <div class="image">
      <img
        :src="movieStore.$state.movieDetail.Poster"
        alt="영화 포스트" />
    </div>
    <div class="movie-info">
      <span>Title : {{ movieStore.$state.movieDetail.Title }}</span
      ><br />
      <span>Released : {{ movieStore.$state.movieDetail.Released }}</span
      ><br />
      <span>Runtime : {{ movieStore.$state.movieDetail.Runtime }}</span
      ><br />
      <span>Director : {{ movieStore.$state.movieDetail.Director }}</span
      ><br />
      <span>Writer : {{ movieStore.$state.movieDetail.Writer }}</span
      ><br />
      <span>Actors : {{ movieStore.$state.movieDetail.Actors }}</span
      ><br />
      <span>Awards : {{ movieStore.$state.movieDetail.Awards }}</span
      ><br />
      <span>Genre : {{ movieStore.$state.movieDetail.Genre }}</span
      ><br />
      <span>Plot : {{ movieStore.$state.movieDetail.Plot }}</span
      ><br />
      <ul>
        <li v-for="rating in movieStore.$state.movieDetail.Ratings">
          <span>{{ rating.Source }}</span
          ><br />
          <span>{{ rating.Value }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<style lang="scss">
.movie-detail-area {
  .image {
    img {
      display: block;
      margin: auto;
      width: 150px;
      height: calc(150px * 3 / 2);
    }
  }
  .movie-info {
    margin: 2%;
    padding: 10px;
    span {
      margin: 4%;
    }
  }
}
</style>
