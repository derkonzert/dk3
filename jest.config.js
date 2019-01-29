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
    "frontend/**/*.js",
    "frontend/**/*.jsx",
  ],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 80,
      statements: -10,
    },
  },
}
