// eslint-disable-next-line no-console
const defaultErrorHandler = console.error

const asyncRoute =
  route =>
  (req, res, next = defaultErrorHandler) =>
    Promise.resolve(route(req, res)).catch(next)

module.exports = asyncRoute
