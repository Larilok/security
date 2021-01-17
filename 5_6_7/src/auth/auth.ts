import argon2 from 'argon2'

import { IUserCredentials } from '../types'
import { createUser, getUser } from '../db/queries'
const FAKE_ARGON2 = '$argon2i$v=19$m=4096,t=3,p=1$P7WDeMgGqZikuTLIh2p9vA$6w9CAQpiMCx7CLLhrftHjkP66OVZjuYuVprbm2znUeo'
const VERSION = 1

export const addUser = async (userCredentials: IUserCredentials): Promise<boolean> => {
  const { login, password } = userCredentials
  if ((await getUser(login))[0]) {
    throw {
      statusCode: 400,
      message: 'User already exists'
    }
  }

  const hashedPassword = await hashPassword(password)
  return await createUser({
    login: login,
    password: hashedPassword,
    version: VERSION
  }) ? true : false
}

export const verifyUser = async (userCredentials: IUserCredentials) => {
  const { login, password } = userCredentials
  const user = (await getUser(login))[0]

  if (!user) {
    console.log('Wrong login')
    //timebase attacks protection
    await argon2.verify(FAKE_ARGON2, stringToArray(password))

    throw {
      statusCode: 400,
      message: 'Login or password is incorrect',
    }
  }

  if (!await argon2.verify(user.password, stringToArray(password))) {
    console.log('Wrong password')
    throw {
      statusCode: 400,
      message: 'Login or password is incorrect',
    }
  }

  return user
}

const getSalt = (argonHash: string): string => argonHash.split('$')[4]

const hashPassword = async (password: string): Promise<string> => {
  const argon = await argon2.hash(stringToArray(password))
  return argon
}

const stringToArray = (str: string): Buffer => {
  const array: number[] = str.split(',').map(v => Number(v))
  return Buffer.from(array)
}
