/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable('product_images', function (table) {
    table.increments('id').primary();
    table.integer('product_id').unsigned().notNullable();
    table.string('image_url', 500).notNullable();
    table.integer('sort_order').defaultTo(0);
    table.timestamp('created_at').defaultTo(knex.fn.now());
    
    // Foreign key constraint
    table.foreign('product_id').references('id').inTable('product_master').onDelete('CASCADE');
    
    // Index for better performance
    table.index('product_id');
    table.index('sort_order');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable('product_images');
};
