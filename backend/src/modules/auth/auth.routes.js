const express = require("express");
const { v4: uuid } = require("uuid");
const db = require("../../db/database");
const { createSession, deleteSession } = require("./session.store");
const { requireAuth } = require("./auth.middleware");

const router = express.Router();

router.post("/login", (req, res) => {
  const { username, password, role } = req.body;

  if (!username || !password || !role) {
    return res.status(400).json({ message: "Missing credentials" });
  }

  db.get(
    "SELECT id, username, role FROM users WHERE username = ? AND password = ? AND role = ?",
    [username, password, role],
    (err, row) => {
      if (err) return res.status(500).json({ error: err.message });
      if (!row) return res.status(401).json({ message: "Invalid credentials" });

      const token = uuid();
      createSession(token, row);

      res.json({
        token,
        user: row
      });
    }
  );
});

router.get("/me", requireAuth(), (req, res) => {
  res.json({ user: req.user });
});

router.post("/logout", requireAuth(), (req, res) => {
  deleteSession(req.token);
  res.json({ message: "Logged out" });
});

module.exports = router;
