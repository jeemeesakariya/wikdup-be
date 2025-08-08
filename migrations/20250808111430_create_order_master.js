exports.up = function(knex) {
  return knex.schema.createTable('order_master', function(table) {
    table.increments('id').primary();
    table.integer('user_id').notNullable();
    table.integer('address_id').notNullable();
    table.integer('cart_id').notNullable();
    table.decimal('subtotal', 10, 2).notNullable();
    table.decimal('tax_total', 10, 2).notNullable();
    table.decimal('discount_total', 10, 2).defaultTo(0);
    table.decimal('total_amount', 10, 2).notNullable();
    table.enum('payment_status', ['pending', 'paid', 'failed']).defaultTo('pending');
    table.enum('order_status', ['placed', 'shipped', 'delivered', 'cancelled']).defaultTo('placed');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'));
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('order_master');
};
