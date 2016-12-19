
exports.up = function(knex, Promise) {
    return Promise.all([
        knex.schema.createTable('sources', function(table){
            table.increments();
            table.binary('content');
            table.string('name');
            table.text('description');
            table.timestamp('created_at').defaultTo(knex.fn.now());
            table.timestamp('updated_at').defaultTo(knex.fn.now());
        }),
        knex.schema.createTable('rooms', function(table){
            table.increments();
            table.string('name');
            table.timestamp('created_at').defaultTo(knex.fn.now());
            table.timestamp('updated_at').defaultTo(knex.fn.now());
        })

    ]);  
};

exports.down = function(knex, Promise) {
    return Promise.all([
        knex.schema.dropTable('sources'),
        knex.schema.dropTable('library'),
        knex.schema.dropTable('rooms')
    ]);  
};
