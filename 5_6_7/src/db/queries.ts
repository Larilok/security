import type { IData, IUser, IEncryptedData } from '/../types'
import knex from './knex'

export const getUser = async (login: string): Promise<IUser[]> => {
  return await knex<IUser>('users').select().where('login', login)
}

export const createUser = async (user: IUser): Promise<IUser> => {
  const users = () => knex.table('users')
  const idOfInsertedUser = (await users().insert(user, ['id']) as [{ id: string }])[0]
  return (await users()
    .select()
    .where({ id: idOfInsertedUser.id }))[0]
}

export const getUserData = async (userId: number): Promise<IEncryptedData[]> => {
  return (await knex.table('user_data')
    .select()
    .where('user_id', userId))
}

export const setUserData = async (userId: number, data: IEncryptedData): Promise<any> => {
  // console.log(data.)
  return await knex.raw(`INSERT INTO user_data (user_id, field, value, nonce, "authTag")
          VALUES (${userId}, '${data.field}', '${data.value}', '${data.nonce}', '${data.authTag}')
          ON CONFLICT (user_id, field) DO UPDATE SET value = EXCLUDED.value, nonce = EXCLUDED.nonce,
          "authTag" = EXCLUDED."authTag"`)
}
