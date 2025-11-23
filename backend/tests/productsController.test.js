// Basic unit tests for productsController.updateProduct
// These tests mock the DB and check whether inventory history insertion happens

const productsController = require("../src/controllers/productsController");
const db = require("../src/config/db");

jest.mock("../src/config/db", () => ({
  get: jest.fn(),
  all: jest.fn(),
  run: jest.fn(),
}));

beforeEach(() => {
  jest.clearAllMocks();
});

describe("updateProduct", () => {
  test("inserts inventory history when stock changes", async () => {
    // Arrange: product currently has stock = 10
    const productRow = { id: 3, name: "Widget", stock: 10 };
    // db.get will be called to fetch the product and to check duplicate name - implement accordingly
    db.get.mockImplementation((sql, params, cb) => {
      if (sql.includes("SELECT * FROM products WHERE id = ?")) {
        return cb(null, productRow);
      }
      // duplicate name check
      return cb(null, null);
    });

    const runCalls = [];
    db.run.mockImplementation((sql, params, cb) => {
      runCalls.push({ sql, params });
      // simulate success
      return cb.call({ changes: 1 });
    });

    const req = {
      params: { id: "3" },
      body: { stock: 15 },
      user: { email: "tester@example.com" },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      send: jest.fn(),
    };
    const next = jest.fn();

    // Act
    await productsController.updateProduct(req, res, next);

    // Assert: one of the run calls should be inserting into inventory_history
    const insertedHistory = runCalls.some(
      (c) => c.sql && c.sql.includes("INSERT INTO inventory_history")
    );
    expect(insertedHistory).toBe(true);
    // final response should be sent (updated product). We check json was called.
    expect(res.json).toHaveBeenCalled();
  });

  test("does not insert inventory history when stock unchanged", async () => {
    // Arrange: product has stock = 10 and update sets stock to 10
    const productRow = { id: 4, name: "Gizmo", stock: 10 };
    db.get.mockImplementation((sql, params, cb) => {
      if (sql.includes("SELECT * FROM products WHERE id = ?")) {
        return cb(null, productRow);
      }
      return cb(null, null);
    });

    const runCalls = [];
    db.run.mockImplementation((sql, params, cb) => {
      runCalls.push({ sql, params });
      return cb.call({ changes: 1 });
    });

    const req = {
      params: { id: "4" },
      body: { stock: 10 },
      user: { email: "tester@example.com" },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      send: jest.fn(),
    };
    const next = jest.fn();

    // Act
    await productsController.updateProduct(req, res, next);

    // Assert: no run call should insert into inventory_history
    const insertedHistory = runCalls.some(
      (c) => c.sql && c.sql.includes("INSERT INTO inventory_history")
    );
    expect(insertedHistory).toBe(false);
    expect(res.json).toHaveBeenCalled();
  });
});

describe("getProductHistory", () => {
  test("returns product history array", async () => {
    // Arrange: mock history rows returned by db.all
    const historyRows = [
      {
        product_id: 5,
        old_quantity: 2,
        new_quantity: 3,
        change_date: "2025-01-01T00:00:00Z",
      },
    ];

    db.all.mockImplementation((sql, params, cb) => cb(null, historyRows));

    const req = { params: { id: "5" } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();

    // Act
    await productsController.getProductHistory(req, res, next);

    // Assert: should return the history rows
    expect(res.json).toHaveBeenCalledWith(historyRows);
  });
});
