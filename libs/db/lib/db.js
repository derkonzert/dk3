const { User } = require("./model/User")

exports.userById = async _id => {
  if (_id === 1234) {
    return new User()
  }
  return null
}
