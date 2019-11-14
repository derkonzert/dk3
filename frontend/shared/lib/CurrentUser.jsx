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

export const CurrentUser = withApollo(
  ({ client, children, requireUser = false, ...props }) => {
    return (
      <Query query={currentUserQuery} {...props}>
        {({ data, error, loading }) => {
          console.log(data, error, loading)
          if (error) {
            return <div>{error.message}</div>
          }

          const isLoggedIn = !!data && !!data.me
          const user = data && data.me

          if (!isLoggedIn && requireUser) {
            return null
          }

          return children({ isLoggedIn, user, loading, client })
        }}
      </Query>
    )
  }
)
