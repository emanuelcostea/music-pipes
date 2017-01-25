
exports.up = function(knex, Promise) {
    return Promise.all([
        knex.schema.createTable('sources', function(table){
            table.increments();
            table.string('name');
            table.string('path');
            table.integer('length');
            table.text('description');
            table.timestamp('created_at').defaultTo(knex.fn.now());
            table.timestamp('updated_at').defaultTo(knex.fn.now());
        }),
        knex.schema.createTable('rooms', function(table){
            table.increments();
            table.string('name');
            table.boolean('default').defaultTo(false);
            table.timestamp('created_at').defaultTo(knex.fn.now());
            table.timestamp('updated_at').defaultTo(knex.fn.now());
        }),
        knex.schema.createTable('sessions', function(table){
            table.increments();
            table.string('name');
            table.string('color');
            table.integer('expire');
            table.integer('room_id');
            table.boolean('connected').defaultTo(false);
            table.string('user_agent');
            table.timestamp('created_at').defaultTo(knex.fn.now());
            table.timestamp('updated_at').defaultTo(knex.fn.now());
        }),
        knex('rooms').insert({ name: 'Playground', default: true })

    ]);  
};

exports.down = function(knex, Promise) {
    return Promise.all([
        knex.schema.dropTable('sources'),
        knex.schema.dropTable('rooms'),
        knex.schema.dropTable('sessions')
    ]);  
};
