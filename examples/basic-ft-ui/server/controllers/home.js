const React = require('react')
const ReactDOM = require('react-dom/server')
const { Shell } = require('@financial-times/anvil-ui-ft-shell')
const { Layout } = require('@financial-times/anvil-ui-ft-layout')
const polyfills = require('@financial-times/anvil-ui-ft-polyfills')

module.exports = (_, response, next) => {
  const pageData = {
    title: 'Hello World!',
    contents: '<div align="center"><p>Hello, welcome to Anvil.</p></div>'
  }

  const scriptBundles = response.locals.assets.loader.getScriptURLsFor('scripts')
  const styleBundles = response.locals.assets.loader.getStylesheetURLsFor('styles')

  const shellProps = {
    flags: { ads: true, tracking: true },
    coreScripts: [polyfills.core],
    enhancedScripts: [polyfills.enhanced, ...scriptBundles],
    stylesheets: styleBundles,
    pageTitle: pageData.title
  }

  const layoutProps = {
    navigationData: response.locals.navigation
  }

  try {
    ;[...shellProps.enhancedScripts, ...shellProps.stylesheets].forEach((file) => {
      response.locals.assets.resourceHints.add(file)
    })

    response.set('Link', response.locals.assets.resourceHints.toString())

    const document = React.createElement(
      Shell,
      { ...shellProps },
      React.createElement(Layout, { ...layoutProps, contents: pageData.contents })
    )

    response.send('<!DOCTYPE html>' + ReactDOM.renderToStaticMarkup(document))
  } catch (error) {
    next(error)
  }
}
