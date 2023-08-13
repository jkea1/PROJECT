import { defineStore } from 'pinia'
import axios from 'axios'

export type Movies = Movie[]

export interface Movie {
  Title: string
  Year: string
  imdbID: string
  Type: string
  Poster: string
}

export interface MovieDetail {
  Title: string
  Year: string
  Rated: string
  Released: string
  Runtime: string
  Genre: string
  Director: string
  Writer: string
  Actors: string
  Plot: string
  Language: string
  Country: string
  Awards: string
  Poster: string
  Ratings: {
    Source: string
    Value: string
  }[]
  Metascore: string
  imdbRating: string
  imdbVotes: string
  imdbID: string
  Type: string
  DVD: string
  BoxOffice: string
  Production: string
  Website: string
  Response: string
}

export const useMovieStore = defineStore('movie', {
  state: () => ({
    movies: [] as Movies,
    movieDetail: {} as MovieDetail
  }),
  getters: {
    filteredMovies(state) {
      return state.movies
        .filter((movie) => Number(movie.Year) > 2000)
        .sort((a, b) => Number(b.Year) - Number(a.Year))
    }
  },
  actions: {
    async fetchMovies(title: string) {
      const { data } = await axios.post('/api/movies', {
        title
      })
      const { Search } = data
      this.movies = Search
    },
    async fetchMovieDetail(imdbID: string) {
      console.log(imdbID)
      const { data } = await axios.post('/api/movies', {
        imdbID
      })
      console.log('store', data)

      this.movieDetail = data
    }
  }
})
