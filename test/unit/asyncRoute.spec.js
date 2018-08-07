const { expect } = require('chai')
const sinon = require('sinon')

const asyncRoute = require('../../src/asyncRoute')
const doTest = require('./asyncRouteTests')

describe('src/asyncRoute', () => {
  doTest(asyncRoute)
})
