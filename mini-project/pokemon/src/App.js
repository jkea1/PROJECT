import React, { useState, useEffect } from 'react'
import axios from 'axios'

function App() {
  const [pikaUrl, setPikaUrl] = useState('')

  useEffect(() => {
    async function getPikachu() {
      const res = await axios.get('https://pokeapi.co/api/v2/pokemon/pikachu')
      const pikaUrl = res.data.sprites.other.home.front_default

      setPikaUrl(pikaUrl)
    }
    getPikachu()
  }, [])
  console.log(pikaUrl)
  return (
    <div>
      <img src={pikaUrl} alt='Pikachu' />
    </div>
  )
}

export default App

// import React, { useEffect, useState } from 'react'
// import './App.css'
// import axios from 'axios'

// function App() {
//   const [pikaUrl, setPikaUrl] = useState('')

//   useEffect(() => {
//     async function getPikachu() {
//       // try {
//       const res = await axios.get('https://pokeapi.co/api/v2/pokemon/pikachu')
//       const pikaUrl = res.data.sprites.other.home.front_default
//       setPikaUrl(pikaUrl)
//       //   } catch (error) {
//       //     console.error('Error fetching data:', error)
//       //   }
//     }
//     getPikachu()
//   }, [])

//   return (
//     <div>
//       <img src={pikaUrl} alt='Pikachu' />
//     </div>
//   )
// }

// export default App
