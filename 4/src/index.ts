'use strict'

import crypto from 'crypto'
import fs from 'fs'

const letters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
const digits = '0123456789'
const symbols = '!?$*'
const all = letters + digits + symbols
const numsSyms = digits + symbols

const top1 = fs.readFileSync('../passlists/top100.txt', 'utf8').split('\r\n')
const top2 = fs.readFileSync('../passlists/top1000000.txt', 'utf8').split('\n')

const getRand = (min: number, max: number) => Math.floor(Math.random() * (max - min) + min)

const getRandPass = () => {
    let pass = ''
    const len = getRand(8, 25)
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

const genXPasswords = (passAmount: number) => {
    const rand = getRand(0, 101)
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

interface IHash {
    hash: string,
    salt?: string
}

interface IHashFunction {
    name: string
    hash(pass: string): IHash
}

class Scrypt implements IHashFunction {
    name: string
    constructor(name: string) {
        this.name = name
    }
    hash(pass: string) {
        const salt = getSalt()
        return {
            hash: crypto.scryptSync(pass, salt, 64).toString('hex'),
            salt: salt
        }
    }
}

class MD implements IHashFunction {
    name: string
    withSalt: boolean
    constructor(name: string, withSalt: boolean) {
        this.name = name
        this.withSalt = withSalt
    }

    hash(pass: string) {
        const hash = crypto.createHash(this.name)
        if (this.withSalt) {
            const salt = getSalt()
            hash.update(pass + salt)
            return { hash: hash.digest('hex'), salt: salt }
        } else {
            hash.update(pass)
            return { hash: hash.digest('hex') }
        }
    }
}
class SHA implements IHashFunction {
    name: string
    withSalt: boolean
    constructor(name: string, withSalt: boolean) {
        this.name = name
        this.withSalt = withSalt
    }
    hash(pass: string) {
        const hash = crypto.createHash(this.name)
        if (this.withSalt) {
            const salt = getSalt()
            hash.update(pass + salt)
            return { hash: hash.digest('hex'), salt: salt }
        } else {
            hash.update(pass)
            return { hash: hash.digest('hex') }
        }
    }
}

const getSalt = () => crypto.randomBytes(16).toString('hex')

const hashPasswordsWithX = (passs: string[], hashFunc: IHashFunction) => {
    return passs.map(pass => hashFunc.hash(pass))
}

const stringifyHashes = (passs: ReturnType<typeof hashPasswordsWithX>) => {
    return passs.map(pass => JSON.stringify(pass)).toString()
}

const main = () => {
    const passsRaw = [0, 0, 0].map(el => {
        return genXPasswords(100000)
    })

    fs.writeFileSync('./hashes/md5.json', stringifyHashes(hashPasswordsWithX(passsRaw[0], new MD('md5', false))))
    fs.writeFileSync('./hashes/sha1Salt.json', stringifyHashes(hashPasswordsWithX(passsRaw[0], new SHA('sha1', true))))
    fs.writeFileSync('./hashes/scrypt.json', stringifyHashes(hashPasswordsWithX(passsRaw[0], new Scrypt('scrypt'))))
}

main()