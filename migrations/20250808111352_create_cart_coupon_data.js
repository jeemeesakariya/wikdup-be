exports.up = function(knex) {
  return knex.schema.createTable('cart_coupon_data', function(table) {
    table.increments('id').primary();
    table.integer('cart_id').notNullable();
    table.integer('coupon_id').notNullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'));
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('cart_coupon_data');
};
