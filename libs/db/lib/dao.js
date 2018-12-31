const { User } = require("./model/User")

exports.createUser = async data => {
  try {
    const passwordHash = User.createPasswordHash(data.password)

    const user = await User.create({ ...data, passwordHash })

    await user.save()

    return user
  } catch (err) {
    throw err
  }
}

exports.userById = async _id => await User.findById(_id).exec()

exports.userByEmail = async email => await User.findOne({ email }).exec()
