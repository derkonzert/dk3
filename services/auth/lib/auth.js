const { json } = require("micro")
const url = require("url")
const { register, signIn, getUserFromRequest } = require("@dk3/auth-utils")
const { HTTPStatusError } = require("@dk3/error")

module.exports = async function auth(req, res) {
  try {
    const { query } = url.parse(req.url, true)

    switch (query.operation) {
      case "register":
        const newUser = await register()

        return res.json(newUser)

      case "signIn":
        const body = await json(req)

        try {
          const payload = await signIn(body.email, body.password)

          return res.json({
            accessToken: payload.accessToken,
          })
        } catch (err) {
          throw err
        }

      /* Example route for "secured" content */
      case "secured":
        try {
          const user = await getUserFromRequest(req)

          return res.json(user)
        } catch (err) {
          res.status(err.status)
          return res.json({
            message: err.message,
          })
        }
      default:
        throw new HTTPStatusError("Not found", 404)
    }
  } catch (err) {
    res.status(err.status || 500)

    return res.json({
      message: err.message,
    })
  }
}
