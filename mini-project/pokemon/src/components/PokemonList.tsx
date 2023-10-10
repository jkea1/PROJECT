import React from 'react'
import axios from 'axios'

const PokemonList = async () => {
  const pika = await axios.get('https://pokeapi.co/api/v2/pokemon/pikachu')
  const pikaImg = pika.data.sprites.front_default
  console.log('pika', pika.data.sprites.front_default)

  return (
    <div>
      <div className='pikachu'>
        <img src={pikaImg} alt='' style={{ width: '100px', height: '100px' }} />
      </div>
    </div>
  )
}

export default PokemonList
