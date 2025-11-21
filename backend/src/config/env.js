const dotenv = require('dotenv');

dotenv.config();

module.exports = {
  port: process.env.PORT || 5000,
  jwtSecret: process.env.JWT_SECRET || 'devsecret',
  dbFile: process.env.DB_FILE || './inventory.db',
};

