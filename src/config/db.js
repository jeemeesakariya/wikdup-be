const db = require("knex");
const { attachPaginate } = require('knex-paginate');
attachPaginate();

const knex = db({
  client: 'mysql2',
  connection: {
    host: '127.0.0.1',
    user: 'root',
    password: '',
    database: 'wik_genesis',
  }
});

// Test connection
knex.raw('SELECT 1')
  .then(() => {
    console.log('✅ Database connected successfully!');
  })
  .catch((err) => {
    console.error('❌ Failed to connect to the database:', err);
  });

// Graceful shutdown handler
const shutdown = async () => {
  try {
    await knex.destroy();
    console.log('🔌 Knex connection destroyed.');
    process.exit(0);
  } catch (err) {
    console.error('⚠️ Error destroying Knex connection:', err);
    process.exit(1);
  }
};

// Handle exit signals
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

module.exports = knex;
