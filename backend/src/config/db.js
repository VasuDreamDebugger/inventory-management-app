const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const { dbFile } = require('./env');

const resolvedPath = path.resolve(__dirname, '../../', dbFile);
const db = new sqlite3.Database(resolvedPath);

module.exports = db;

