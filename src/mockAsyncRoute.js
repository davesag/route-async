/* istanbul ignore next */
const noop = () => {}

const mockAsyncRoute = route => (req, res, next = noop) => {
  Promise.resolve(route(req, res)).catch(next)
}
mockAsyncRoute['@noCallThru'] = true

module.exports = mockAsyncRoute
