'use strict'

import fs from 'fs'

const h1 = fs.readFileSync('./hashes/md5.json', 'utf8')
const h2 = fs.readFileSync('./hashes/sha1Salt.json', 'utf8')
const h3 = fs.readFileSync('./hashes/scrypt.json', 'utf8')

const strToCSV = (string: string) => {
    let arr = string.split('},')
    arr = arr.map((el: any) => {
        el = el.split(',')
        el[0] = el[0].split(':')[1].slice(1, -1)
        if(el[1]) el[1] = el[1].split(':')[1].slice(1, -1)
        if(el[1]) return el[0] + ', ' + el[1]
        else return el[0]
    })
    return arr.join('\n')
}

strToCSV(h1)

fs.writeFileSync('./hashes/md5.csv', strToCSV(h1))
fs.writeFileSync('./hashes/sha1Salt.csv', strToCSV(h2))
fs.writeFileSync('./hashes/scrypt.csv', strToCSV(h3))