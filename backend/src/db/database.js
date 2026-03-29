const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("hotel.db");

db.serialize(() => {

  // HOTELS
  db.run(`
    CREATE TABLE IF NOT EXISTS hotels (
      id TEXT PRIMARY KEY,
      name TEXT,
      address TEXT
    )
  `);

  // ROOMS
  db.run(`
    CREATE TABLE IF NOT EXISTS rooms (
      id TEXT PRIMARY KEY,
      number TEXT,
      type TEXT,
      price INTEGER,
      hotelId TEXT
    )
  `);

  // RESERVATIONS
  db.run(`
    CREATE TABLE IF NOT EXISTS reservations (
      id TEXT PRIMARY KEY,
      guestName TEXT,
      roomId TEXT,
      hotelId TEXT,
      fromDate TEXT,
      toDate TEXT
    )
  `);

  // USERS (MVP auth)
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      username TEXT UNIQUE,
      password TEXT,
      role TEXT
    )
  `);

  // Seed default accounts for local MVP
  db.run(
    `INSERT OR IGNORE INTO users (id, username, password, role)
     VALUES ('u-admin', 'admin', 'admin123', 'admin')`
  );
  db.run(
    `INSERT OR IGNORE INTO users (id, username, password, role)
     VALUES ('u-guest', 'guest', 'guest123', 'guest')`
  );
  db.run(
    `INSERT OR IGNORE INTO users (id, username, password, role)
     VALUES ('u-staff', 'staff', 'staff123', 'staff')`
  );

});

module.exports = db;