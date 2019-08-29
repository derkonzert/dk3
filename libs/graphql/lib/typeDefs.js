const { gql } = require("apollo-server")

// Type definitions define the "shape" of your data and specify
// which ways the data can be fetched from the GraphQL server.
const typeDefs = gql`
  scalar Date

  type User {
    id: String
    email: String
    sendEmails: Boolean
    publicUsername: Boolean
    username: String
    upcomingEvents: [Event]
    skills: [String]
    calendarToken: String
    autoBookmark: Boolean
  }

  type AuthenticationInfo {
    tokenExpiresAt: Date
    softExpiresAt: Date
  }

  type LocationSuggestion {
    name: String!
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
    canceled: Boolean
    postponed: Boolean
    bookmarkedByMe: Boolean
    bookmarkedBy: [User]
    author: User
    fancyness: Int
    recentlyAdded: Int
  }

  type ArchivedEvents {
    events: [Event]
    nextPage: Int
    hasMore: Boolean
    totalCount: Int
  }

  type Query {
    # The viewing user
    me: User
    # Expiration info on used access token
    authInfo: AuthenticationInfo
    # Upcoming events
    upcomingEvents(filter: String): [Event]
    # Find similar events by title
    similarEvents(title: String!): [Event]
    # Past events
    pastEvents(page: Int!): ArchivedEvents
    # Event by ID
    event(id: ID!): Event
    # Locations by search term
    locations(search: String!): [LocationSuggestion]
  }

  input CreateEventInput {
    title: String!
    location: String!
    url: String
    from: Date!
    description: String
    to: Date
    autoBookmark: Boolean
  }

  input UpdateEventInput {
    id: ID!
    title: String
    location: String
    url: String
    from: Date
    description: String
    to: Date
    approved: Boolean
    canceled: Boolean
    postponed: Boolean
  }

  input DeleteEventInput {
    id: ID!
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
    autoBookmark: Boolean
    publicUsername: Boolean
  }

  input UpdateCalendarTokenInput {
    id: ID!
    enableCalendar: Boolean!
  }

  type Mutation {
    # Create an event
    createEvent(input: CreateEventInput!): Event
    # Update an event
    updateEvent(input: UpdateEventInput!): Event
    # Delete an event
    deleteEvent(input: DeleteEventInput!): Event
    # Set approved to true on an event
    approveEvent(input: ApproveEventInput!): Event
    # Bookmark an event
    bookmarkEvent(input: BookmarkEventInput!): Event
    # Update logged in user Mutations
    updateSelf(input: UpdateSelfInput!): User
    # Update logged in users calendar integration token
    updateCalendarToken(input: UpdateCalendarTokenInput!): User
  }
`

module.exports = typeDefs
