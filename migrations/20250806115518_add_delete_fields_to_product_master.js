/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.alterTable('product_master', function (table) {
    table.boolean('is_deleted').defaultTo(false);
    table.integer('deleted_by').unsigned();
    table.timestamp('deleted_at');
    
    // Add indexes for better performance
    table.index('is_deleted');
    table.index('deleted_by');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.alterTable('product_master', function (table) {
    table.dropIndex('is_deleted');
    table.dropIndex('deleted_by');
    table.dropColumn('is_deleted');
    table.dropColumn('deleted_by');
    table.dropColumn('deleted_at');
  });
};
