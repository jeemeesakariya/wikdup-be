exports.up = function(knex) {
  return knex.schema.createTable('order_item_data', function(table) {
    table.increments('id').primary();
    table.integer('order_id').notNullable();
    table.integer('product_id').notNullable();
    table.integer('quantity').notNullable();
    table.decimal('price', 10, 2).notNullable();
    table.decimal('tax_rate', 5, 2).defaultTo(0);
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'));
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('order_item_data');
};
