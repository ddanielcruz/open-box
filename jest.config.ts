import { pathsToModuleNameMapper } from 'ts-jest/utils'

import { compilerOptions } from './tsconfig.json'

export default {
  clearMocks: true,
  collectCoverageFrom: [
    '<rootDir>/src/services/**/*.ts',
    '<rootDir>/src/database/repositories/*.ts',
    '!<rootDir>/src/**/index.ts'
  ],
  coverageDirectory: 'coverage',
  coverageProvider: 'v8',
  testEnvironment: 'node',
  testMatch: ['<rootDir>/**/*.spec.ts'],
  setupFiles: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, { prefix: '<rootDir>' }),
  preset: 'ts-jest',
  modulePathIgnorePatterns: [
    '<rootDir>/dist/',
    '<rootDir>/src/errors/index.ts',
    '<rootDir>/src/database/repositories/index.ts',
    '<rootDir>/tests/mocks/'
  ]
}
