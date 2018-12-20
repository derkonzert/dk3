const { ApolloServer } = require("apollo-server-micro")
const { typeDefs, resolvers } = require("@dk3/graphql")

module.exports = async (req, res) => {
  /* this is probably not good, but it makes the handler work.  */
  req.url = "/api"

  /* TODO: Creating a new server on each request, currently only for jest mocks.. */
  const apolloServer = new ApolloServer({ typeDefs, resolvers })
  const apolloHandler = apolloServer.createHandler({ path: "/api" })

  await apolloHandler(req, res)
}
