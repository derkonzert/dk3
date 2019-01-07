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

  type Event {
    id: String
    title: String
    to: Date
    from: Date
    created: Date
    artists: [String]
    approved: Boolean
    likedByMe: Boolean
    likedBy: [User]
    author: User
  }

  type Query {
    # The viewing user
    me: User
    # Expiration info on used access token
    authInfo: AuthenticationInfo
    # Upcoming events
    upcomingEvents: [Event]
    # Past events
    pastEvents: [Event]
  }
`

module.exports = typeDefs
