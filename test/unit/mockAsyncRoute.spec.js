const { expect } = require('chai')

const mockAsyncRoute = require('../../src/mockAsyncRoute')
const doTest = require('./asyncRouteTests')

describe('src/mockAsyncRoute', () => {
  doTest(mockAsyncRoute)
  context('mock specific properties', () => {
    it('has a @noCallThru property', () => {
      expect(mockAsyncRoute).to.have.property('@noCallThru', true)
    })
  })
})
