const { json } = require("micro")
const url = require("url")

const {
  signUp,
  signIn,
  verifyEmail,
  passwordReset,
  requestPasswordReset,
} = require("@dk3/auth-utils")
const { sendJson } = require("@dk3/api-utils")
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
      case "verify-email":
        body = await json(req)

        const { token } = body

        if (!token) {
          throw new HTTPStatusError({
            title: "No token to verify",
            statusCode: 400,
          })
        }

        try {
          await verifyEmail(token)
        } catch (err) {
          throw new HTTPStatusError({
            title: err.message,
            statusCode: 400,
          })
        }

        return sendJson(res, 200, { message: "E-Mail verified" })
      case "signUp":
        body = await json(req)

        try {
          await signUp(body)
        } catch (err) {
          throw new HTTPStatusError({ title: err.message, statusCode: 400 })
        }

        return sendJson(res, 201, { message: "User created" })

      case "signIn":
        body = await json(req)

        try {
          const payload = await signIn(body.email, body.password)

          return sendJson(res, 200, {
            accessToken: payload.accessToken,
            expiresAt: payload.expiresAt,
            lastLogin: payload.lastLogin,
          })
        } catch (err) {
          throw err
        }

      case "requestPasswordReset":
        body = await json(req)

        try {
          await requestPasswordReset(body.email)

          return sendJson(res, 200, { message: "Password reset requested" })
        } catch (err) {
          throw err
        }
      case "passwordReset":
        body = await json(req)

        try {
          await passwordReset(body.token, body.password)

          return sendJson(res, 200, { message: "Password reset" })
        } catch (err) {
          throw err
        }

      default:
        throw new HTTPStatusError({ title: "Not found", statusCode: 404 })
    }
  } catch (err) {
    return sendJson(res, err.statusCode || 500, {
      message: err.message,
    })
  }
}
