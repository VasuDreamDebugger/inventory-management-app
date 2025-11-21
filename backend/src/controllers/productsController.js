const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const db = require('../config/db');

function runQuery(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}

function runGet(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
}

function runExecute(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function exec(err) {
      if (err) reject(err);
      else resolve(this);
    });
  });
}

const ALLOWED_SORT_FIELDS = ['name', 'stock', 'category', 'brand'];

async function getProducts(req, res, next) {
  try {
    const {
      search = '',
      category,
      page = 1,
      limit = 10,
      sort = 'name',
      order = 'asc',
    } = req.query;

    const pageNum = Math.max(parseInt(page, 10) || 1, 1);
    const limitNum = Math.max(parseInt(limit, 10) || 10, 1);
    const offset = (pageNum - 1) * limitNum;
    const sortField = ALLOWED_SORT_FIELDS.includes(sort) ? sort : 'name';
    const sortOrder = order === 'desc' ? 'DESC' : 'ASC';

    const conditions = [];
    const params = [];

    if (search) {
      conditions.push('name LIKE ?');
      params.push(`%${search}%`);
    }

    if (category && category !== 'All') {
      conditions.push('category = ?');
      params.push(category);
    }

    const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

    const totalRow = await runGet(
      `SELECT COUNT(*) as count FROM products ${whereClause}`,
      params
    );
    const total = totalRow?.count || 0;

    const data = await runQuery(
      `SELECT * FROM products ${whereClause} ORDER BY ${sortField} ${sortOrder} LIMIT ? OFFSET ?`,
      [...params, limitNum, offset]
    );

    return res.json({
      data,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum) || 1,
      },
    });
  } catch (error) {
    return next(error);
  }
}

async function createProduct(req, res, next) {
  try {
    const {
      name,
      unit = '',
      category = '',
      brand = '',
      stock = 0,
      status = '',
      image = '',
    } = req.body;

    const existing = await runGet('SELECT id FROM products WHERE name = ?', [
      name,
    ]);
    if (existing) {
      return res.status(400).json({ error: 'Product name already exists' });
    }

    const result = await runExecute(
      `INSERT INTO products (name, unit, category, brand, stock, status, image)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [name, unit, category, brand, Number(stock), status, image]
    );

    const product = await runGet('SELECT * FROM products WHERE id = ?', [
      result.lastID,
    ]);

    await runExecute(
      `INSERT INTO inventory_history (product_id, old_quantity, new_quantity, change_date, user_info)
       VALUES (?, ?, ?, ?, ?)`,
      [
        product.id,
        0,
        Number(product.stock),
        new Date().toISOString(),
        req.user?.email || 'system',
      ]
    );

    return res.status(201).json(product);
  } catch (error) {
    return next(error);
  }
}

async function updateProduct(req, res, next) {
  try {
    const { id } = req.params;
    const updates = req.body;

    const product = await runGet('SELECT * FROM products WHERE id = ?', [id]);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    if (updates.name) {
      const duplicate = await runGet(
        'SELECT id FROM products WHERE name = ? AND id != ?',
        [updates.name, id]
      );
      if (duplicate) {
        return res.status(400).json({ error: 'Product name already exists' });
      }
    }

    const fields = ['name', 'unit', 'category', 'brand', 'stock', 'status', 'image'];
    const setClauses = [];
    const params = [];

    fields.forEach((field) => {
      if (updates[field] !== undefined) {
        setClauses.push(`${field} = ?`);
        params.push(field === 'stock' ? Number(updates[field]) : updates[field]);
      }
    });

    if (!setClauses.length) {
      return res.json(product);
    }

    params.push(id);

    await runExecute(
      `UPDATE products SET ${setClauses.join(', ')} WHERE id = ?`,
      params
    );

    const updatedProduct = await runGet('SELECT * FROM products WHERE id = ?', [
      id,
    ]);

    if (
      updates.stock !== undefined &&
      Number(product.stock) !== Number(updates.stock)
    ) {
      await runExecute(
        `INSERT INTO inventory_history (product_id, old_quantity, new_quantity, change_date, user_info)
         VALUES (?, ?, ?, ?, ?)`,
        [
          id,
          Number(product.stock),
          Number(updates.stock),
          new Date().toISOString(),
          req.user?.email || 'system',
        ]
      );
    }

    return res.json(updatedProduct);
  } catch (error) {
    return next(error);
  }
}

async function deleteProduct(req, res, next) {
  try {
    const { id } = req.params;

    await runExecute('DELETE FROM inventory_history WHERE product_id = ?', [id]);
    const result = await runExecute('DELETE FROM products WHERE id = ?', [id]);

    if (result.changes === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    return res.json({ message: 'Product deleted' });
  } catch (error) {
    return next(error);
  }
}

async function getProductHistory(req, res, next) {
  try {
    const { id } = req.params;

    const history = await runQuery(
      `SELECT * FROM inventory_history WHERE product_id = ? ORDER BY change_date DESC`,
      [id]
    );

    return res.json(history);
  } catch (error) {
    return next(error);
  }
}

async function importProducts(req, res, next) {
  if (!req.file) {
    return res.status(400).json({ error: 'CSV file is required' });
  }

  const filePath = req.file.path;
  const rows = [];

  try {
    await new Promise((resolve, reject) => {
      fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (data) => rows.push(data))
        .on('end', resolve)
        .on('error', reject);
    });

    let added = 0;
    let skipped = 0;

    for (const row of rows) {
      const name = row.name?.trim();
      if (!name) {
        skipped += 1;
        // eslint-disable-next-line no-continue
        continue;
      }

      const existing = await runGet('SELECT id FROM products WHERE name = ?', [
        name,
      ]);
      if (existing) {
        skipped += 1;
        // eslint-disable-next-line no-continue
        continue;
      }

      await runExecute(
        `INSERT INTO products (name, unit, category, brand, stock, status, image)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          name,
          row.unit || '',
          row.category || '',
          row.brand || '',
          Number(row.stock) || 0,
          row.status || '',
          row.image || '',
        ]
      );

      added += 1;
    }

    return res.json({ added, skipped });
  } catch (error) {
    return next(error);
  } finally {
    fs.unlink(filePath, () => {});
  }
}

async function exportProducts(req, res, next) {
  try {
    const products = await runQuery('SELECT * FROM products');

    const headers = ['id', 'name', 'unit', 'category', 'brand', 'stock', 'status', 'image'];
    const csvRows = [headers.join(',')];

    products.forEach((product) => {
      const row = headers
        .map((field) => {
          const value = product[field] ?? '';
          if (typeof value === 'string' && value.includes(',')) {
            return `"${value.replace(/"/g, '""')}"`;
          }
          return value;
        })
        .join(',');
      csvRows.push(row);
    });

    const csvContent = csvRows.join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="products.csv"');
    return res.send(csvContent);
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductHistory,
  importProducts,
  exportProducts,
};

