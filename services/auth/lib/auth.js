const { json } = require("micro")
const url = require("url")

const {
  signUp,
  signIn,
  verifyEmail,
  passwordReset,
  requestPasswordReset,
} = require("@dk3/auth-utils")
const { message } = require("@dk3/logger")
const { sendJson } = require("@dk3/api-utils")
const { HTTPStatusError } = require("@dk3/error")
const { connect, dao } = require("@dk3/db")

let dbConnection

module.exports = async function auth(req, res) {
  try {
    if (!dbConnection) {
      dbConnection = connect()
    }

    let body
    const { query } = url.parse(req.url, true)

    switch (query.operation) {
      case "unique-username":
        body = await json(req)

        if (!body.check) {
          throw new HTTPStatusError({
            title: "Missing property",
            statusCode: 400,
          })
        }

        try {
          const isUnique = await dao.isUniqueUsername(body.check)

          return sendJson(res, 200, {
            isUnique,
          })
        } catch (err) {
          throw new HTTPStatusError({ title: err.message, statusCode: 400 })
        }

      case "unique-email":
        body = await json(req)

        if (!body.check) {
          throw new HTTPStatusError({
            title: "Missing property",
            statusCode: 400,
          })
        }

        try {
          const isUnique = await dao.isUniqueEmail(body.check)

          return sendJson(res, 200, {
            isUnique,
          })
        } catch (err) {
          throw new HTTPStatusError({ title: err.message, statusCode: 400 })
        }

      case "verify-email":
        body = await json(req)

        const { token } = body

        if (!token) {
          await message("E-Mail verification failed: no token given")

          throw new HTTPStatusError({
            title: "No token to verify",
            statusCode: 400,
          })
        }

        try {
          await verifyEmail(token)

          await message("E-Mail successfully verified")
        } catch (err) {
          await message("E-Mail verification failed")

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
          await message("Sign up successful")
        } catch (err) {
          await message("New account signup failed")
          throw new HTTPStatusError({ title: err.message, statusCode: 400 })
        }

        return sendJson(res, 201, { success: true, message: "User created" })

      case "signIn":
        body = await json(req)

        const payload = await signIn(body.email, body.password)

        return sendJson(res, 200, {
          accessToken: payload.accessToken,
          expiresAt: payload.expiresAt,
          lastLogin: payload.lastLogin,
        })

      case "requestPasswordReset":
        body = await json(req)

        try {
          await requestPasswordReset(body.email)
          await message("Password reset requested")

          return sendJson(res, 200, { message: "Password reset requested" })
        } catch (err) {
          await message("Password reset request failed")
          throw new HTTPStatusError({ title: err.message, statusCode: 400 })
        }
      case "passwordReset":
        body = await json(req)

        try {
          await passwordReset(body.token, body.password)

          await message("Password reset successful")

          return sendJson(res, 200, { message: "Password reset" })
        } catch (err) {
          await message("Password reset failed")

          throw new HTTPStatusError({ title: err.message, statusCode: 400 })
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
