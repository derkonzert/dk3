const gqlTools = require("graphql-tools");

module.exports = ({ typeDefs, resolvers, ...rest }) =>
  gqlTools.makeExecutableSchema({
    typeDefs,
    resolvers,
    ...rest
  });
