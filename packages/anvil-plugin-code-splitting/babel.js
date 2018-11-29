/**
 * This file exports the babel preset so that it can be used in a .babelrc file as follows:
 * {
 *    "preset": [
 *      "@financial-times/anvil-plugin-code-splitting/babel"
 *    ]
 * }
 *
 */

// NOTE: `./dist/cjs/babel` will be present in the distributed package, so it's absence should not cause lint checks to fail
module.exports = require('./dist/cjs/babel') // eslint-disable-line import/no-unresolved