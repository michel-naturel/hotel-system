const express = require('express');
const router = express.Router();
const db = require('../../db/database');
const { v4: uuid } = require('uuid');

// GET ALL CUSTOMERS
router.get('/', (req, res) => {
  db.all("SELECT * FROM customers", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// GET CUSTOMER BY ID
router.get('/:id', (req, res) => {
  db.get("SELECT * FROM customers WHERE id = ?", [req.params.id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ message: 'Customer not found' });
    res.json(row);
  });
});

// CREATE CUSTOMER
router.post('/', (req, res) => {
  const { firstName, lastName, phone, email } = req.body;

  if (!firstName || !lastName) {
    return res.status(400).json({ message: "Missing data" });
  }

  const id = uuid();

  db.run(
    `INSERT INTO customers (id, firstName, lastName, phone, email)
     VALUES (?, ?, ?, ?, ?)`,
    [id, firstName, lastName, phone, email],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ id, firstName, lastName, phone, email });
    }
  );
});

// UPDATE CUSTOMER
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { firstName, lastName, phone, email } = req.body;

  if (!firstName || !lastName) {
    return res.status(400).json({ message: "Missing data" });
  }

  db.run(
    `UPDATE customers
     SET firstName = ?, lastName = ?, phone = ?, email = ?
     WHERE id = ?`,
    [firstName, lastName, phone, email, id],
    function(err) {
      if (err) return res.status(500).json({ error: err.message });

      if (this.changes === 0) {
        return res.status(404).json({ message: 'Customer not found' });
      }

      res.json({ id, firstName, lastName, phone, email });
    }
  );
});

// DELETE CUSTOMER
router.delete('/:id', (req, res) => {
  db.run(
    "DELETE FROM customers WHERE id = ?",
    [req.params.id],
    function(err) {
      if (err) return res.status(500).json({ error: err.message });

      if (this.changes === 0) {
        return res.status(404).json({ message: 'Customer not found' });
      }

      res.json({ message: 'Deleted' });
    }
  );
});

module.exports = router;