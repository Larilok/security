// Update with your config settings.
const dotenv = require('dotenv')
dotenv.config()

const { DATABASE, USERNAME, PASSWORD, HOST } = process.env

console.log(USERNAME)
module.exports = {
  client: 'pg',
  connection: {
    host: HOST,
    database: DATABASE,
    user: USERNAME,
    password: PASSWORD
  },
  migrations: {
    directory: __dirname + './src/db/migrations',
    tableName: 'knex_migrations'
  },
  seeds: {
    directory: __dirname + './src/db/seeds'
  },
  pool: {
    min: 1,
    max: 2 
  }
}

