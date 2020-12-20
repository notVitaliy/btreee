module.exports = {
  verbose: true,
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  testRegex: '.+\\.spec\\.ts$',
  moduleDirectories: ['node_modules', 'src'],
  moduleFileExtensions: ['ts', 'js'],
  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/tsconfig.json',
    },
  },
  rootDir: '../..',
  collectCoverage: true,
  coveragePathIgnorePatterns: ['/node_modules', '/config'],
}
