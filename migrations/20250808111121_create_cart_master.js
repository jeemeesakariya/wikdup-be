exports.up = function(knex) {
  return knex.schema.createTable('cart_master', function(table) {
    table.increments('id').primary();
    table.integer('user_id').notNullable();
    table.enum('status', ['active', 'ordered']).defaultTo('active');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'));
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('cart_master');
};
