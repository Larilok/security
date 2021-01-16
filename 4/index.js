'use strict'

const crypto = require('crypto')
const fs = require('fs')

const letters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
const digits = '0123456789'
const symbols = '!?$*'
const all = letters + digits + symbols
const numsSyms = digits + symbols

const top1 = fs.readFileSync('./passlists/top100.txt', 'utf8').split('\r\n')
const top2 = fs.readFileSync('./passlists/top1000000.txt', 'utf8').split('\n')

const getRand = (min, max) => Math.floor(Math.random() * (max - min) + min)

//is it faster to do it like that or Array(len).map(...).join('')?
const getRandPass = () => {
    let pass = ''
    const len = getRand(0, 40)
    for (let i = 0; i < len; i++) {
        pass += all[getRand(0, all.length)]
    }
    return pass
}

const getHumanPass = () => {
    const pos = getRand(0, top2.length)
    let pass = top2[pos]
    const numsSymsAm = getRand(4, 9)
    for (let i = 0; i < numsSymsAm; i++) {
        const slicePos = getRand(0, pass.length)
        pass = pass.slice(0, slicePos) + numsSyms[getRand(0, numsSyms.length)] + pass.slice(slicePos)
    }
    return pass
}

const genXPasswords = (passAmount) => {
    const rand = 70//getRand(0, 101)
    let passwordsRaw = []
    for (let i = 0; i < passAmount; i++) {
        switch (true) {
            case rand <= 5:
                const pos1 = getRand(0, top1.length)
                passwordsRaw.push(top1[pos1])
                break
            case rand <= 75:
                const pos2 = getRand(0, top2.length)
                passwordsRaw.push(top2[pos2])
                break
            case rand <= 80:
                passwordsRaw.push(getRandPass())
                break
            case rand <= 100:
                passwordsRaw.push(getHumanPass())
                break
        }
    }
    return passwordsRaw
}

const getSalt = () => crypto.randomBytes(16).toString('hex')

const hashPasswordsWithX = (passs, hashFunc, saltNeeded) => {
    return passs.map(pass => {
        if (hashFunc === 'scrypt') {
            const salt = getSalt()
            return {hash: crypto.scryptSync('password', salt, 64).toString('hex'),
                salt: salt}
        } else if (hashFunc.slice(0, 2) === 'md' || hashFunc.slice(0, 3) === 'sha') {
            const hash = crypto.createHash(hashFunc)
            if (saltNeeded) {
                const salt = getSalt()
                hash.update(pass + salt)
                return {hash: hash.digest('hex'), salt: salt}
            } else {
                hash.update(pass)
                return {hash: hash.digest('hex')}
            }
        } else {
            throw new Error(`Don't know this algorithm`)
        }
    })
}

const stringifyHashes = (passs) => {
    return passs.map(pass => JSON.stringify(pass)).toString()
}

const main = () => {
    const passsRaw = [0,0,0].map(el => {
        return genXPasswords(100000)
    })

    fs.writeFileSync('./hashes/md5.json', stringifyHashes(hashPasswordsWithX(passsRaw[0], 'md5', false)))
    fs.writeFileSync('./hashes/sha1Salt.json', stringifyHashes(hashPasswordsWithX(passsRaw[0], 'sha1', true)))
    fs.writeFileSync('./hashes/scrypt.json', stringifyHashes(hashPasswordsWithX(passsRaw[0], 'scrypt')))
}

main()