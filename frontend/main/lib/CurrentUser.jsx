import React from "react"
import { Query, withApollo } from "react-apollo"
import gql from "graphql-tag"

export const currentUserQuery = gql`
  query currentUser {
    me {
      id
      username
      skills
    }
  }
`

export const CurrentUser = withApollo(({ client, children }) => {
  return (
    <Query query={currentUserQuery}>
      {({ data }) => {
        const isLoggedIn = !!data.me
        const user = data.me

        return children({ isLoggedIn, user, client })
      }}
    </Query>
  )
})
