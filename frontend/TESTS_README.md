Frontend tests — quick guide

Where tests live

- `frontend/tests/unit/` — unit tests for small components (ProductTable, ProductRow, ProductFilters).
- `frontend/tests/integration/` — integration tests for page-level flows (ProductsPage, simple UI actions).

What they cover (brief)

- Unit: component rendering, callback invocation, edit-mode UI for `ProductRow`.
- Integration: `ProductsPage` behavior with `productsApi` mocked (rendering product names, pagination requests).

How tests are run

1. From the repo `frontend` folder, install dependencies. Note: the frontend uses several dev testing packages — if you run into peer-dependency issues, use the `--legacy-peer-deps` flag:

```powershell
cd frontend
npm install --legacy-peer-deps
```

2. Run the test suite:

```powershell
npm test
```

Helpful test commands

- Run a single file with Jest:

```powershell
npx jest tests/unit/ProductRow.test.jsx
```

- Run tests matching a name (useful to run one test case):

```powershell
npx jest -t "Edit"
```

Notes

- Integration tests mock `src/api/productsApi.js` so tests don't hit the backend. This keeps tests fast and deterministic.
- If you change test-related dependencies (Jest, RTL, babel-jest), rerun `npm install`.
- The Jest setup file polyfills `TextEncoder`/`TextDecoder` and registers `@testing-library/jest-dom` matchers.
