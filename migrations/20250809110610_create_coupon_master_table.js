/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('coupon_master', function (table) {
    table.increments('id').primary();
    table.string('code', 50).unique().notNullable();
    table.enu('discount_type', ['percentage', 'flat']).notNullable();
    table.decimal('discount_value', 10, 2).notNullable();
    table.date('valid_from').notNullable();
    table.date('valid_till').notNullable();
    table.enu('status', ['active', 'inactive', 'expired', 'paused']).notNullable().defaultTo('active');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable('coupon_master');
};
