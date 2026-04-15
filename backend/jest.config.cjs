module.exports = {
  preset: 'ts-jest/presets/default-esm',
  testEnvironment: 'node',
  transform: {
    '^.+\\.ts$': ['ts-jest', { useESM: true }],
    '^.+\\.js$': ['ts-jest', { useESM: true }],
  },
  // Treat TS files as ESM so imports like `import x from './file.js'` work
  extensionsToTreatAsEsm: ['.ts'],
  testMatch: ['**/tests/**/*.test.ts'],
  moduleFileExtensions: ['ts', 'js', 'json', 'node'],
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.jest.json',
      useESM: true,
    },
  },
  // Allow transforming ESM packages like `uuid` inside node_modules
  transformIgnorePatterns: ['node_modules/(?!(uuid)/)'],
  verbose: true,
};
