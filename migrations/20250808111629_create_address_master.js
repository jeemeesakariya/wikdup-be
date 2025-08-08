exports.up = function(knex) {
  return knex.schema.createTable('address_master', function(table) {
    table.increments('id').primary();
    table.integer('user_id').notNullable();
    table.string('address_line1', 255).notNullable();
    table.string('address_line2', 255);
    table.string('city', 100).notNullable();
    table.string('state', 100).notNullable();
    table.string('pincode', 10).notNullable();
    table.string('country', 100).defaultTo('India');
    table.boolean('is_default').defaultTo(false);
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'));
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('address_master');
};
