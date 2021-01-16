import type { IUserReturn } from './src/types'
import knex from './src/db/knex'
export const getUser = async (login:string):Promise<IUserReturn[]> => {
  return await knex.table('users').select()
}

getUser('a').then(v => console.log(v)).catch(e => console.log(e))