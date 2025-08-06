/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable('product_master', function (table) {
    table.increments('id').primary();
    table.integer('sku_id').unsigned().notNullable();
    table.string('product_name', 255).notNullable();
    table.decimal('mrp', 10, 2).notNullable();
    table.decimal('cost_price', 10, 2).notNullable();
    table.decimal('gst_percent', 5, 2).notNullable();
    table.string('packaging_type', 100);
    table.boolean('is_active').defaultTo(true);
    table.string('approval_status', 1).defaultTo('P');
    table.integer('created_by').unsigned().notNullable();
    table.integer('approved_by').unsigned();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
    
    // Foreign key constraints
    table.foreign('sku_id').references('id').inTable('sku_master').onDelete('CASCADE');
    
    // Indexes for better performance
    table.index('sku_id');
    table.index('is_active');
    table.index('approval_status');
    table.index('created_by');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable('product_master');
};
