const { Query } = require("./Query")
const { Mutation } = require("./Mutation")
const { User } = require("./User")
const { Event } = require("./Event")
const { AuthenticationInfo } = require("./AuthenticationInfo")

module.exports = {
  /* Type Resolvers */
  Query,
  User,
  AuthenticationInfo,
  Event,
  Mutation,
  /* TODO: add proper Date type */
}
