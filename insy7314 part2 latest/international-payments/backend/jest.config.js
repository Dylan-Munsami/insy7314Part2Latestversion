export default {
  testEnvironment: 'node',
  roots: ['<rootDir>/test'],
  transform: {},
  moduleFileExtensions: ['js', 'json', 'node'],
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageReporters: ['lcov', 'text'],
};
