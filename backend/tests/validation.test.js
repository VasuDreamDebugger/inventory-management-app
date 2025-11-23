// Basic tests for validation.handleValidation
// We mock express-validator's validationResult to simulate errors and success

jest.mock("express-validator", () => {
  // Provide a very small chainable API for `body()` used by the validators in the app.
  const chainObj = {
    notEmpty: function () {
      return this;
    },
    isEmail: function () {
      return this;
    },
    isLength: function () {
      return this;
    },
    optional: function () {
      return this;
    },
    isInt: function () {
      return this;
    },
    withMessage: function () {
      return this;
    },
  };

  return {
    body: () => chainObj,
    validationResult: jest.fn(),
  };
});

const { handleValidation } = require("../src/middleware/validation");
const { validationResult } = require("express-validator");

beforeEach(() => {
  jest.clearAllMocks();
});

describe("handleValidation", () => {
  test("responds 400 when validation errors are present", () => {
    // Arrange: validationResult returns errors
    validationResult.mockReturnValue({
      isEmpty: () => false,
      array: () => [{ msg: "Email required", param: "email" }],
    });

    const req = {};
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();

    // Act
    handleValidation(req, res, next);

    // Assert
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      errors: [{ msg: "Email required", param: "email" }],
    });
    expect(next).not.toHaveBeenCalled();
  });

  test("calls next when there are no validation errors", () => {
    validationResult.mockReturnValue({ isEmpty: () => true, array: () => [] });

    const req = {};
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();

    handleValidation(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });
});
