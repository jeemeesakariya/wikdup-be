/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.alterTable('product_master', function (table) {
    table.integer('updated_by').unsigned();
    
    // Add index for better performance
    table.index('updated_by');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.alterTable('product_master', function (table) {
    table.dropIndex('updated_by');
    table.dropColumn('updated_by');
  });
};
