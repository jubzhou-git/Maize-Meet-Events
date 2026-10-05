// Isolated screen tests: native views are mocked; React state/hooks remain real.
module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/tests/DiscoverScreen.qa06.test.js'],
  transform: {
    '^.+\\.js$': ['babel-jest', {
      babelrc: false,
      configFile: false,
      plugins: ['@babel/plugin-transform-modules-commonjs', '@babel/plugin-transform-react-jsx'],
    }],
  },
};
