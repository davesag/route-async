const { expect } = require('chai')
const sinon = require('sinon')

const asyncRoute = require('../../src')

describe('src/asyncRoute', () => {
  let asyncFn

  context('when the route resolves', () => {
    asyncFn = sinon.stub()

    before(async () => {
      asyncFn.resolves()
      const route = asyncRoute(asyncFn)
      await route()
    })

    it('invoked the async function', () => {
      expect(asyncFn).to.have.been.calledOnce
    })
  })

  context('when the route throws an error', () => {
    asyncFn = sinon.stub()

    const errorHandler = sinon.spy()
    const err = { message: 'oops' }

    before(async () => {
      asyncFn.rejects(err)
      const route = asyncRoute(asyncFn)
      await route(undefined, undefined, errorHandler)
    })

    it('triggered the error handler', () => {
      expect(errorHandler).to.have.been.calledWith(err)
    })
  })
})
