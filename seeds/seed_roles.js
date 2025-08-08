/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function (knex) {
  // Check if roles already exist
  const existingRoles = await knex('roles').select('*');
  
  if (existingRoles.length > 0) {
    console.log('Roles already exist, skipping seed...');
    return;
  }

  // Insert roles only if table is empty
  await knex('roles').insert([
    { role_name: 'Superadmin', description: 'Has full access to all system features' },
    { role_name: 'Admin', description: 'Manages users and system settings' },
    { role_name: 'Distributor', description: 'Manages distribution operations' },
    { role_name: 'Delivery Partner', description: 'Handles delivery tasks' },
    { role_name: 'Customer', description: 'End user who places orders' },
  ]);
  
  console.log('Roles seeded successfully!');
};

