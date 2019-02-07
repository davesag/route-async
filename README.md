# route-async

A route wrapper allowing use of async / await syntax in Express route controllers

[![Greenkeeper badge](https://badges.greenkeeper.io/davesag/route-async.svg)](https://greenkeeper.io/)

| Branch   | Status  | Coverage  | Comments  |
| -------- | ------- | --------- | --------- |
| `develop` | [![CircleCI](https://circleci.com/gh/davesag/route-async/tree/develop.svg?style=svg)](https://circleci.com/gh/davesag/route-async/tree/develop) | [![codecov](https://codecov.io/gh/davesag/route-async/branch/develop/graph/badge.svg)](https://codecov.io/gh/davesag/route-async) | Work in progress |
| `master` | [![CircleCI](https://circleci.com/gh/davesag/route-async/tree/master.svg?style=svg)](https://circleci.com/gh/davesag/route-async/tree/master) | [![codecov](https://codecov.io/gh/davesag/route-async/branch/master/graph/badge.svg)](https://codecov.io/gh/davesag/route-async) | Latest release |

[![NPM](https://nodei.co/npm/route-async.png?compact=true)](https://nodei.co/npm/route-async/)

## To Use

    npm install route-async

## Wrap an `async` route

Assuming you have some async helper function called `someAsync`, you might have a route looking a bit like this:

    const asyncRoute = require('route-async')
    const someAsync = require('./helpers/someAsync')

    const myRoute = async (req, res) => {
      const result = await someAsync(req.body)
      res.json(result)
    }

    module.exports = asyncRoute(myRoute)

The `asyncRoute` wrapper simply takes your route and wraps it, such that the async promise is either resolved internally, or if rejected a `next` function is called. The default `next` is just `console.error` but you can of course supply your own.

### What about if my route wants `next`

Your route should not attempt to handle its own errors, but simply throw an `Error`, or even better an [`HttpError`](https://github.com/jshttp/http-errors) that gets caught by the `async-route` wrapper.

This keeps your core route code much simpler.

## Testing `async` routes

The following example leverages [`mocha`](https://mochajs.org), [`sinon`](https://sinonjs.org), and [`proxyquire`](https://github.com/thlorenz/proxyquire) to unit test the above route.

    const { expect } = require('chai')
    const { spy, stub } = require('sinon')
    const proxyquire = require('proxyquire')

    describe('src/routes/myRoute', () => {
      const mockSomeAsync = stub()

      const myRoute = proxyquire('../../src/routes/myRoute', {
        './helpers/someAsync': mockSomeAsync
      }

      const req = { body: 'some body' }
      const res = { json: stub() }
      const next = spy()

      const resetStubs = () => {
        res.json.resetHistory()
        next.resetHistory()
      }

      context('no errors', () => {
        const result = 'some result'

        before(async () => {
          mockSomeAsync.resolves(result)
          await myRoute(req, res, next)
        })

        after(resetStubs)

        it('called someAsync with the right data', () => {
          expect(mockSomeAsync).to.have.been.calledWith(req.body)
        })

        it('called res.json with the right data', () => {
          expect(res.json).to.have.been.calledWith(result)
        })

        it("didn't call next", () => {
          expect(next).not.to.have.been.called
        })
      })

      context('has errors', () => {
        const error = 'some error'

        before(async () => {
          mockSomeAsync.rejects(error)
          await myRoute(req, res, next)
        })

        after(resetStubs)

        it('called someAsync with the right data', () => {
          expect(mockSomeAsync).to.have.been.calledWith(req.body)
        })

        it("didn't call res.json", () => {
          expect(res.json).not.to.have.been.called
        })

        it('called next with the error', () => {
          expect(next).to.have.been.calledWith(error)
        })
      })
    })

## Development

### Prerequisites

* [NodeJS](htps://nodejs.org), version 10.15.1 (LTS) or better (I use [`nvm`](https://github.com/creationix/nvm) to manage Node versions — `brew install nvm`.)

### Initialisation

    npm install

### Test it

* `npm test` — runs the unit tests (quick and does not need rabbit mq running)
* `npm run test:coverage` — runs the tests with code coverage output.

### Lint it

    npm run lint

## Contributing

Please see the [contributing notes](CONTRIBUTING.md).
