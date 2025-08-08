/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
module.exports = {
  development: {
    client: 'mysql2',
    connection: {
      host: '127.0.0.1',         
      user: 'root',             
      password: '',             
      database: 'wik_genesis',
    },
    migrations: {
      directory: './migrations',
    },
    seeds: {
      directory: './seeds',    
    },
  },
};
