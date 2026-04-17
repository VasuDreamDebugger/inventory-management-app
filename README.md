📦 Inventory Management System

A full-stack Inventory Management application with a React (Vite) frontend and Node.js + Express backend. It supports product management, authentication, inventory tracking, and CSV import/export.

🚀 Features
🔐 User authentication (JWT-based login/register)
📦 Product CRUD with pagination, search & filters
✏️ Inline product editing
📊 Inventory history tracking
📁 CSV import/export support
📈 Product statistics


Frontend
Tech Stack
Vite + React
React Router
Axios (custom client)
Jest + React Testing Library
Plain CSS
Key Functionalities
Product listing with pagination & sorting
Search and category filtering
Inline editing
Inventory history sidebar
Auth token stored in localStorage
Structure
src/
  components/
  api/
  hooks/
  styles/
  main.jsx
Routing
/login → Authentication
/ → Products dashboard

⚙️ Backend
Tech Stack
Node.js + Express
SQLite (sqlite3)
JWT Authentication
express-validator
multer + csv-parser
Jest
Key Functionalities
User authentication (JWT)
Product CRUD operations
Inventory history tracking
CSV import/export
Filtering, pagination, sorting
Structure
src/
  server.js
  config/
  controllers/
  routes/
  middleware/
  models/
uploads/
tests/
🗄️ Database Schema
Users
id, name, email, password_hash
Products
id, name, unit, category, brand, stock, status, image
Inventory History
id, product_id, old_quantity, new_quantity, change_date, user_info
🔌 API Overview

Base URL: http://localhost:5000/api

Auth
POST /auth/register
POST /auth/login
Products
GET /products (search, filter, pagination)
POST /products
PUT /products/:id
DELETE /products/:id
GET /products/:id/history
GET /products/categories
POST /products/import
GET /products/export
GET /products/statistics
