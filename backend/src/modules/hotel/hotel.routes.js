const express = require('express');
const router = express.Router();
const db = require('../../db/database');
const { v4: uuid } = require('uuid');
const { requireAuth } = require('../auth/auth.middleware');

// GET ALL HOTELS
router.get('/', (req, res) => {
  db.all("SELECT * FROM hotels", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// CREATE HOTEL
router.post('/', requireAuth(['admin']), (req, res) => {
  const { name, address } = req.body;

  if (!name || !address) {
    return res.status(400).json({ message: 'Missing data' });
  }

  const id = uuid();

  db.run(
    "INSERT INTO hotels (id, name, address) VALUES (?, ?, ?)",
    [id, name, address],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ id, name, address });
    }
  );
});

// UPDATE HOTEL
router.put('/:id', requireAuth(['admin']), (req, res) => {
  const { id } = req.params;
  const { name, address } = req.body;

  db.run(
    "UPDATE hotels SET name = ?, address = ? WHERE id = ?",
    [name, address, id],
    function(err) {
      if (this.changes === 0) {
        return res.status(404).json({ message: 'Hotel not found' });
      }
      res.json({ id, name, address });
    }
  );
});

// DELETE HOTEL
router.delete('/:id', requireAuth(['admin']), (req, res) => {
  db.run(
    "DELETE FROM hotels WHERE id = ?",
    [req.params.id],
    function(err) {
      if (this.changes === 0) {
        return res.status(404).json({ message: 'Hotel not found' });
      }
      res.json({ message: 'Deleted' });
    }
  );
});

module.exports = router;