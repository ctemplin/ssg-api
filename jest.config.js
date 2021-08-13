module.exports = {
  verbose: false,
  testEnvironment: 'jsdom',
  collectCoverageFrom: ['<rootDir>/components/**/*.{js,jsx,ts,tsx}'],
  setupFilesAfterEnv: ['<rootDir>/.jest/setup.ts'],
  testPathIgnorePatterns: ['/node_modules/', '/.next/'],
  moduleNameMapper: {
    "\\.(css|scss|sass)$": "<rootDir>/tests/CSSStub.js",
    '^@/public(.*)$': '<rootDir>/public$1',
    '^@/components(.*)$': '<rootDir>/components$1',
    '^@/lib(.*)$': '<rootDir>/lib$1',
    '^@/styles(.*)$': '<rootDir>/styles$1',
    '^@/pages(.*)$': '<rootDir>/pages$1'
  }
}
