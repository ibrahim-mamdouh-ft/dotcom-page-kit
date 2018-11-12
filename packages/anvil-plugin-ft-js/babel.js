/**
 * This file is meant to export the babel preset so that it can be used in a .babelrc file as follows:
 * {
 *    "preset": [
 *      "@financial-times/anvil-plugin-ft-js/babel"
 *    ]
 * }
 *
 */

// NOTE: `./dist/cjs/babel` will be present in the distributed package
module.exports = require('./dist/cjs/babel') // eslint-disable-line import/no-unresolved