/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable('product_master', function (table) {
    table.increments('id').primary();

    // Core fields
    table.integer('sku_id').unsigned().notNullable();
    table.string('product_name', 255).notNullable();
    table.decimal('mrp', 10, 2).notNullable();
    table.decimal('cost_price', 10, 2).notNullable();
    table.decimal('gst_percent', 5, 2).notNullable();
    table.string('packaging_type', 100);

    // Status and tracking
    table.boolean('is_active').defaultTo(true);
    table.enu('approval_status', ['P', 'A', 'R']).notNullable().defaultTo('P');

    // User tracking
    table.integer('created_by').unsigned().notNullable();
    table.integer('approved_by').unsigned();
    table.integer('updated_by').unsigned();
    table.integer('deleted_by').unsigned();

    // Timestamps
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
    table.timestamp('deleted_at').nullable().defaultTo(null);

    // Soft delete flag
    table.boolean('is_deleted').defaultTo(false);

    // Foreign key constraints
    table.foreign('sku_id').references('id').inTable('sku_master').onDelete('CASCADE');

    // Indexes
    table.index('sku_id');
    table.index('is_active');
    table.index('approval_status');
    table.index('created_by');
    table.index('updated_by');
    table.index('is_deleted');
    table.index('deleted_by');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable('product_master');
};
