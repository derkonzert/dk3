const { gql } = require("apollo-server")

// Type definitions define the "shape" of your data and specify
// which ways the data can be fetched from the GraphQL server.
const typeDefs = gql`
  scalar Date

  type User {
    id: String
    email: String
    sendEmails: Boolean
    username: String
    upcomingEvents: [Event]
    skills: [String]
    calendarToken: String
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
    description: String
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

  input UpdateSelfInput {
    id: ID!
    username: String
    sendEmails: Boolean
  }

  input UpdateCalendarTokenInput {
    id: ID!
    enableCalendar: Boolean!
  }

  type Mutation {
    createEvent(input: CreateEventInput!): Event
    approveEvent(input: ApproveEventInput!): Event
    bookmarkEvent(input: BookmarkEventInput!): Event

    updateSelf(input: UpdateSelfInput!): User
    updateCalendarToken(input: UpdateCalendarTokenInput!): User
  }
`

module.exports = typeDefs
