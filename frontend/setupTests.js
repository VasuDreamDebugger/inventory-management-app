// Jest + React Testing Library setup file
// Adds custom matchers from jest-dom

// Provide TextEncoder / TextDecoder for environments that lack them (some Node versions)
const util = require("util");
if (typeof global.TextEncoder === "undefined") {
  global.TextEncoder = util.TextEncoder;
}
if (typeof global.TextDecoder === "undefined") {
  global.TextDecoder = util.TextDecoder;
}

// Adds custom matchers from jest-dom
require("@testing-library/jest-dom");
