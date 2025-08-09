/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable('cart_item_data', function (table) {
    table.increments('id').primary();
    table.integer('user_id').unsigned().notNullable();
    table.integer('product_id').unsigned().notNullable();
    table.integer('quantity').notNullable();
    table.decimal('price', 10, 2).notNullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());

    // Foreign key constraints
    table.foreign('user_id').references('id').inTable('user_master_data').onDelete('CASCADE');
    table.foreign('product_id').references('id').inTable('product_master').onDelete('CASCADE');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable('cart_item_data');
};
