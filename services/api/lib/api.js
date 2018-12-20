const { ApolloServer } = require("apollo-server-micro")
const { typeDefs, resolvers } = require("@dk3/graphql")
const { context } = require("./context")

module.exports = async (req, res) => {
  /* this is probably not good, but it makes the handler work.  */
  req.url = "/api"

  /** TODO:
   * Creating a new server on each request might not be very performant.
   * Currently needed for dynamic context creation. */
  const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
    context,
  })
  const apolloHandler = apolloServer.createHandler({ path: "/api" })

  await apolloHandler(req, res)
}
