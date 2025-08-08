exports.up = function(knex) {
  return knex.schema.createTable('coupon_master', function(table) {
    table.increments('id').primary();
    table.string('code', 50).unique().notNullable();
    table.enum('discount_type', ['percentage', 'flat']).notNullable();
    table.decimal('discount_value', 10, 2).notNullable();
    table.date('valid_from').notNullable();
    table.date('valid_till').notNullable();
    table.integer('usage_limit').defaultTo(1);
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'));
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('coupon_master');
};
