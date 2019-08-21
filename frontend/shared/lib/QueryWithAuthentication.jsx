import React from "react"
import { Query } from "react-apollo"

import { LoginForm } from "../form/LoginForm"
import { Title, Text } from "@dk3/ui/atoms/Typography"

import { USER_AUTH_INFO } from "./MutationWithAuthentication"
import { Spinner } from "@dk3/ui/atoms/Spinner"

export const QueryWithAuthentication = ({
  required,
  notLoggedInMessage,
  ...props
}) => (
  <Query query={USER_AUTH_INFO} fetchPolicy="cache-first">
    {({ loading, error, data }) => {
      if (error) return <span>Error loading posts.</span>
      if (required && loading) return <Spinner />

      if (required && !data.me) {
        return (
          <div style={{ maxWidth: "36rem", margin: "5rem auto" }}>
            <Title mt="m">Login required</Title>
            <Text mb="m">{notLoggedInMessage}</Text>
            <LoginForm />
          </div>
        )
      }
      return <Query {...props} />
    }}
  </Query>
)
