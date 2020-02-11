# @financial-times/dotcom-build-sass

This package extends the [Page Kit CLI build action][cli] (`page-kit build`) with a way to load and generate CSS files from [Sass] source code.

[cli]: https://github.com/Financial-Times/dotcom-page-kit/blob/master/packages/dotcom-page-kit-cli/README.md#actions
[Sass]: https://sass-lang.com/

## Getting started

This package is compatible with Node 8+ and is distributed on npm.

```sh
npm install --save-dev @financial-times/dotcom-build-sass
```

After installing the package you must add it to the list of plugins in your project's `page-kit.config.js` configuration file:

```diff
+ const sass = require('@financial-times/dotcom-build-sass')

module.exports = {
  plugins: [
+    sass.plugin()
  ]
}
```

Once setup, this plugin will enable you to use Sass files (`.scss` and `.sass`) as [entry points] into your source code.

```sh
page-kit build --entryFile path/to/styles.scss
```

[entry points]: ../dotcom-page-kit-cli/README.md#entry-points


## Scope

This plugin adds a [rule] to the Webpack configuration to handle `.scss` files. It first uses the [sass-loader] to transpile Sass source code, then sends the output through to the [postcss-loader] for optimisations, and finally the [css-loader]. The [mini-css-extract-plugin] is added to generate `.css` files and the [webpack-fix-style-only-entries] to clean up any empty JavaScript bundles.

Sass has been configured to find packages installed with Bower and or npm by looking in the `'bower_components'` and `'node_modules/@financial-times'` directories. It can be configured to look in additional locations by passing the relevant paths to the plugin as absolute paths.

```js
sass.plugin({ includePaths: [path.resolve('./path-to-sass-files')] })
```

_Please note_ that by default Sass will resolve all bare `@import` statements from the current working directory rather than relative to the file being processed. This means it will not find dependencies in nested `node_modules` directories.

[PostCSS] is configured with the [Autoprefixer] and [cssnano] transforms.

The CSS loader has `@import` and `url()` resolution disabled as these should be handled by Sass.

Several [hooks](#hooks) are provided in order to access and modify the configuration.

[rule]: https://webpack.js.org/configuration/module/#rule
[sass-loader]: https://github.com/webpack-contrib/sass-loader
[postcss-loader]: https://github.com/postcss/postcss-loader
[css-loader]: https://github.com/webpack-contrib/css-loader
[mini-css-extract-plugin]: https://github.com/webpack-contrib/mini-css-extract-plugin
[webpack-fix-style-only-entries]: https://github.com/fqborges/webpack-fix-style-only-entries
[PostCSS]: https://postcss.org/
[Autoprefixer]: https://github.com/postcss/autoprefixer
[cssnano]: https://cssnano.co/


## Options

| Option            | Type     | Default | Description                                                        |
|-------------------|----------|---------|--------------------------------------------------------------------|
| `webpackImporter` | Boolean  | `false` | See https://github.com/webpack-contrib/sass-loader#webpackimporter |
| `includePaths`    | String[] | `[]`    | See https://github.com/sass/node-sass/#includepaths                |


## Hooks

This plugin exposes the following hooks as extension points. They are available as constants on the exported `hooks` object.

```js
import { hooks } from '@financial-times/dotcom-build-sass'
```

_Please note: The hooks below are listed in the order they will be executed._

### `POSTCSS_AUTOPREFIXER_OPTIONS`

Configuration options for the [Autoprefixer] PostCSS plugin.

### `POSTCSS_CSSNANO_OPTIONS`

Configuration options for the [cssnano] PostCSS plugin.

### `WEBPACK_SASS_LOADER_OPTIONS`

Configuration options for the [sass-loader].

### `WEBPACK_POSTCSS_LOADER_OPTIONS`

Configuration options for the [postcss-loader].

### `WEBPACK_CSS_LOADER_OPTIONS`

Configuration options for the [css-loader].

### `WEBPACK_MINI_CSS_EXTRACT_PLUGIN_OPTIONS`

Configuration options for the [mini-css-extract-plugin].

### `WEBPACK_STYLES_ONLY_PLUGIN_OPTIONS`

Configuration options for the [webpack-fix-style-only-entries].

### `WEBPACK_SASS_RULE`

Provides the entire [rule] to be appended by this plugin.