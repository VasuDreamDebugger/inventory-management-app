# Inventory Management Frontend

## Short description

Inventory Management Frontend — a Vite + React single-page app that consumes the Inventory Management API. It provides product listing with pagination, search and category filters, inline editing, CSV import/export, and an inventory history sidebar.

## Tech stack

- Vite
- React (automatic JSX runtime)
- Axios (custom instance at `src/api/axiosClient.js`)
- React Router (client navigation)
- React Testing Library + Jest (tests under `tests/`)
- Plain CSS files under `src/styles/`

## Key features

- Product list with pagination and sorting
- Search and category filters
- Inline editing of products
- CSV import/export (import via `multipart/form-data`, export as CSV)
- Inventory history sidebar per product
- Login / registration workflow (token persisted to `localStorage`)

## Project structure

Important frontend files/folders:

- `src/`
  - `components/` — reusable UI components (products related components in `components/products/`)
  - `api/` — `axiosClient.js`, `productsApi.js`, `authApi.js`
  - `hooks/` — custom hooks (e.g., `useProducts.js`)
  - `styles/` — plain CSS used across the app
  - `main.jsx` — app entry

## Routing & navigation

- Main routes are implemented using React Router:
  - `/login` — login page (if present)
  - `/` — main products page
- Components that use navigation (`useNavigate`) are tested with `MemoryRouter` in unit/integration tests.

## State & data flow

- Data fetching uses `productsApi` and the shared `axiosClient`.
- `useProducts` hook manages product data, pagination, search and sort params. `ProductsPage` composes filters, table and pagination.
- Auth tokens are stored in `localStorage` under `token`. `authApi` writes `token` and `user` on successful login/register.

## API integration

- `src/api/axiosClient.js` sets a default `baseURL` (`http://localhost:5000/api`) and attaches `Authorization: Bearer <token>` header when a token is present.
- `productsApi.js` and `authApi.js` wrap backend endpoints and are easily mocked in tests.

## Styling

- Plain CSS files located in `src/styles/`. The app uses responsive layout rules in CSS for basic mobile adaptation.

## Environment variables (Vite)

- The project currently sets the API base URL directly in `axiosClient.js`. To use a Vite env var, add `.env` with:
  ```ini
  VITE_API_BASE_URL=http://localhost:5000/api
  ```
  and update `src/api/axiosClient.js` to use `import.meta.env.VITE_API_BASE_URL`.

## Setup & installation

1. Change into the frontend folder:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. (Optional) Create `.env` with `VITE_API_BASE_URL` to override the API base URL.
4. Start the dev server:
   ```bash
   npm run dev
   ```
5. The app typically runs at `http://localhost:5173` (Vite default).

## Testing

- Unit and integration tests live under `frontend/tests/` (separate `unit/` and `integration/` folders).
- Run tests:
  ```bash
  cd frontend
  npm test
  ```

## Usage walkthrough (short)

1. Start backend and frontend.
2. Register or login to obtain a token.
3. View the products page: search, filter, sort and paginate.
4. Edit a product inline — stock changes persist and are recorded in inventory history.
5. Import products (CSV) or export the product list (CSV).
6. Open a product's Inventory History sidebar to see recent stock changes.

## Future improvements

- Use `VITE_API_BASE_URL` consistently and document required env vars.
- Add more integration tests and some end-to-end tests.
- Consider secure token storage (httpOnly cookies) in production.

## Notes

- Integration tests mock `productsApi` to avoid hitting the backend and to keep tests deterministic.
- Tokens are stored in `localStorage` for simplicity in this demo app.
