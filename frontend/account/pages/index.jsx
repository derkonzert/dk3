import React from "react"
import { withRouter } from "next/router"
import Link from "next/link"

import { CurrentUser } from "@dk3/shared-frontend/lib/CurrentUser"
import {
  MegaTitle,
  Description,
  Link as UILink,
} from "@dk3/ui/atoms/Typography"

import { LoginForm } from "@dk3/shared-frontend/form/LoginForm"

export default withRouter(function Index({ router }) {
  return (
    <React.Fragment>
      <MegaTitle>Login</MegaTitle>
      <Description>Enter your credentials to sign in</Description>
      <CurrentUser>
        {({ isLoggedIn }) => {
          if (isLoggedIn) {
            return <div>You are already logged in</div>
          }

          return (
            <React.Fragment>
              <LoginForm
                onLogin={() => {
                  router.go("/")
                }}
              />
              <Link href="signup">
                <UILink>Create an account</UILink>
              </Link>
            </React.Fragment>
          )
        }}
      </CurrentUser>
    </React.Fragment>
  )
})
