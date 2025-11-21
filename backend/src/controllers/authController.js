const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
const { jwtSecret } = require('../config/env');

const SALT_ROUNDS = 10;

function generateToken(payload) {
  return jwt.sign(payload, jwtSecret, { expiresIn: '7d' });
}

async function register(req, res, next) {
  try {
    const { name, email, password } = req.body;

    const existingUser = await new Promise((resolve, reject) => {
      db.get('SELECT * FROM users WHERE email = ?', [email], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });

    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    const userId = await new Promise((resolve, reject) => {
      db.run(
        'INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)',
        [name, email, passwordHash],
        function insertCallback(err) {
          if (err) reject(err);
          else resolve(this.lastID);
        }
      );
    });

    const user = { id: userId, name, email };
    const token = generateToken(user);

    return res.status(201).json({ user, token });
  } catch (error) {
    return next(error);
  }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    const user = await new Promise((resolve, reject) => {
      db.get('SELECT * FROM users WHERE email = ?', [email], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password_hash);

    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const payload = { id: user.id, email: user.email, name: user.name };
    const token = generateToken(payload);

    return res.json({ user: payload, token });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  register,
  login,
};

