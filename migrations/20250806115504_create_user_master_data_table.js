/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable('user_master_data', function (table) {
    table.increments('id').primary();
    table.string('full_name', 100).notNullable();
    table.string('mobile', 15).notNullable().unique();
    table.string('email', 100);
    table.string('password', 255);
    table.integer('role_id').unsigned();
    table.boolean('is_deleted').defaultTo(false);
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.integer('created_by').unsigned();
    table.timestamp('updated_at').defaultTo(knex.fn.now());
    table.integer('updated_by').unsigned();

    table.foreign('role_id').references('id').inTable('roles');
    table.foreign('created_by').references('id').inTable('user_master_data');
    table.foreign('updated_by').references('id').inTable('user_master_data');
  });
};


/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable('user_master_data');
};

