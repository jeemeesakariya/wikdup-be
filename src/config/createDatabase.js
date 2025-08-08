const mysql = require('mysql2/promise');
const { exec } = require('child_process');
const path = require('path');

const DB_NAME = 'wik_genesis';

(async () => {
  try {
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
    });

    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\`;`);
    console.log(`✅ Database '${DB_NAME}' is ready.`);

    await connection.end();

    // Run knex migrate and seed
    console.log('⏳ Running migrations and seeds...');
    const knexDir = path.resolve(__dirname, '../../'); // go to root project directory

    exec('npx knex migrate:latest', { cwd: knexDir }, (err, stdout, stderr) => {
      if (err) {
        console.error('❌ Migration Error:', err.message);
        return;
      }
      console.log(stdout);

      exec('npx knex seed:run', { cwd: knexDir }, (err2, stdout2, stderr2) => {
        if (err2) {
          console.error('❌ Seed Error:', err2.message);
          return;
        }
        console.log(stdout2);
        console.log('✅ Setup complete!');
      });
    });
  } catch (error) {
    console.error('❌ DB Setup Error:', error.message);
  }
})();
