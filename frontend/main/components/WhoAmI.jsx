import React from "react"

import gql from "graphql-tag"

import { Description } from "@dk3/ui/atoms/Typography"

import { CurrentUser } from "@dk3/shared-frontend/lib/CurrentUser"
import { logout } from "@dk3/shared-frontend/lib/withApollo"

export const currentUserQuery = gql`
  query currentUser {
    me {
      id
      username
    }
  }
`

export const WhoAmI = () => (
  <CurrentUser>
    {({ user, isLoggedIn, client }) => {
      const username = isLoggedIn ? user.username : "anonymous"

      return (
        <Description>
          <span>WhoAmI: {username}</span>
          {isLoggedIn && (
            <button
              onClick={() => {
                logout()
                client.resetStore()
              }}
            >
              logout
            </button>
          )}
        </Description>
      )
    }}
  </CurrentUser>
)
