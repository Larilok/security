import crypto from 'crypto'

import { IEncryptedData } from '../types'

const dotenv = require('dotenv')
dotenv.config()
const NONCE_LENGTH = 12
const ALG = 'chacha20-poly1305'

export const encrypt = (userId: number, value: string): IEncryptedData => {
  const nonce = crypto.randomBytes(NONCE_LENGTH)
  const cipher = crypto.createCipheriv(
    ALG,
    Buffer.from(process.env.KEY, 'hex'),
    nonce,
    {
      authTagLength: 16,
    })

  cipher.setAAD(Buffer.from(userId.toString().padStart(16)), {
    plaintextLength: 0
  })
  const secret = cipher.update(value)
  cipher.final()
  const authTag = cipher.getAuthTag()
  return {
    nonce: nonce.toString('hex'),
    value: secret.toString('hex'),
    authTag: authTag.toString('hex')
  }
}

export const decrypt = (userId: number, data: IEncryptedData) => {
  const decipher = crypto.createDecipheriv(
    ALG,
    Buffer.from(process.env.KEY, 'hex'),
    Buffer.from(data.nonce, 'hex'),
    {
      authTagLength: 16,
    })

  decipher.setAAD(Buffer.from(userId.toString().padStart(16)), {
    plaintextLength: 0
  })
  decipher.setAuthTag(Buffer.from(data.authTag, 'hex'))
  const value = decipher.update(Buffer.from(data.value, 'hex'))
  try {
    decipher.final()
  } catch(e) {
    console.log(e)
    return null
  }
  return value.toString('utf-8')
}
