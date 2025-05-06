module.exports = {
  testEnvironment: "node",
  moduleNameMapper: {
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
  },
  testPathIgnorePatterns: [
    "<rootDir>/frontend/"
  ],
  moduleDirectories: ["node_modules", "<rootDir>"]
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/src/setupTests.js"],
  moduleFileExtensions: ["js", "jsx"],
  moduleDirectories: ["node_modules", "src"],
  testMatch: ["<rootDir>/src/**/*.test.js"],
  transform: {
    "^.+\\.[tj]sx?$": "babel-jest"
  }
};

