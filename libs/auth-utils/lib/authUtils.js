const jwt = require("jsonwebtoken")
const config = require("@dk3/config")
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
      email: user.email,
      fullName: user.fullName,
    },
    config.get("JWT_SECRET")
  )

  return token
}

exports.authenticatedRequest = handler => async (req, res) => {
  if (
    req.headers &&
    req.headers.authorization &&
    req.headers.authorization.split(" ")[0] === "JWT"
  ) {
    jwt.verify(
      req.headers.authorization.split(" ")[1],
      config.get("JWT_SECRET"),
      (err, decode) => {
        if (!err) {
          req.user = decode
        }

        handler(req, res)
      }
    )
  } else {
    handler(req, res)
  }
}
