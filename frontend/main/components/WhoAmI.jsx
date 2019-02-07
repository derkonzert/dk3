import React from "react"
import { Query, withApollo } from "react-apollo"
import gql from "graphql-tag"

import { Description } from "@dk3/ui/atoms/Typography"

export const currentUserQuery = gql`
  query currentUser {
    me {
      id
      username
    }
  }
`

export const WhoAmI = withApollo(({ client }) => {
  return (
    <Query query={currentUserQuery}>
      {({ loading, error, data: { me } }) => {
        if (error) return <span>Error loading posts.</span>
        if (loading) return null

        const username = me ? me.username : "anonymous"

        return (
          <Description>
            <span>WhoAmI: {username}</span>
            {!!me && (
              <button
                onClick={() => {
                  localStorage.removeItem("accessToken")
                  client.resetStore()
                }}
              >
                logout
              </button>
            )}
          </Description>
        )
      }}
    </Query>
  )
})
