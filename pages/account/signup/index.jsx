import React from "react"

import { withRouter } from "next/router"
import { ListTitle, Description } from "@dk3/ui/atoms/Typography"

import { SignUpForm } from "../../../components/form/SignUpForm"
import { SentryErrorBoundary } from "../../../components/SentryErrorBoundary"
import { CurrentUser } from "../../../components/CurrentUser"
import { PageWrapper } from "../../../components/PageWrapper"

export default withRouter(function Index({ router }) {
  return (
    <SentryErrorBoundary>
      <PageWrapper>
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
      </PageWrapper>
    </SentryErrorBoundary>
  )
})
