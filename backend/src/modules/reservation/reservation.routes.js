const express = require('express');
const router = express.Router();
const db = require('../../db/database');
const { v4: uuid } = require('uuid');

// GET
router.get('/', (req, res) => {
  const { hotelId } = req.query;
  let sql = `
    SELECT reservations.*, customers.firstName, customers.lastName,
           rooms.number, reservations.guestName
    FROM reservations
    JOIN customers ON reservations.customerId = customers.id
    JOIN rooms ON reservations.roomId = rooms.id
  `;
  let params = [];
  if (hotelId) {
    sql += " WHERE rooms.hotelId = ?";
    params.push(hotelId);
  }
  db.all(sql, params, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// CREATE
router.post('/', (req, res) => {
  const { roomId, customerId, fromDate, toDate, guestName } = req.body;
  if (!roomId || !customerId || !fromDate || !toDate) {
    return res.status(400).json({ message: "Missing data" });
  }

  const checkSql = `
    SELECT * FROM reservations
    WHERE roomId = ?
    AND NOT (toDate <= ? OR fromDate >= ?)
  `;
  db.all(checkSql, [roomId, fromDate, toDate], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    if (rows.length > 0) {
      return res.status(400).json({ message: "Room not available" });
    }
    const id = uuid();
    db.run(
      `INSERT INTO reservations (id, customerId, roomId, fromDate, toDate, guestName)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [id, customerId, roomId, fromDate, toDate, guestName || null],
      (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ id });
      }
    );
  });
});

// DELETE
router.delete('/:id', (req, res) => {
  db.run(
    "DELETE FROM reservations WHERE id = ?",
    [req.params.id],
    function(err) {
      if (err) return res.status(500).json({ error: err.message });
      if (this.changes === 0) {
        return res.status(404).json({ message: "Not found" });
      }
      res.json({ message: "Deleted" });
    }
  );
});

module.exports = router;