module.exports = {
    preset: 'ts-jest',
    globals: {
      'ts-jest': {
        tsconfig: '<rootDir>/spec/tsconfig.json',
      },
    },
    setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
}