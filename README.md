# route-async

A route wrapper allowing use of async / await syntax in Express route controllers

| Branch   | Status  | Coverage  | Comments  |
| -------- | ------- | --------- | --------- |
| `develop` | [![CircleCI](https://circleci.com/gh/davesag/route-async/tree/develop.svg?style=svg)](https://circleci.com/gh/davesag/route-async/tree/develop) | [![codecov](https://codecov.io/gh/davesag/route-async/branch/develop/graph/badge.svg)](https://codecov.io/gh/davesag/route-async) | Work in progress |
| `master` | [![CircleCI](https://circleci.com/gh/davesag/route-async/tree/master.svg?style=svg)](https://circleci.com/gh/davesag/route-async/tree/master) | [![codecov](https://codecov.io/gh/davesag/route-async/branch/master/graph/badge.svg)](https://codecov.io/gh/davesag/route-async) | Latest release |

## To Use

    npm install route-async

## Wrap an `async` route

Assuming you have some helper function called `somethingAsynchronous`, you might have a route looking a bit like this:

    const { asyncRoute } = require('route-async')
    const somethingAsynchronous = require('./helpers/somethingAsynchronous')

    const myRoute = async (req, res) => {
      const result = await somethingAsynchronous(req.body)
      res.json(result)
    }

    module.exports = asyncRoute(myRoute)

The `asyncRoute` wrapper simply takes your route and wraps it, such that the async promise is either resolved internally, or if rejected a `next` function is called. The default `next` is just `console.error` but you can of course supply your own.

## Testing `async` routes

Use the `mockAsyncRoute` wrapper to test your async routes.  The following example leverages [`mocha`](https://mochajs.org), [`sinon`](https://sinonjs.org), and [`proxyquire`](https://github.com/thlorenz/proxyquire) to unit test the above route.

    const { expect } = require('chai')
    const sinon = require('sinon')
    const proxyquire = require('proxyquire')

    const { mockAsyncRoute } = require('route-async')

    describe('src/routes/myRoute', () => {
      const mockSomethingAsync = sinon.stub()

      const myRoute = proxyquire('../../src/routes/myRoute', {
        'route-async': { mockAsyncRoute },
        './helpers/somethingAsynchronous': mockSomethingAsync
      }

      const req = { body: 'some body' }
      const res = { json: sinon.stub() }
      const next = sinon.spy()
      const result = 'some result'

      before(async () => {
        mockSomethingAsync.resolves(result)
        await myRoute(req, res, next)
      })

      it('called somethingAsynchronous with the right data', () => {
        expect(mockSomethingAsync).to.have.been.calledWith(req.body)
      })

      it('called res.json with the right data', () => {
        expect(res.json).to.have.been.calledWith(result)
      })

      it("didn't call next", () => {
        expect(next).not.to.have.been.called
      })
    })

## Development

### Prerequisites

* [NodeJS](htps://nodejs.org), version 10+ or better (I use [`nvm`](https://github.com/creationix/nvm) to manage Node versions — `brew install nvm`.)

### Initialisation

    npm install

### Test it

* `npm test` — runs the unit tests (quick and does not need rabbit mq running)
* `npm run test:coverage` — runs the tests with code coverage output.

### Lint it

    npm run lint

## Contributing

Please see the [contributing notes](CONTRIBUTING.md).
