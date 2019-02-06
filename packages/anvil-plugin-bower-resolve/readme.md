# Anvil Plugin Bower Resolve

This module extends the [Anvil CLI build action][cli] (`anvil build`) with a way to find and load dependencies installed with [Bower].

[cli]: https://github.com/Financial-Times/anvil/tree/master/packages/anvil#build
[Bower]: https://bower.io/


## Getting started

This module is compatible with Node 10+ and is distributed on npm.

```sh
npm install --save-dev @financial-times/anvil-plugin-bower-resolve
```

After installing the module you must add it to the list of plugins in your project's `anvil.config.json` configuration file:

```diff
{
  "plugins": [
+    "@financial-times/anvil-plugin-bower-resolve"
  ]
}
```

Once setup, this plugin will enable you to use Bower dependencies in your source code.


## Scope

This plugin adds several properties to Webpack's [resolve configuration] instructing it to look for modules within the `bower_components` directory and use the `bower.json` manifest file if present.

This plugin also adds the [bower-resolve-webpack-plugin].

_Please note: Bower dependencies will be favoured over dependencies installed with npm._

[resolve configuration]: https://webpack.js.org/configuration/resolve/
[bower-resolve-webpack-plugin]: https://www.npmjs.com/package/bower-resolve-webpack-plugin


## Settings

There are currently no additional settings for this plugin.


## Extending

This plugin currently has no hooks to extend.