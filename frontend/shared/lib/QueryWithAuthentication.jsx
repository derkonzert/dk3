import React from "react"
import { Query } from "react-apollo"

import { LoginOrSignUpForm } from "../form/LoginOrSignUpForm"
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
      if (required && loading) return <Spinner />

      if (required && !data.me) {
        return (
          <React.Fragment>
            <SubTitle>Login required</SubTitle>
            <Description>{notLoggedInMessage}</Description>
            <LoginOrSignUpForm />
          </React.Fragment>
        )
      }
      return <Query {...props} />
    }}
  </Query>
)
