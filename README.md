# 📦 Database Setup Guide (MySQL2 + Knex.js)

This guide walks you through setting up your MySQL database with Knex.js in a Node.js backend project.

---

## ⚙️ Prerequisites

- Node.js installed
- MySQL server running
- A MySQL database created (e.g., `wik_genesis`)
- Your backend project initialized

---

## 🧱 Step 1: Install Dependencies

```bash
npm install knex mysql2
npx knex init
```

---

## 📝 Step 2: Configure `knexfile.js`

Replace the content in `knexfile.js` with the following:

```js
module.exports = {
  development: {
    client: 'mysql2',
    connection: {
      host: '127.0.0.1',
      user: 'root',
      password: '',
      database: 'wik_genesis',
    },
    migrations: {
      directory: './migrations',
    },
    seeds: {
      directory: './seeds',
    },
  },
};
```

---

## 📂 Step 3: Create Migrations

Generate migration files:

```bash
npx knex migrate:make create_roles_table
npx knex migrate:make create_user_master_data_table
npx knex migrate:make create_otps_table
npx knex migrate:make create_user_sessions_table
```

Edit each file to match your SQL schema (as you've already defined).

---

## 🚀 Step 4: Run Migrations

```bash
npx knex migrate:latest
```

Rollback:

```bash
npx knex migrate:rollback
```

Rollback all:

```bash
npx knex migrate:rollback --all
```

---

## 🌱 Step 5: Seed Initial Data

Create a seed file:

```bash
npx knex seed:make seed_roles
```

Inside `seeds/seed_roles.js`:

```js
exports.seed = async function (knex) {
  await knex('roles').del();
  await knex('roles').insert([
    { role_name: 'Superadmin', description: 'Has full access to all system features' },
    { role_name: 'Admin', description: 'Manages users and system settings' },
    { role_name: 'Distributor', description: 'Manages distribution operations' },
    { role_name: 'Delivery Partner', description: 'Handles delivery tasks' },
    { role_name: 'Customer', description: 'End user who places orders' },
  ]);
};
```

Run the seed:

```bash
npx knex seed:run
```

---

## 🧹 Extra Useful Commands

| Command                             | Description                           |
|-------------------------------------|---------------------------------------|
| `npx knex migrate:make <name>`      | Create a new migration file           |
| `npx knex migrate:latest`           | Run all pending migrations            |
| `npx knex migrate:rollback`         | Rollback the latest migration         |
| `npx knex seed:make <name>`         | Create a seed file                    |
| `npx knex seed:run`                 | Run all seed files                    |

---

## ✅ Tables in This Project

- `roles`
- `user_master_data`
- `otps`
- `user_sessions`

All tables use `FOREIGN KEY`, `TIMESTAMP`, and indexing where needed.

---

## 🧠 Pro Tip: Use Environment Variables

```bash
npm install dotenv
```

In `.env`:

```env
DB_HOST=127.0.0.1
DB_USER=root
DB_PASS=
DB_NAME=wik_genesis
```

In `knexfile.js`:

```js
require('dotenv').config();

connection: {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
}
```

---

> 💬 Reset Everything  
> `npx knex migrate:rollback --all && npx knex migrate:latest && npx knex seed:run`

---

Happy Coding! 🎉
