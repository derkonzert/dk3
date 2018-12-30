/* also exporting graphql module, to ensure only one instance is created */
module.exports.graphql = require("graphql").graphql

module.exports.resolvers = require("./resolvers")
module.exports.typeDefs = require("./typeDefs")
module.exports.createExecutable = require("./createExecutable")
