/* Dummy Model for now */
const dummyUserData = {
  fullName: "Ju",
  email: "jus@email.com",
  plainPassword: "password",
}

class User {
  constructor() {
    this.fullName = dummyUserData.fullName
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
