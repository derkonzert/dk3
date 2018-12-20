const jwt = require("jsonwebtoken")
const { TokenExpiredError } = jwt
const config = require("@dk3/config")
const { HTTPStatusError } = require("@dk3/error")
const { User } = require("@dk3/db/lib/model/User")

exports.register = async data => {
  const newUser = new User(data)

  const user = await newUser.save()

  if (!user) {
    throw new Error("Could not create user")
  } else {
    user.hash_password = undefined
    return user
  }
}

exports.signIn = async (email, password) => {
  const user = await User.findOne({
    email,
  })

  if (!user) {
    throw new Error("User not found")
  }

  const passwordsMatch = user.comparePassword(password)

  if (!passwordsMatch) {
    throw new Error("Wrong credentials")
  }

  const token = jwt.sign(
    {
      _id: user._id,
      email: user.email,
      username: user.username,
    },
    config.get("JWT_SECRET"),
    {
      expiresIn: config.get("API_TOKEN_LIFE"),
    }
  )

  return token
}

exports.getUserFromRequest = async req => {
  if (
    req.headers &&
    req.headers.authorization &&
    req.headers.authorization.split(" ")[0] === "JWT"
  ) {
    try {
      const payload = await new Promise((resolve, reject) =>
        jwt.verify(
          req.headers.authorization.split(" ")[1],
          config.get("JWT_SECRET"),
          (err, payload) => {
            if (err) {
              reject(err)
            } else {
              resolve(payload)
            }
          }
        )
      )
      return payload
    } catch (err) {
      if (err instanceof TokenExpiredError) {
        throw new HTTPStatusError("Access token has expired", 401)
      } else {
        throw new HTTPStatusError("Token mismatch", 401)
      }
    }
  }

  throw new HTTPStatusError("Not authenticated", 401)
}
