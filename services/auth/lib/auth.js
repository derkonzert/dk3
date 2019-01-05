const { json } = require("micro")
const url = require("url")

const { register, signIn, getUserFromRequest } = require("@dk3/auth-utils")
const { HTTPStatusError } = require("@dk3/error")
const { connect } = require("@dk3/db")

let dbConnection

module.exports = async function auth(req, res) {
  try {
    if (!dbConnection) {
      dbConnection = connect()
    }

    let body
    const { query } = url.parse(req.url, true)

    switch (query.operation) {
      case "register":
        body = await json(req)

        try {
          await register(body)
        } catch (err) {
          throw new HTTPStatusError({ title: err.message, statusCode: 400 })
        }

        return res.json({ message: "User created" })

      case "signIn":
        body = await json(req)

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
          res.status(err.statusCode)
          return res.json({
            message: err.message,
          })
        }
      default:
        throw new HTTPStatusError({ title: "Not found", statusCode: 404 })
    }
  } catch (err) {
    res.status(err.statusCode || 500)

    return res.json({
      message: err.message,
    })
  }
}
