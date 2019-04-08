const { defaults } = require('jest-config');
// jest.config.js
const { pathsToModuleNameMapper } = require('ts-jest/utils');
// In the following statement, replace `./tsconfig` with the path to your `tsconfig` file
// which contains the path mapping (ie the `compilerOptions.paths` option):
const { compilerOptions } = require('./tsconfig');

const { defaults: tsjPreset } = require('ts-jest/presets');

module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: { '^@/(.*)$': '<rootDir>/$1' },
  moduleFileExtensions: [
    ...defaults.moduleFileExtensions,
    // tell Jest to handle `*.vue` files
    // "vue",
    'ts',
    'tsx'
  ],
  transform: {
    // process `*.vue` files with `vue-jest`
    // '^.+\\.vue$': 'vue-jest',
    // '.+\\.(css|styl|less|sass|scss|svg|png|jpg|ttf|woff|woff2)$': 'jest-transform-stub',
    '^.+\\.tsx?$': 'ts-jest'
  },
  snapshotSerializers: [
    // 'jest-serializer-vue'
  ],
  testMatch: [
    '**/tests/unit/**/*.(spec|test).(ts|tsx)|**/__tests__/*.(ts|tsx)'
  ],
  testURL: 'http://localhost/',
  globals: {
    window: {
      navigator: {
        userAgent: 'node'
      }
    },

    navigator: {
      userAgent: 'node'
    }
  },
  reporters: ["default", "jest-junit"],

  setupFilesAfterEnv : ["<rootDir>/tests/jest-setup.ts"],
  collectCoverage: true,
  coverageReporters: ["json", "lcov", "cobertura"]
};
