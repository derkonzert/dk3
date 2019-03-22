const { gql } = require("apollo-server")

// Type definitions define the "shape" of your data and specify
// which ways the data can be fetched from the GraphQL server.
const typeDefs = gql`
  scalar Date

  type User {
    id: String
    email: String
    username: String
    upcomingEvents: [Event]
    skills: [String]
  }

  type AuthenticationInfo {
    tokenExpiresAt: Date
    softExpiresAt: Date
  }

  type Event {
    id: String
    title: String
    description: String
    url: String
    to: Date
    from: Date
    created: Date
    artists: [String]
    location: String
    approved: Boolean
    bookmarkedByMe: Boolean
    bookmarkedBy: [User]
    author: User
    fancyness: Int
    recentlyAdded: Int
  }

  type Query {
    # The viewing user
    me: User
    # Expiration info on used access token
    authInfo: AuthenticationInfo
    # Upcoming events
    upcomingEvents(filter: String): [Event]
    # Past events
    pastEvents: [Event]
    # Event by ID
    event(id: ID!): Event
  }

  input CreateEventInput {
    title: String!
    location: String!
    url: String
    from: Date!
    to: Date
  }

  input ApproveEventInput {
    id: ID!
    approved: Boolean!
  }

  input BookmarkEventInput {
    id: ID!
    bookmarked: Boolean!
  }

  type Mutation {
    createEvent(input: CreateEventInput!): Event
    approveEvent(input: ApproveEventInput!): Event
    bookmarkEvent(input: BookmarkEventInput!): Event
  }
`

module.exports = typeDefs
