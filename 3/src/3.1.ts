import { ToInt32, createAcc, bet } from './casino'

const a = 1664525
const c = 1013904223
const m = 2**32

const nextGenerator = (last:number): () => number => {
  const next = () => {
    const nextValue = (a*last + c) % (m)
    last = ToInt32(nextValue)
    return last
  }

  return next
}

const LcgSucks = async() => {
  const mode = 'Lcg'
  const rnd = Math.ceil(Math.random() * 10000)
  const id = await createAcc(rnd) 
  const {realNumber: seed} = await bet(id, 1, 1, mode);
  const generateNext = nextGenerator(seed);

  await bet(id, 999, generateNext(), mode)  
  
  await bet(id, 1000, generateNext(), mode)
} 

LcgSucks()
