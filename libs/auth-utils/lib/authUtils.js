const jwt = require("jsonwebtoken")
const ms = require("ms")
const { TokenExpiredError } = jwt
const config = require("@dk3/config")
const { HTTPStatusError } = require("@dk3/error")
const { dao } = require("@dk3/db")
const { Types: SystemEventTypes } = require("@dk3/db/lib/model/SystemEvent")
const skills = require("@dk3/db/lib/model/userSkills")

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
    /* Parse the token, this will throw if the token has expired */
    await exports.parseJwtToken(emailVerificationToken)

    const user = await dao.userByVerificationToken(emailVerificationToken)

    if (!user) {
      throw new Error("No user associated with given token")
    }

    user.set("emailVerificationToken", null)
    user.emailVerified = true

    await user.save()

    return user
  } catch (err) {
    throw err
  }
}

exports.createDoubleOptInToken = async user => {
  try {
    const { accessToken: token } = await exports.generateTokens(user, {
      expiresIn: "15m",
    })

    user.emailVerificationToken = token

    await user.save()
  } catch (err) {
    throw err
  }

  // Create notification
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
        email: user.email,
        username: user.username,
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
