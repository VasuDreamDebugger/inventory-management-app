# Inventory Management App

A full-stack inventory management application built with a React + Vite frontend and a Node.js + Express backend.

The platform enables secure user authentication, product inventory management, import/export workflows, and audit-ready inventory history tracking.

## Key Features

- Secure authentication with JWT login and registration
- Product CRUD operations with search, filtering, and pagination
- Inventory history tracking for stock changes
- CSV import and export for bulk product data management
- Product statistics and category reporting
- Responsive frontend UI with inline product editing

## Architecture

- Frontend: React, Vite, React Router, Axios, Jest + React Testing Library
- Backend: Node.js, Express, SQLite, JWT, express-validator, Multer, csv-parser
- Testing: Jest for both backend and frontend

## Project Structure

- `frontend/` - React client application
- `backend/` - Express API server
- `backend/uploads/` - Uploaded files and CSV assets

## Getting Started

### Prerequisites

- Node.js 18+ or compatible LTS version
- npm 10+ or equivalent package manager

### Install dependencies

Open two terminal sessions and run:

```bash
cd backend
npm install

cd ../frontend
npm install
```

### Configure Backend

Create a `.env` file in `backend/` with the required environment settings.

Example:

```env
PORT=5000
JWT_SECRET=your_jwt_secret
DATABASE_FILE=./database.sqlite
```

### Run the application

Start the backend server:

```bash
cd backend
npm run dev
```

Start the frontend development server:

```bash
cd frontend
npm run dev
```

The frontend is typically available at `http://localhost:5173` and the backend API at `http://localhost:5000/api`.

## Backend API Endpoints

Base URL: `http://localhost:5000/api`

### Authentication

- `POST /auth/register` - Register a new user
- `POST /auth/login` - Authenticate and receive a JWT token

### Products

- `GET /products` - Retrieve products with optional search, filters, sorting, and pagination
- `POST /products` - Create a new product
- `PUT /products/:id` - Update a product by ID
- `DELETE /products/:id` - Delete a product by ID
- `GET /products/:id/history` - Retrieve inventory history for a product
- `GET /products/categories` - Get available product categories
- `POST /products/import` - Import products from a CSV file
- `GET /products/export` - Export product data as a CSV file
- `GET /products/statistics` - Retrieve product and inventory statistics

## Testing

### Backend

```bash
cd backend
npm test
```

### Frontend

```bash
cd frontend
npm test
```

## Notes

- The backend uses SQLite for lightweight local storage and supports rapid prototyping.
- Uploaded CSV files are stored in `backend/uploads/`.
- Authentication tokens are handled in the frontend using local storage.

## Contribution

Contributions are welcome via issues and pull requests. For bug fixes or feature enhancements, please follow conventional git workflows and document any environment changes.

## License

This project is provided as-is. Add a license file if you want to specify project licensing.
