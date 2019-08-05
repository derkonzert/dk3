const jwt = require("jsonwebtoken")
const ms = require("ms")
const { TokenExpiredError } = jwt
const config = require("@dk3/config")
const { HTTPStatusError } = require("@dk3/error")
const { dao } = require("@dk3/db")
const { sendDoubleOptInMail, sendPasswordResetMail } = require("@dk3/mailer")
const skills = require("@dk3/db/lib/model/userSkills")

exports.signUp = async data => {
  const user = await dao.createUser(data)

  await user.createDoubleOptInToken()

  await sendDoubleOptInMail(user)

  return true
}

exports.verifyEmail = async emailVerificationToken => {
  const user = await dao.userByVerificationToken(emailVerificationToken)

  if (!user) {
    throw new Error("No user associated with given token")
  }

  if (user.emailVerificationTokenExpiresAt < Date.now()) {
    throw new Error("Token has expired")
  }

  user.set("emailVerificationToken", null)
  user.set("emailVerificationTokenExpiresAt", null)
  user.emailVerified = true
  user.skills.push(skills.LOGIN)

  await user.save()

  return user
}

const absoluteTimestampInSeconds = milliseconds =>
  Math.floor((Date.now() + milliseconds) / 1000)

exports.generateTokens = async (user, options = {}) => {
  const softExpIn = absoluteTimestampInSeconds(
    ms(config.get("ACCESS_TOKEN_SOFT_EXPIRE"))
  )

  const expiresIn = options.expiresIn || config.get("ACCESS_TOKEN_LIFE")

  const expiresAt = Date.now() + ms(expiresIn)

  const accessToken = await new Promise((resolve, reject) =>
    jwt.sign(
      {
        _id: user._id,
        shortId: user.shortId,
        softExpIn,
      },
      config.get("JWT_SECRET"),
      {
        algorithm: "HS512",
        expiresIn,
      },
      (err, token) => {
        if (err) {
          reject(err)
        } else {
          resolve(token)
        }
      }
    )
  )

  return { accessToken, expiresAt }
}

exports.signIn = async (email, password) => {
  const user = await dao.userByEmail(email)

  if (!user) {
    throw new HTTPStatusError({ title: "User not found", statusCode: 401 })
  }

  const passwordsMatch = user.comparePassword(password)

  if (!passwordsMatch) {
    throw new HTTPStatusError({ title: "Wrong credentials", statusCode: 401 })
  }

  if (!user.hasSkill(skills.LOGIN)) {
    throw new HTTPStatusError({
      title: "User is not authorized",
      statusCode: 401,
    })
  }

  const { lastLogin } = user

  user.lastLogin = new Date()
  await user.save()

  const { accessToken, expiresAt } = await exports.generateTokens(user)

  return { lastLogin, accessToken, expiresAt }
}

exports.parseJwtToken = token =>
  new Promise((resolve, reject) =>
    jwt.verify(
      token,
      config.get("JWT_SECRET"),
      {
        algorithm: "HS512",
      },
      (err, payload) => {
        if (err) {
          reject(err)
        } else {
          resolve(payload)
        }
      }
    )
  )

exports.getUserFromRequest = async req => {
  if (
    req.headers &&
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ") &&
    req.headers.authorization.split(" ")[0] === "Bearer"
  ) {
    try {
      const payload = await exports.parseJwtToken(
        req.headers.authorization.split(" ")[1]
      )

      payload.softExpired = true

      if (
        payload.softExpIn &&
        payload.softExpIn > Math.floor(Date.now() / 1000)
      ) {
        // Access token has "soft expired", meaning it's not allowed to
        // perform "critical" actionns
        payload.softExpired = false
      }

      return payload
    } catch (err) {
      if (err instanceof TokenExpiredError) {
        throw new HTTPStatusError({
          title: "Access token has expired",
          statusCode: 401,
        })
      } else {
        throw new HTTPStatusError({ title: err.message, statusCode: 401 })
      }
    }
  }

  throw new HTTPStatusError({ title: "Not authenticated", statusCode: 401 })
}

exports.requestPasswordReset = async email => {
  if (!email) {
    throw new Error("No email given")
  }

  const user = await dao.userByEmail(email)

  if (!user) {
    throw new Error("No user found for given email")
  }

  await user.createPasswordResetToken()

  await sendPasswordResetMail(user)
}
exports.passwordReset = async (passwordResetToken, password) => {
  if (!passwordResetToken) {
    throw new Error("No token given")
  }

  if (!password || password.length < 8) {
    throw new Error(
      "Password does not match requirements: min length 8 characters"
    )
  }

  const user = await dao.userByPasswordResetToken(passwordResetToken)

  if (!user) {
    throw new Error("No user associated with given token")
  }

  if (user.passwordResetTokenExpiresAt < Date.now()) {
    throw new Error("Token has expired")
  }

  await dao.updateUserPassword({ password, userId: user._id })

  user.set("passwordResetToken", null)
  user.set("passwordResetTokenExpiresAt", null)

  await user.save()
}
