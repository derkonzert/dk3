const jwt = require("jsonwebtoken")
const ms = require("ms")
const { TokenExpiredError } = jwt
const config = require("@dk3/config")
const { HTTPStatusError } = require("@dk3/error")
const { dao } = require("@dk3/db")
const { Types: SystemEventTypes } = require("@dk3/db/lib/model/SystemEvent")
const skills = require("@dk3/db/lib/model/userSkills")

const generateBasicToken = async () =>
  new Promise((resolve, reject) => {
    require("crypto").randomBytes(48, function(err, buffer) {
      if (err) {
        return reject(err)
      }

      const token = buffer.toString("hex")
      resolve(token)
    })
  })

exports.signUp = async data => {
  try {
    const user = await dao.createUser(data)

    await exports.createDoubleOptInToken(user)
    await dao.emitSystemEvent(SystemEventTypes.doiRequested, {
      emittedBy: user._id,
    })

    return true
  } catch (err) {
    throw err
  }
}

exports.verifyEmail = async emailVerificationToken => {
  try {
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
  } catch (err) {
    throw err
  }
}

exports.createDoubleOptInToken = async user => {
  try {
    const token = await generateBasicToken()

    user.emailVerificationToken = token
    user.emailVerificationTokenExpiresAt = Date.now() + ms("30min")

    await user.save()
  } catch (err) {
    throw err
  }
}

const absoluteTimestampInSeconds = milliseconds =>
  Math.floor((Date.now() + milliseconds) / 1000)

exports.generateTokens = async (user, options = {}) => {
  const softExpIn = absoluteTimestampInSeconds(
    ms(config.get("ACCESS_TOKEN_SOFT_EXPIRE"))
  )

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
        expiresIn: options.expiresIn || config.get("ACCESS_TOKEN_LIFE"),
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

  return { accessToken }
}

exports.signIn = async (email, password) => {
  try {
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

    const tokens = await exports.generateTokens(user)

    return tokens
  } catch (err) {
    throw err
  }
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

  try {
    const user = await dao.userByEmail(email)

    if (!user) {
      throw new Error("No user found for given email")
    }

    user.passwordResetToken = await generateBasicToken()
    user.passwordResetTokenExpiresAt = Date.now() + ms("15min")

    await user.save()

    await dao.emitSystemEvent(SystemEventTypes.passwordResetRequested, {
      emittedBy: user._id,
    })
  } catch (err) {
    throw err
  }
}
exports.passwordReset = async (passwordResetToken, password) => {
  if (!password || password.length < 8) {
    throw new Error(
      "Password does not match requirements: min length 8 characters"
    )
  }

  try {
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
  } catch (err) {
    throw err
  }
}
