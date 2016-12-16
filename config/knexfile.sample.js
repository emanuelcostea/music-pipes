// Update with your config settings.

/**
 * npm install -g knex
 * knex migrate:make [migration_name] --knexfile ./config/knexfile.js
 * knex migrate:latest  
 * knex migrate:rollback  
 * knex migrate:currentVersion
 */
module.exports = {

  development: {
    client: 'mysql',
    connection: {
      host:     '127.0.0.1',
      database: 'musicpipes',
      user:     '',
      password: ''
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'migrations',
      directory: '../migrations'
    }
  }

};
