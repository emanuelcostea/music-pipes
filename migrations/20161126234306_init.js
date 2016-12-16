
exports.up = function(knex, Promise) {
    return Promise.all([

        knex.schema.createTable('sources', function(table){
            table.increments();
            table.binary('content');
            table.string('name');
            table.text('description');
            table.timestamps(true);
        }),
        knex.schema.createTable('library', function(table){
            table.increments();
            table.integer('source_id').unsigned().references('id').inTable('sources');
            table.string('name');
            table.string('file_path');
            table.string('file_type', 50);
            table.timestamps(true);
        }),
        knex.schema.createTable('rooms', function(table){
            table.increments();
            table.string('name');
            table.timestamps(true);
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
