const db = require("knex");

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

module.exports = knex;
