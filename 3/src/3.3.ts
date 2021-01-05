import { createAcc, bet } from './casino'

import { MersenneTwister } from './mersenne'

async function getInternalState(id: number, mode: string): Promise<number[]> {
  let state = [];
  for (let i = 0; i < 624; i++) {
    if (i % 100 === 0) console.log(i);
    const { realNumber } = await bet(id, 1, 1, mode)
    state.push(realNumber)
  }

  return state
}

function untemper(tempered: number): number {
  tempered = tempered << 0
  tempered ^= (tempered >>> 18)
  tempered ^= (tempered << 15) & 0xefc60000
  tempered ^= ((tempered << 7) & 0x9d2c5680) ^ ((tempered << 14) & 0x94284000) ^ ((tempered << 21) & 0x14200000) ^ ((tempered << 28) & 0x10000000)
  tempered ^= (tempered >>> 11) ^ (tempered >>> 22)
  return tempered
}

function untemperState(tempered: number[]): number[] {
  const state = []

  for (let i = 0; i < 624; i++) {
    state.push(untemper(tempered[i]))
  }
  return state
}

const MtSucks = async () => {
  const mode = 'BetterMt'
  const rnd = Math.ceil(Math.random() * 10000)
  const id = await createAcc(rnd)

  const state = await getInternalState(id, mode)

  let untempered = await untemperState(state)

  const twister = new MersenneTwister(0, untempered)
  const num = twister.genrand_int32()
  console.log(num)
  console.log(await bet(id, 1, num, mode))
  console.log(await bet(id, 1375, twister.genrand_int32(), mode))

}

MtSucks()