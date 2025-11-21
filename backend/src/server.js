const express = require('express');
const cors = require('cors');
const path = require('path');
const env = require('./config/env');
const initDb = require('./models/initDb');
const errorHandler = require('./middleware/errorHandler');
const authRoutes = require('./routes/authRoutes');
const productsRoutes = require('./routes/productsRoutes');

const app = express();

initDb();

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.use('/api/auth', authRoutes);
app.use('/api/products', productsRoutes);

app.use(errorHandler);

app.listen(env.port, () => {
  // eslint-disable-next-line no-console
  console.log(`Server running on port ${env.port}`);
});

