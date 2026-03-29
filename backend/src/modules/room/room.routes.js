const express = require('express');
const router = express.Router();
const db = require('../../db/database');
const { v4: uuid } = require('uuid');
const { requireAuth } = require('../auth/auth.middleware');

// GET ROOMS
router.get('/', (req, res) => {
  const { hotelId } = req.query;

  let sql = "SELECT * FROM rooms";
  let params = [];

  if (hotelId) {
    sql += " WHERE hotelId = ?";
    params.push(hotelId);
  }

  db.all(sql, params, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// CREATE ROOM
router.post('/', requireAuth(['admin']), (req, res) => {
  const { number, type, price, hotelId } = req.body;

  const id = uuid();

  db.run(
    "INSERT INTO rooms VALUES (?, ?, ?, ?, ?)",
    [id, number, type, price, hotelId],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ id, number, type, price, hotelId });
    }
  );
});

// UPDATE ROOM
router.put('/:id', requireAuth(['admin']), (req, res) => {
  const { id } = req.params;
  const { number, type, price } = req.body;

  db.run(
    "UPDATE rooms SET number = ?, type = ?, price = ? WHERE id = ?",
    [number, type, price, id],
    function(err) {
      if (this.changes === 0) {
        return res.status(404).json({ message: 'Room not found' });
      }
      res.json({ id, number, type, price });
    }
  );
});

// DELETE ROOM
router.delete('/:id', requireAuth(['admin']), (req, res) => {
  db.run(
    "DELETE FROM rooms WHERE id = ?",
    [req.params.id],
    function(err) {
      if (this.changes === 0) {
        return res.status(404).json({ message: 'Room not found' });
      }
      res.json({ message: 'Deleted' });
    }
  );
});

// AVAILABLE ROOMS
router.get('/available', (req, res) => {
  const { fromDate, toDate, hotelId } = req.query;

  const sql = `
    SELECT *
    FROM rooms
    WHERE hotelId = ?
    AND id NOT IN (
      SELECT roomId
      FROM reservations
      WHERE NOT (
        toDate <= ?
        OR fromDate >= ?
      )
    )
  `;

  db.all(sql, [hotelId, fromDate, toDate], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

module.exports = router;