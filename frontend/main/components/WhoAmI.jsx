import React from "react"
import { Query } from "react-apollo"
import gql from "graphql-tag"

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
        if (loading) return <div>Loading</div>

        const username = me ? me.username : "not logged in"

        return <React.Fragment>User is {username}</React.Fragment>
      }}
    </Query>
  )
}
