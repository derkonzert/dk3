import React from "react"
import { Query } from "react-apollo"
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

export const WhoAmI = () => {
  return (
    <Query query={currentUserQuery}>
      {({ loading, error, data: { me } }) => {
        if (error) return <span>Error loading posts.</span>
        if (loading) return null

        const username = me ? me.username : "anonymous"

        return <Description>whoami: {username}</Description>
      }}
    </Query>
  )
}
