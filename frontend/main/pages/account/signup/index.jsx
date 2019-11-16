import React from "react"

import { withRouter } from "next/router"
import { ListTitle, Description } from "@dk3/ui/atoms/Typography"

import { SignUpForm } from "@dk3/shared-frontend/form/SignUpForm"
import { SentryErrorBoundary } from "@dk3/shared-frontend/lib/SentryErrorBoundary"
import { CurrentUser } from "@dk3/shared-frontend/lib/CurrentUser"

export default withRouter(function Index({ router }) {
  return (
    <SentryErrorBoundary>
      <ListTitle>Sign Up</ListTitle>
      <Description>Create an account</Description>
      <CurrentUser>
        {({ isLoggedIn }) =>
          isLoggedIn ? (
            <div>Looks like you already have an account!</div>
          ) : (
            <SignUpForm
              onSignUp={() => {
                router.replace("/account/signup/success")
              }}
            />
          )
        }
      </CurrentUser>
    </SentryErrorBoundary>
  )
})
