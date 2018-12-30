const { json } = require("micro")
const {
  graphql,
  typeDefs,
  resolvers,
  createExecutable,
} = require("@dk3/graphql")
const { getContextFromRequest } = require("./getContextFromRequest")

const schema = createExecutable({ typeDefs, resolvers })

const queryMissingMessage = "query is missing"

module.exports = async (req, res) => {
  const { query, variables, operation } = await json(req)

  if (!query) {
    res.status(400)
    res.end(queryMissingMessage)
    return
  }

  const rootValue = {}
  const contextValue = await getContextFromRequest({ req })

  try {
    const result = await graphql(
      schema,
      query,
      rootValue,
      contextValue,
      variables,
      operation
    )

    res.json(result)
  } catch (err) {
    res.status(500)
    res.json({ error: err.message })
  }
}

module.exports.queryMissingMessage = queryMissingMessage
