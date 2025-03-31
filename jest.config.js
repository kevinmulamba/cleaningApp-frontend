module.exports = {
  testEnvironment: "node",
  moduleNameMapper: {
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
  },
  testPathIgnorePatterns: [
    "<rootDir>/frontend/"
  ],
  moduleDirectories: ["node_modules", "<rootDir>"]
};

