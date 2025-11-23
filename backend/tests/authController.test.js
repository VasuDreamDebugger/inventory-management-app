// Basic unit tests for authController
// These tests use plain Jest and simple mocked req/res/next objects.

const authController = require("../src/controllers/authController");
const db = require("../src/config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

jest.mock("../src/config/db", () => ({ get: jest.fn(), run: jest.fn() }));
jest.mock("bcrypt", () => ({ hash: jest.fn(), compare: jest.fn() }));
jest.mock("jsonwebtoken", () => ({ sign: jest.fn() }));

beforeEach(() => {
  jest.clearAllMocks();
});

describe("authController.register", () => {
  test("returns 400 when email already registered", async () => {
    // Arrange: simulate existing user found by DB
    db.get.mockImplementation((sql, params, cb) =>
      cb(null, { id: 1, email: params[0] })
    );

    const req = {
      body: { name: "Alice", email: "a@example.com", password: "secret" },
    };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();

    // Act
    await authController.register(req, res, next);

    // Assert: should respond with 400 and an error message
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: "Email already registered",
    });
  });

  test("creates a new user when email is available", async () => {
    // Arrange: no existing user
    db.get.mockImplementation((sql, params, cb) => cb(null, null));
    // Mock bcrypt.hash to return a predictable hash
    bcrypt.hash.mockResolvedValue("hashedpw");
    // Mock db.run to call the callback with this.lastID available
    db.run.mockImplementation((sql, params, cb) => cb.call({ lastID: 42 }));
    jwt.sign.mockReturnValue("token-123");

    const req = {
      body: { name: "Bob", email: "b@example.com", password: "mypassword" },
    };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();

    // Act
    await authController.register(req, res, next);

    // Assert: should return 201 and a user/token shape
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalled();
    const payload = res.json.mock.calls[0][0];
    expect(payload).toHaveProperty("user");
    expect(payload.user).toMatchObject({
      id: 42,
      name: "Bob",
      email: "b@example.com",
    });
    expect(payload).toHaveProperty("token");
  });
});

describe("authController.login", () => {
  test("returns 401 when user not found", async () => {
    db.get.mockImplementation((sql, params, cb) => cb(null, null));

    const req = { body: { email: "noone@example.com", password: "pw" } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();

    await authController.login(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: "Invalid credentials" });
  });

  test("returns user and token when credentials are valid", async () => {
    // Arrange: user exists and password matches
    const userRow = {
      id: 7,
      email: "u@example.com",
      name: "U",
      password_hash: "hashed",
    };
    db.get.mockImplementation((sql, params, cb) => cb(null, userRow));
    bcrypt.compare.mockResolvedValue(true);
    jwt.sign.mockReturnValue("jwt-token");

    const req = { body: { email: "u@example.com", password: "pw" } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();

    await authController.login(req, res, next);

    expect(res.json).toHaveBeenCalled();
    const payload = res.json.mock.calls[0][0];
    expect(payload).toHaveProperty("user");
    expect(payload.user).toMatchObject({
      id: 7,
      email: "u@example.com",
      name: "U",
    });
    expect(payload).toHaveProperty("token");
  });
});
