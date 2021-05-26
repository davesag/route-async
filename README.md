# route-async

A route-wrapper allowing use of `async` / `await` syntax in [`Express`](https://expressjs.com) route controllers.

[![NPM](https://nodei.co/npm/route-async.png?compact=true)](https://nodei.co/npm/route-async/)

## To Use

```sh
npm install route-async
```

## Wrap an `async` route

Assuming you have some async helper function called `someAsync`, you might have a route looking a bit like this:

```js
const asyncRoute = require('route-async')
const someAsync = require('./helpers/someAsync')

const myRoute = async (req, res) => {
  const result = await someAsync(req.body)
  res.json(result)
}

module.exports = asyncRoute(myRoute)
```

The `asyncRoute` wrapper simply takes your route and wraps it, such that the `async` promise is either resolved internally, or if rejected a `next` function is called. The default `next` is just `console.error` and you can supply your own.

### What about if my route wants `next`

Your route should not attempt to handle its own errors, but simply throw an `Error`, or even better an [`HttpError`](https://github.com/jshttp/http-errors) that gets caught by the `async-route` wrapper.

This keeps your core route code much simpler.

## Testing `async` routes

The following example leverages [`mocha`](https://mochajs.org), [`sinon`](https://sinonjs.org), and [`proxyquire`](https://github.com/thlorenz/proxyquire) to unit test the above route by supplying a `spy` in the place of the `next` function.

```js
const { expect } = require('chai')
const { spy, stub } = require('sinon')
const proxyquire = require('proxyquire')

describe('src/routes/myRoute', () => {
  const mockSomeAsync = stub()

  const myRoute = proxyquire('../../src/routes/myRoute', {
    './helpers/someAsync': mockSomeAsync
  })

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
```

## Development

### Branches

<!-- prettier-ignore -->
| Branch   | Status  | Coverage  | Audit | Comments  |
| -------- | ------- | --------- | ----- | --------- |
| `develop` | [![CircleCI](https://circleci.com/gh/davesag/route-async/tree/develop.svg?style=svg)](https://circleci.com/gh/davesag/route-async/tree/develop) | [![codecov](https://codecov.io/gh/davesag/route-async/branch/develop/graph/badge.svg)](https://codecov.io/gh/davesag/route-async) | [![Vulnerabilities](https://snyk.io/test/github/davesag/route-async/develop/badge.svg)](https://snyk.io/test/github/davesag/route-async/develop) | Work in progress |
| `main` | [![CircleCI](https://circleci.com/gh/davesag/route-async/tree/main.svg?style=svg)](https://circleci.com/gh/davesag/route-async/tree/main) | [![codecov](https://codecov.io/gh/davesag/route-async/branch/main/graph/badge.svg)](https://codecov.io/gh/davesag/route-async) | [![Vulnerabilities](https://snyk.io/test/github/davesag/route-async/main/badge.svg)](https://snyk.io/test/github/davesag/route-async/main) | Latest release |

### Prerequisites

- [NodeJS](htps://nodejs.org). I use [`nvm`](https://github.com/creationix/nvm) to manage Node versions — `brew install nvm`.

### Initialisation

```sh
npm install
```

### Test it

- `npm test` — runs the unit tests
- `npm run test:unit:cov` — runs the tests with code coverage output.

### Lint it

```sh
npm run lint
```

## Contributing

Please see the [contributing notes](CONTRIBUTING.md).
