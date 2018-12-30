const { gql } = require("apollo-server")

// Type definitions define the "shape" of your data and specify
// which ways the data can be fetched from the GraphQL server.
const typeDefs = gql`
  scalar Date

  type User {
    _id: String
    email: String
    username: String
  }

  type AuthenticationInfo {
    tokenExpiresAt: Date
    softExpiresAt: Date
  }

  type Query {
    # The viewing user
    me: User
    authInfo: AuthenticationInfo
  }
`

module.exports = typeDefs
