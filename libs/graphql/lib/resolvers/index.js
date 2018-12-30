const { me } = require("./me")
const { authInfo } = require("./authInfo")
const { User } = require("./User")
const { AuthenticationInfo } = require("./AuthenticationInfo")

module.exports = {
  Query: {
    me,
    authInfo,
  },
  /* Type Resolvers */
  User,
  AuthenticationInfo,
  /* TODO: add proper Date type */
}
