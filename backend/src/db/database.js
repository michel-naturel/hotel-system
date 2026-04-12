const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("hotel.db");

db.serialize(() => {
  //włączenie foreign key
  db.run("PRAGMA foreign_keys = ON");

  //hotels
  db.run(`
    CREATE TABLE IF NOT EXISTS hotels (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      address TEXT NOT NULL
    )
  `);

  //rooms
  db.run(`
    CREATE TABLE IF NOT EXISTS rooms (
      id TEXT PRIMARY KEY,
      number TEXT NOT NULL,
      type TEXT,
      price INTEGER NOT NULL CHECK(price > 0),
      hotelId TEXT NOT NULL,
      FOREIGN KEY (hotelId) REFERENCES hotels(id)
    )
  `);

  //customers
  db.run(`
    CREATE TABLE IF NOT EXISTS customers (
      id TEXT PRIMARY KEY,
      firstName TEXT NOT NULL,
      lastName TEXT NOT NULL,
      phone TEXT,
      email TEXT UNIQUE
    )
  `);

  //reservations
  db.run(`
    CREATE TABLE IF NOT EXISTS reservations (
      id TEXT PRIMARY KEY,
      customerId TEXT NOT NULL,
      roomId TEXT NOT NULL,
      fromDate TEXT NOT NULL,
      toDate TEXT NOT NULL,
      guestName TEXT,
      CHECK(fromDate <= toDate),
      FOREIGN KEY (customerId) REFERENCES customers(id),
      FOREIGN KEY (roomId) REFERENCES rooms(id)
    )
  `);

  //users
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      username TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      role TEXT NOT NULL
    )
  `);

  //seed hotels
  db.run(`INSERT OR IGNORE INTO hotels (id, name, address) VALUES ('h1', 'Hotel Warszawa', 'Warszawa')`);
  db.run(`INSERT OR IGNORE INTO hotels (id, name, address) VALUES ('h2', 'Wilczy Młyn', 'Kraków')`);

  //seed rooms
  db.run(`INSERT OR IGNORE INTO rooms (id, number, type, price, hotelId) VALUES ('r1', '101', 'single', 100, 'h1')`);
  db.run(`INSERT OR IGNORE INTO rooms (id, number, type, price, hotelId) VALUES ('r2', '102', 'double', 200, 'h1')`);
  db.run(`INSERT OR IGNORE INTO rooms (id, number, type, price, hotelId) VALUES ('r3', '201', 'single', 120, 'h2')`);
  db.run(`INSERT OR IGNORE INTO rooms (id, number, type, price, hotelId) VALUES ('r4', '002', 'single', 100, 'h2')`);

  //seed users
  db.run(`INSERT OR IGNORE INTO users (id, username, password, role) VALUES ('u-admin', 'admin', 'admin123', 'admin')`);
  db.run(`INSERT OR IGNORE INTO users (id, username, password, role) VALUES ('u-staff', 'staff', 'staff123', 'staff')`);
  db.run(`INSERT OR IGNORE INTO users (id, username, password, role) VALUES ('u-guest', 'guest', 'guest123', 'guest')`);

  //seed guest and staff
  db.run(`INSERT OR IGNORE INTO customers (id, firstName, lastName) VALUES ('u-guest', 'Guest', 'User')`);
  db.run(`INSERT OR IGNORE INTO customers (id, firstName, lastName) VALUES ('u-staff', 'Staff', 'User')`);
});

module.exports = db;