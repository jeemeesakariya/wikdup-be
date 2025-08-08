/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */github 
exports.seed = async function (knex) {
  // await knex('roles').del();
  await knex('roles').insert([
    { role_name: 'Superadmin', description: 'Has full access to all system features' },
    { role_name: 'Admin', description: 'Manages users and system settings' },
    { role_name: 'Distributor', description: 'Manages distribution operations' },
    { role_name: 'Delivery Partner', description: 'Handles delivery tasks' },
    { role_name: 'Customer', description: 'End user who places orders' },
  ]);
};

