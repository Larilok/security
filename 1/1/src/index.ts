import { readFileSync } from 'fs'

const englishFrequencies = require(__dirname + '/../english-frequencies.json')
const task = readFileSync(__dirname + '/../secret.txt').toString().split('')


const englishFrequencyAnalysis = (text: string) =>
  Object.entries(englishFrequencies).reduce(
    (result, [symbol, expectedFrequency]: [string, number]) =>
      result +
      Math.pow(
        ((text.split(symbol).length - 1) / text.length -
          expectedFrequency),
        2),
    0
  )

const text = new Array(256)
  .fill('a')
  .map((value, index) =>
    task
      .map((symbol) => String.fromCharCode((symbol.charCodeAt(0) ^ index)))
      .join('')
  )
  .sort((text1, text2) => englishFrequencyAnalysis(text1) - englishFrequencyAnalysis(text2))

console.log(text[0])