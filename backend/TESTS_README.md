Backend tests — quick guide

Where tests live

- `backend/tests/` — beginner-level Jest unit tests targeting controllers and middleware.

What they cover (brief)

- authController: register/login behavior (mocked DB, bcrypt, jwt)
- productsController: update behavior and inventory history insertion (mocked DB)
- validation middleware: behavior when validation errors exist or not

How to run

1. From the repo `backend` folder, install dependencies (if not already):

```
cd backend
npm install
```

2. Run tests with Jest:

```
npm test
```

Notes and troubleshooting

- Tests use plain Jest and simple mocks; they do not require a running server or a DB file.
- If you change test dependencies, run `npm install` in `backend`.
- Tests are intentionally simple and suitable to explain in interviews (clear arrange/act/assert steps).
