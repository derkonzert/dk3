const { Query } = require("./Query")
const { User } = require("./User")
const { Event } = require("./Event")
const { AuthenticationInfo } = require("./AuthenticationInfo")

module.exports = {
  /* Type Resolvers */
  Query,
  User,
  AuthenticationInfo,
  Event,
  /* TODO: add proper Date type */
}
