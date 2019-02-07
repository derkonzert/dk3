const { json } = require("micro")
const {
  graphql,
  typeDefs,
  resolvers,
  createExecutable,
} = require("@dk3/graphql")
const { connect } = require("@dk3/db")
const { sendJson } = require("@dk3/api-utils")
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
    return sendJson(res, 400, { message: queryMissingMessage })
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

    sendJson(res, 200, result)
  } catch (err) {
    sendJson(res, 500, { error: err.message })
  }
}

module.exports.queryMissingMessage = queryMissingMessage
