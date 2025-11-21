const db = require('../config/db');

function initDb() {
  db.serialize(() => {
    db.run(
      `CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL
      )`
    );

    db.run(
      `CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT UNIQUE NOT NULL,
        unit TEXT,
        category TEXT,
        brand TEXT,
        stock INTEGER NOT NULL,
        status TEXT,
        image TEXT
      )`
    );

    db.run(
      `CREATE TABLE IF NOT EXISTS inventory_history (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        product_id INTEGER,
        old_quantity INTEGER,
        new_quantity INTEGER,
        change_date TEXT,
        user_info TEXT,
        FOREIGN KEY(product_id) REFERENCES products(id)
      )`
    );
  });
}

module.exports = initDb;

