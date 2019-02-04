import React from "react"
import { Query } from "react-apollo"

import { LoginForm } from "../components/form/LoginForm"
import { SubTitle, Description } from "@dk3/ui/atoms/Typography"

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
      if (loading) return <Spinner />

      if (required && !data.me) {
        return (
          <React.Fragment>
            <SubTitle>Login required</SubTitle>
            <Description>{notLoggedInMessage}</Description>
            <LoginForm />
          </React.Fragment>
        )
      }
      return <Query {...props} />
    }}
  </Query>
)
