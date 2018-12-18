# FT Navigation Middleware

The FT Navigation middleware for express appends an instance of the navigation package to app.locals on app startup.

The navigation data must be present in order to render the navigation components for the page.

Pages which should render a navigation crumbtrail, which includes most Stream pages, should call the middleware with { `enableCrumbtrail: ture }` to tell the middleware to include crumbtrail data in the response.

This middleware should be consumed by your application's server file.


### Installation
```
npm install --save @financial-times/anvil-middleware-ft-navigation
```


### Example usage:
```
const navigationMiddleware = require('@financial-times/anvil-middleware-ft-navigation')

const instance = navigationMiddleware.default({ enableCrumbtrail: true })

app.use(instance)
```