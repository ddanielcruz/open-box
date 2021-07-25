export default {
  clearMocks: true,
  collectCoverageFrom: ['<rootDir>/src/services/**/*.ts', '<rootDir>/src/repositories/*.ts'],
  coverageDirectory: 'coverage',
  coverageProvider: 'v8',
  testEnvironment: 'node',
  testMatch: ['<rootDir>/**/*.spec.ts'],
  setupFiles: ['<rootDir>/jest.setup.ts'],
  preset: 'ts-jest',
  modulePathIgnorePatterns: [
    '<rootDir>/dist/',
    '<rootDir>/src/repositories/index.ts',
    '<rootDir>/tests/mocks/'
  ]
}
