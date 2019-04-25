module.exports = {
  setupFilesAfterEnv: ["<rootDir>/jestSetup.js"],
  moduleFileExtensions: ["js", "json", "jsx", "node"],
  coverageDirectory: "./coverage/",
  collectCoverage: true,
  /*testEnvironment: "node",*/
  collectCoverageFrom: [
    "libs/**/*.js",
    "libs/**/*.jsx",
    "services/**/*.js",
    "services/**/*.jsx",
    // TODO: create integration tests for frontends
    // "frontend/**/*.js",
    // "frontend/**/*.jsx",
  ],
  coverageThreshold: {
    global: {
      branches: 50,
      functions: 50,
      lines: 50,
      statements: 50,
    },
  },
}
