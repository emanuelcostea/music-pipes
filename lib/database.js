const config = require('../config/knexfile.js'),
    env = process.env.NODE_ENV === undefined ? 'development' : process.env.NODE_ENV,
    knex = require('knex')(config[env]);

module.exports = knex;

config[env].migrations.directory = 'migrations';

knex.migrate.latest(config[env]); 