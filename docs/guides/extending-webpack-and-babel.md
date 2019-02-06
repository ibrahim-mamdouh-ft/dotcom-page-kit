# Extending the Core Webpack and Babel Config

In order to extend the core webpack or babel config, a plugin will have to be authored. Plugins are functions that subscribe to be notified when a resource is published, so that they can have a chance to amend the resource in some way. During the life cycle of invoking the `anvil build` cli command, multiple resources will be published for possible amendment, and these include the webpack and babel config. So in order to extend the webpack config for instance, a plugin that subscribes to be notified when the `webpackConfig` resource is published for amendment, will be required. The following is an example of a plugin that [enables symlink resolves](https://webpack.js.org/configuration/resolve/#resolve-symlinks) on the webpack config:

```js
export default ({ on }) => {
  on('webpackConfig', ({ resource: webpackConfig }) => {
    webpackConfig.resolve.symlinks = true
  })
}
```

The first thing to note is that the plugin is being declared as a default export. The system expects plugins to be declared as the default export. The second thing to note is that the webpack config is being passed to the handler function as the property `resource`. This is how the resource that the plugin is subscribing to amend will be passed to the resource handler. So to extend the babel config, for instance, the plugin will be declared as follows:

```js
export default ({ on }) => {
  on('babelConfig', ({ resource: babelConfig }) => {
    doSomethingToTheBabelConfig(babelConfig)
  })
}
```

The third thing to note is that the system expects the resource to be directly amended, as in...

```js
webpackConfig.resolve.symlinks = true
```

## Loading plugins

Once the plugin has been authored, it will have to be loaded. To do so, the path to it (relative to the project root) has to be added to the `avil.config.json` file. The `anvil.config.json` file is the file that plugins and their related settings are declared in. This file is located in the project root. So if the plugin is located in `<ProjectRoot>/plugins/extendWebpack.js` for instance, then an `anvil.config.json` that looks like the following will be needed for the plugin to be picked up, the next time that the `anvil build` cli command is run:

```json
{
  "plugins": ["./plugins/extendWebpack"]
}
```

## Returning values from handlers

There is a problem with the following example:

```js
export default ({ on }) => {
  on('webpackConfig', ({ resource: webpackConfig }) => {
    webpackConfig.resolve.symlinks = true
  })
}
```

The problem is that it is possible that the `resolve` property does not actually exist on the core webpack config. To accommodate for this, the plugin could be declared as follow:

```js
export default ({ on }) => {
  on('webpackConfig', ({ resource: webpackConfig }) => {
    if (!webpackConfig.resolve) {
      webpackConfig.resolve = {}
    }
    webpackConfig.resolve.symlinks = true
  })
}
```

Or we could look at the code that declares the core webpack config to ensure that the `resolve` property has actually been declared on the core webpack config. None of these options are ideal. The former is not ideal because all the `if` blocks will eventually result in the code becoming difficult to follow. The latter is not ideal because it involves binding to private implementation details, which means that if the core webpack config is refactored and in the process the `resolve` property is removed, then the plugin would break. For this reason, the plugin system allows for values to be returned from handlers, that will be merged back into the original resource. This allows for the plugin to be declared as follows:

```js
export default ({ on }) => {
  on('webpackConfig', () => {
    return {
      resolve: {
        symlinks: true
      }
    }
  })
}
```

With this code, a webpack config is being returned from the handler. The system will take the webpack config that has been returned from the handler function, and merge it back into the original webpack config. The benefit here is that the code remains easy to reason about, and there is no longer the need to bind to private implementation details. This is the recommended way of extending not just the webpack and babel configs, but any resource.

There are a few things to note, however, when making use of this functionality. Firstly, it should be noted that it is only objects and arrays that are merged back into the original resource, and only if both the original resource and the handler result are of the same type. In other words, if the original resource is an array and the handler result is an array, then the handler result will be merged back into the original resource because they are compatible. If the handler result and the original resource are not compatible (where merging is concerned), then the original resource will be replaced with the handler result, so that the handler result becomes the resource that is passed to the next handler in the chain.

The second thing to note is that where arrays are concerned, only push merge is supported. In other words, when merging a source array into a destination array, the source array will be pushed into the destination array by doing the following:

```js
destArray.push(...srcArray)
```

This is intentional as we don't want plugins to be dependent on private details such as where exactly an item is located within the array. This way, if the position of the item is changed, plugins don't break. In situations where there is a need to amend something that is in an array (like a webpack rule for instance), the plugin should instead subscribe to amend that particular item (instead of subscribing to amend the entire webpack config for instance).

The third thing to note is that if `undefined` is returned from the handler, then nothing happens. The system treats an `undefined` handler result as meaning that nothing was returned from the handler, which means that the original resource should then be passed to the next handler in the list. Note, however, that the behavior is different when `null` is returned from a handler. The system treats a `null` handler result as being an intention request to overwrite the resource with `null`, so that null becomes the resource that is passed to subsequent handlers in the chain.

## No need for `webpack-merge`

[`webpack-merge`](https://github.com/survivejs/webpack-merge) is a library that is commonly used for merging webpack configuration objects. Those that are aware of it may feel the need to make use of it when amending the webpack config. It is, however, not necessary. By default, when a webpack configuration object is returned from a handler function, that configuration function will be merged back into the original webpack config using the same strategy that `webpack-merge` uses by default. In other words, it will merge the objects and concatenate the arrays (which is what `webpack-merge` does by default). The only time that `webpack-merge` will be needed, is when the intention is to do what is referred to as a [smart merge](https://github.com/survivejs/webpack-merge#mergesmartconfiguration-configuration). A smart merge involves merging matching array items as objects, instead of concatenating the arrays. For illustration purposes let's say that we are dealing with the following webpack configuration objects:

```js
const webpackConfigOne = {
  module: {
    rules: [
      {
        test: /\.(js|jsx|mjs)$/,
        foo: 'foo'
      }
    ]
  }
}

const webpackConfigTwo = {
  module: {
    rules: [
      {
        test: /\.(js|jsx|mjs)$/,
        bar: 'bar'
      }
    ]
  }
}
```

A smart merge would assume that because the first defined rule of both webpack configuration objects have matching `test` values, then it must mean that both rules are referring to the same thing, and so they should both be merged so that we end up with the following webpack config:

```js
const webpackConfigAfterMerge = {
  module: {
    rules: [
      {
        test: /\.(js|jsx|mjs)$/,
        foo: 'foo',
        bar: 'bar'
      }
    ]
  }
}
```

This, however, is not ideal because it involves having to know beforehand, what the value of the `test` property is on the original webpack configuration object, which is a thing that cannot be known because it is possible that another plugin may have changed that value. So in order for plugins to harmoniously coexist, arrays should only be concatenated (instead of being smartly merged) when merging. So if the desire is to add a new rule to the original webpack config for instance, then it is fine to return from the handler function, a webpack config that contains just that new rule.

```js
const originalWebpackConfig = {
  module: {
    rules: [
      {
        test: /\.(js|jsx|mjs)$/,
        foo: 'foo'
      }
    ]
  }
}

const webpackConfigReturnedByHandler = {
  module: {
    rules: [
      {
        test: /\.(css)$/,
        bar: 'bar'
      }
    ]
  }
}

const originalWebpackConfigAfterMerge = {
  module: {
    rules: [
      {
        test: /\.(js|jsx|mjs)$/,
        foo: 'foo'
      },
      {
        test: /\.(css)$/,
        bar: 'bar'
      }
    ]
  }
}
```

But if the intention is to amend an existing rule, then the plugin should subscribe to receive that particular rule as a resource and amend it directly. As an example, the `webpackConfig::jsRule` resource is published during the life cycle of executing the `anvil build` cli command. A plugin that amends this rule may look like the following:

```js
export default ({on} => {
  on('webpackConfig::jsRule', ({ resource: jsRule }) => {
    amendTheJsRule(jsRule)
  })
})
```

In summary, it is not at all necessary to use `webpack-merge`. This is because its default behavior has already been accommodated for in `anvil`, and where its smart merging capabilities are concerned, we consider it bad practice for them to be used.