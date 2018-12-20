/* Dummy Model for now */
const dummyUserData = {
  _id: 1234,
  username: "Ju",
  email: "jus@email.com",
  plainPassword: "password",
}

class User {
  constructor() {
    this._id = dummyUserData._id
    this.username = dummyUserData.username
    this.email = dummyUserData.email
    this.hash_password = this.createPasswordHash(dummyUserData.plainPassword)
  }

  createPasswordHash(plainPassword) {
    /* TODO: well.. make it a _little bit_ more safe */
    return plainPassword
      .split("")
      .reverse()
      .join("")
  }

  comparePassword(plainPassword) {
    return this.createPasswordHash(plainPassword) === this.hash_password
  }

  save() {
    return this
  }
}

exports.User = User

exports.dummyUserData = dummyUserData

exports.User.findOne = ({ email }) => {
  if (email === dummyUserData.email) {
    return new User()
  }
  return null
}
