import { createAcc, bet } from './casino'

import { MersenneTwister } from './mersenne'

function findTheTwister(otherFirstValue:number) {
  let goodTwister
  const start = Math.floor(Date.now()/1000)

  for (let i = 0; i < 5; i++) {
    const twister = new MersenneTwister(start+i)
    let firstValue = twister.genrand_int32()
    console.log(firstValue)

    if(firstValue === otherFirstValue) {
      console.log(`Found`)
      goodTwister = twister
      return goodTwister
    }
  }
  if(!goodTwister) {
    console.log(`Couldn't find the correct twister`)
    process.exit()
  }
}

const MtWithSeedAsTimeSucks = async() => {
  const mode = 'Mt'
  const rnd = Math.ceil(Math.random() * 10000)
  const id = await createAcc(rnd) 
  const {realNumber: seed} = await bet(id, 1, 1, mode)
  
  const twister = findTheTwister(seed)
  await bet(id, 999, twister.genrand_int32(), 'Mt')
  await bet(id, 1000, twister.genrand_int32(), 'Mt')
} 

MtWithSeedAsTimeSucks()
