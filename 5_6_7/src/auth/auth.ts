import argon2 from 'argon2'

import { IUserCredentials } from '../types'
import { createUser, getUser } from '../db/queries'


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
    salt: getSalt(hashedPassword)
  }) ? true : false
}

export const verifyUser = async (userCredentials: IUserCredentials) => {
  const { login, password } = userCredentials
  const user = (await getUser(login))[0]

  if (!user) {
    console.log('Wrong login')
    throw {
      statusCode: 400,
      message: 'Login or password is incorrect',
    }
  }

  if (!await await argon2.verify(user.password, stringToArray(password))) {
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
