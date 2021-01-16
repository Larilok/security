import type { IUserInsert, IUserReturn } from '/../types'
import knex from './knex'

export const getUser = async (login:string):Promise<IUserReturn[]> => {
  return await knex.table('users').select().where('login', login)
}


export const createUser = async (user: IUserInsert):Promise<IUserReturn> => {
  const users = () => knex.table('users')
  const idOfInsertedUser = (await users().insert(user, ['id']) as [{id: string}])[0]
  return (await users()
    .select()
    .where({ id: idOfInsertedUser.id }) as IUserReturn[])[0]
}

// export interface IConnection {
//   getUser: typeof getUser,
//   createUser: typeof createUser
// }

// export const createQueriesInterface = async ():Promise<IConnection> => {
//   return {
//     getUser,
//     createUser
//   }
// }

// export default { createQueriesInterface }

