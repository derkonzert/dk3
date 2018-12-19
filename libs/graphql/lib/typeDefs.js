const { gql } = require("apollo-server")

// Type definitions define the "shape" of your data and specify
// which ways the data can be fetched from the GraphQL server.
const typeDefs = gql`
  scalar Date

  type User {
    id: String
    email: String
    fullName: String
  }

  type Query {
    # The viewing user
    me: User
  }
`

module.exports = typeDefs
