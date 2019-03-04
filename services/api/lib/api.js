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

const handleGqlQuery = (
  { query, variables, operation },
  rootValue,
  contextValue
) => graphql(schema, query, rootValue, contextValue, variables, operation)

module.exports = async (req, res) => {
  const body = await json(req)
  const isBatch = Array.isArray(body)

  let gqlRequests = isBatch ? body : [body]

  if (!dbConnection) {
    dbConnection = await connect()
  }

  if (gqlRequests.find(({ query }) => !query)) {
    return sendJson(res, 400, { message: queryMissingMessage })
  }

  const rootValue = {}
  const contextValue = await createGraphQlContext({ req })

  const results = await Promise.all(
    gqlRequests.map(request => {
      return handleGqlQuery(request, rootValue, contextValue)
    })
  )

  try {
    if (isBatch) {
      sendJson(res, 200, results)
    } else {
      sendJson(res, 200, results[0])
    }
  } catch (err) {
    sendJson(res, 500, { error: err.message })
  }
}

module.exports.queryMissingMessage = queryMissingMessage
