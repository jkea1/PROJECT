import type { VercelRequest, VercelResponse } from '@vercel/node'
import axios from 'axios'

const { APIKEY } = process.env

export default async function (req: VercelRequest, res: VercelResponse) {
  const { title = '', method = 'GET', imdbID = '' } = req.body

  if (imdbID !== '') {
    const { data: responseValue } = await axios({
      url: `https://omdbapi.com?apikey=${APIKEY}&i=${imdbID}&plot=full`,
      method
    })
    res.status(200).json(responseValue)
  } else {
    const { data: responseValue } = await axios({
      url: `https://omdbapi.com?apikey=${APIKEY}&s=${title}`,
      method
    })
    res.status(200).json(responseValue)
  }
}
