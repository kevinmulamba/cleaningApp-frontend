module.exports = {
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/frontend/setupTests.js"],
  transform: {
    "^.+\\.(js|jsx)?$": "babel-jest",
  },
  moduleFileExtensions: ["js", "jsx"],
};

