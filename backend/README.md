# Inventory Management API

## Short description

Inventory Management API — a small Node.js + Express backend that provides user authentication, product CRUD, inventory history tracking, and CSV import/export for products. It uses SQLite for persistence and JWT for authentication.

## Tech stack

- Node.js (CommonJS)
- Express
- SQLite (sqlite3)
- Authentication: JSON Web Tokens (`jsonwebtoken`)
- Validation: `express-validator`
- File upload: `multer`
- CSV parsing: `csv-parser`
- Testing: Jest (basic unit tests under `tests/`)

## Key features

- User registration & login (JWT issuance and verification).
- Product CRUD (create, read with pagination & filters, update, delete).
- Inventory history: records stock changes in `inventory_history` on updates and create.
- CSV import/export for products (CSV upload and download endpoints).
- Pagination, sorting and search on product listing.

## Architecture & folder structure

The code separates concerns using controllers, routes, middleware and a small model initializer for the DB.

Important folders/files

- `src/server.js` — application entry, sets up middleware, routes and DB initialization.
- `src/config/`
  - `env.js` — loads `.env` and exposes `port`, `jwtSecret`, `dbFile`.
  - `db.js` — opens SQLite connection (exports a `sqlite3` Database instance).
- `src/controllers/` — request handlers for `auth` and `products` (`authController.js`, `productsController.js`).
- `src/routes/` — Express routers:
  - `authRoutes.js` → `/api/auth` (register, login)
  - `productsRoutes.js` → `/api/products` (listing, create, update, delete, import/export, history)
- `src/middleware/` — reusable middleware: `authMiddleware.js` (JWT auth), `validation.js` (express-validator helpers), `upload.js` (multer config), `errorHandler.js`.
- `src/models/initDb.js` — creates tables if missing on startup (`users`, `products`, `inventory_history`).
- `uploads/` — directory used by `multer` for incoming files (CSV imports, images).
- `tests/` — beginner-level Jest tests (unit tests for controllers and middleware).

## Database schema (overview)

1. `users`

   - `id` (INTEGER PRIMARY KEY) — user id
   - `name` (TEXT) — display name
   - `email` (TEXT UNIQUE) — login email
   - `password_hash` (TEXT) — bcrypt hash of the password

2. `products`

   - `id` (INTEGER PRIMARY KEY)
   - `name` (TEXT UNIQUE) — product name
   - `unit` (TEXT)
   - `category` (TEXT)
   - `brand` (TEXT)
   - `stock` (INTEGER) — current stock quantity
   - `status` (TEXT) — optional status
   - `image` (TEXT) — image URL/path

3. `inventory_history`
   - `id` (INTEGER PRIMARY KEY)
   - `product_id` (INTEGER) — FK to `products.id`
   - `old_quantity` (INTEGER)
   - `new_quantity` (INTEGER)
   - `change_date` (TEXT, ISO string)
   - `user_info` (TEXT) — who performed the change (email or `system`)

## API overview

Base URL: `http://localhost:<PORT>/api` (default `PORT` is `5000`)

Auth

- POST `/api/auth/register` — Register a new user. Validates `name`, `email`, `password`. Returns `{ user, token }` on success.
- POST `/api/auth/login` — Log in with `email` and `password`. Returns `{ user, token }`.

Products

- GET `/api/products` — List products. Supports query params: `search`, `category`, `page`, `limit`, `sort`, `order`.
- GET `/api/products/categories` — Returns list of distinct categories.
- POST `/api/products` — Create product (auth required). Validates `name` and `stock`. Records initial inventory history (old 0 → new stock).
- PUT `/api/products/:id` — Update product (auth required). If `stock` changes, inserts a row in `inventory_history`.
- DELETE `/api/products/:id` — Delete a product (auth required).
- GET `/api/products/:id/history` — Get inventory history for a product (auth required).
- POST `/api/products/import` — Import products from CSV (auth required). Expects form field `csvFile` (multer middleware).
- GET `/api/products/export` — Export products as CSV (auth required).
- GET `/api/products/statistics` — Returns aggregated statistics (auth required).

## Environment variables

The backend reads environment variables from `.env` via `dotenv` (file: `src/config/env.js`).

Example `.env` (place inside `backend/`):

```
PORT=5000
JWT_SECRET=your_jwt_secret_here
DB_FILE=./inventory.db
```

Notes:

- `DB_FILE` defaults to `./inventory.db` and the DB file is created/initialized by `initDb` when the server starts.

## Setup & installation

1. Open a terminal and change into the backend folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file (see example above).
4. Start the app:
   - Development (with `nodemon` if present): `npm run dev`
   - Production: `npm start`

The server listens on `PORT` (default `5000`). API root: `http://localhost:5000/api`.

## Testing

- Beginner-level Jest tests (controller and middleware tests) are located under `backend/tests/`.
- Run tests:
  ```bash
  cd backend
  npm test
  ```

## Future improvements (suggestions)

- Move from SQLite to a client-server DB (Postgres) for multi-user production scenarios.
- Add role-based access control (admin vs regular users).
- Improve validation and add more unit/integration tests (Supertest for endpoint-level tests).
- Add pagination cursors and more secure token rotation/refresh tokens.

## License & notes

This project is a learning/demo app. Review security best practices before using in production (strong JWT secrets, HTTPS, CORS restrictions, rate limiting, password policies).
