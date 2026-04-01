const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("hotel.db");

db.run("PRAGMA foreign_keys = ON");

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
      CHECK(fromDate <= toDate),
      FOREIGN KEY (customerId) REFERENCES customers(id),
      FOREIGN KEY (roomId) REFERENCES rooms(id)
    )
  `);
});

module.exports = db;