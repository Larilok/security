import Knex from 'knex'

export const up = async (knex: Knex): Promise<void> => {
  const exists = await knex.schema.hasTable('banners')
  if (!exists) {
    await knex.schema.createTable('users', (table) => {
      table.increments('id')
      table.string('login').notNullable()
      table.string('password').notNullable()
      table.string('salt').notNullable()
    })
  }
}

export const down = async (knex: Knex): Promise<void> => {
  await knex.schema.dropTableIfExists('banners')
}
