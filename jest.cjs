module.exports = {
  "moduleFileExtensions": ["ts", "tsx", "js", "jsx"],
  "collectCoverage": true,
  "collectCoverageFrom": ["src/**/*.ts"],
  "coverageReporters": ["text", "lcov", "json"],
  "coverageDirectory": "./coverage",
  "extensionsToTreatAsEsm": [".ts", ".tsx"],
  "resolver": "ts-jest-resolver",
  "transform": {
    "\\.jsx?$": "babel-jest",
    "\\.tsx?$": ["ts-jest", { "tsconfig": "tsconfig.json", "useESM": true, }]
  },
  "testMatch": ["<rootDir>/src/__tests__/**/*.test.*"],
  "testEnvironment": "jsdom",
  "automock": false,
  "setupFilesAfterEnv": ["<rootDir>/jest-setup.js"],
  "moduleNameMapper": {
    // jest 28 loads modules differently. See https://jestjs.io/docs/upgrading-to-jest28#packagejson-exports
    "^uuid$": require.resolve('uuid'),
  }
}
