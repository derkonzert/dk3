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
        if (loading || !me) return null

        return <Description>whoami: {me.username}</Description>
      }}
    </Query>
  )
}
