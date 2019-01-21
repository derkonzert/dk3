const { json } = require("micro")
const {
  graphql,
  typeDefs,
  resolvers,
  createExecutable,
} = require("@dk3/graphql")
const { connect } = require("@dk3/db")
const { createGraphQlContext } = require("./createGraphQlContext")

const schema = createExecutable({ typeDefs, resolvers })

const queryMissingMessage = "query is missing"

let dbConnection

module.exports = async (req, res) => {
  // TODO: Support body being an array of queries (batch)
  const { query, variables, operation } = await json(req)

  if (!dbConnection) {
    dbConnection = await connect()
  }

  if (!query) {
    res.status(400)
    res.end(queryMissingMessage)
    return
  }

  const rootValue = {}
  const contextValue = await createGraphQlContext({ req })

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
